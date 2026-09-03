-- ============================================================
-- TIRUMALA VERSE — EVENT NOTIFICATIONS PHASE 1 SCHEMA MIGRATION
-- Database & Schema Foundation for Event Notifications
-- ============================================================

-- 1. PUSH SUBSCRIPTIONS SCHEMA EXTENSION
-- Add subscribed_temples column if it does not exist (defaulting to both eligible temples)
ALTER TABLE public.push_subscriptions 
    ADD COLUMN IF NOT EXISTS subscribed_temples TEXT[] DEFAULT ARRAY['tirumala-main', 'tiruchanur'];

-- Idempotent Backfill: Ensure any pre-existing subscriptions remain valid and active for both eligible temples
UPDATE public.push_subscriptions 
    SET subscribed_temples = ARRAY['tirumala-main', 'tiruchanur'] 
    WHERE subscribed_temples IS NULL OR array_length(subscribed_temples, 1) IS NULL;

-- Index for efficient temple-filtered subscriber lookups during notification dispatch
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_temples 
    ON public.push_subscriptions USING GIN (subscribed_temples)
    WHERE is_active = true;


-- 2. PUBLIC EVENTS SCHEMA EXTENSION
-- Add structured event start_time field (TIME WITHOUT TIME ZONE, nullable for all-day events)
-- Add cancellation tracking flag (is_cancelled BOOLEAN, defaulting to false)
-- Add notification eligibility flag (notification_eligible BOOLEAN, defaulting to true)
-- Existing human-readable time field and description are preserved intact.
ALTER TABLE public.events 
    ADD COLUMN IF NOT EXISTS start_time TIME,
    ADD COLUMN IF NOT EXISTS is_cancelled BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS notification_eligible BOOLEAN DEFAULT true;


-- 3. HARDENED REGISTRATION RPC WITH TEMPLE FILTERING & VALIDATION
-- Drop old 4-parameter overload to ensure PostgreSQL RPC signature resolution clarity
DROP FUNCTION IF EXISTS public.register_push_subscription(TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.register_push_subscription(
    p_endpoint TEXT,
    p_p256dh TEXT,
    p_auth TEXT,
    p_user_agent TEXT DEFAULT NULL,
    p_subscribed_temples TEXT[] DEFAULT ARRAY['tirumala-main', 'tiruchanur']
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_id UUID;
    v_filtered_temples TEXT[];
BEGIN
    -- Input validation
    IF p_endpoint IS NULL OR length(trim(p_endpoint)) < 20 OR
       p_p256dh IS NULL OR length(trim(p_p256dh)) < 10 OR
       p_auth IS NULL OR length(trim(p_auth)) < 5 THEN
        RAISE EXCEPTION 'Invalid push subscription parameters.';
    END IF;

    -- Validate and filter supplied temple preferences:
    -- STRICT ELIGIBILITY: Allow ONLY 'tirumala-main' and 'tiruchanur'. Discard all other temple IDs.
    IF p_subscribed_temples IS NOT NULL AND array_length(p_subscribed_temples, 1) > 0 THEN
        SELECT ARRAY_AGG(DISTINCT t) INTO v_filtered_temples
        FROM unnest(p_subscribed_temples) AS t
        WHERE t IN ('tirumala-main', 'tiruchanur');
    END IF;

    -- Default to both eligible temples if no valid preferences remain or if omitted
    IF v_filtered_temples IS NULL OR array_length(v_filtered_temples, 1) IS NULL THEN
        v_filtered_temples := ARRAY['tirumala-main', 'tiruchanur'];
    END IF;

    INSERT INTO public.push_subscriptions (
        endpoint,
        p256dh,
        auth,
        user_agent,
        is_active,
        failure_count,
        updated_at,
        subscribed_temples
    )
    VALUES (
        trim(p_endpoint),
        trim(p_p256dh),
        trim(p_auth),
        left(p_user_agent, 255),
        true,
        0,
        now(),
        v_filtered_temples
    )
    ON CONFLICT (endpoint) DO UPDATE SET
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth,
        user_agent = EXCLUDED.user_agent,
        is_active = true,
        failure_count = 0,
        updated_at = now(),
        subscribed_temples = EXCLUDED.subscribed_temples
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;

-- Grant execution privileges to anon and authenticated roles
GRANT EXECUTE ON FUNCTION public.register_push_subscription(TEXT, TEXT, TEXT, TEXT, TEXT[]) TO anon, authenticated;
