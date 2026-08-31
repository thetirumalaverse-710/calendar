-- ============================================================
-- TIRUMALA VERSE — WEB PUSH NOTIFICATION DATABASE ARCHITECTURE
-- ============================================================

-- 1. PUSH SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    failure_count INT DEFAULT 0,
    last_success_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active 
    ON public.push_subscriptions(is_active) 
    WHERE is_active = true;

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Strict Zero-Trust Boundary: Deny all direct client access
CREATE POLICY "No direct client insert" ON public.push_subscriptions FOR INSERT TO anon, authenticated WITH CHECK (false);
CREATE POLICY "No direct client select" ON public.push_subscriptions FOR SELECT TO anon, authenticated USING (false);
CREATE POLICY "No direct client update" ON public.push_subscriptions FOR UPDATE TO anon, authenticated USING (false);
CREATE POLICY "No direct client delete" ON public.push_subscriptions FOR DELETE TO anon, authenticated USING (false);

-- 2. HARDENED REGISTRATION RPC
CREATE OR REPLACE FUNCTION public.register_push_subscription(
    p_endpoint TEXT,
    p_p256dh TEXT,
    p_auth TEXT,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_endpoint IS NULL OR length(trim(p_endpoint)) < 20 OR
       p_p256dh IS NULL OR length(trim(p_p256dh)) < 10 OR
       p_auth IS NULL OR length(trim(p_auth)) < 5 THEN
        RAISE EXCEPTION 'Invalid push subscription parameters.';
    END IF;

    INSERT INTO public.push_subscriptions (
        endpoint,
        p256dh,
        auth,
        user_agent,
        is_active,
        failure_count,
        updated_at
    )
    VALUES (
        trim(p_endpoint),
        trim(p_p256dh),
        trim(p_auth),
        left(p_user_agent, 255),
        true,
        0,
        now()
    )
    ON CONFLICT (endpoint) DO UPDATE SET
        p256dh = EXCLUDED.p256dh,
        auth = EXCLUDED.auth,
        user_agent = EXCLUDED.user_agent,
        is_active = true,
        failure_count = 0,
        updated_at = now()
    RETURNING id INTO v_id;

    RETURN v_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.register_push_subscription(TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- 3. HARDENED UNSUBSCRIBE RPC
CREATE OR REPLACE FUNCTION public.unsubscribe_push_subscription(p_endpoint TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF p_endpoint IS NULL OR length(trim(p_endpoint)) < 20 THEN
        RETURN false;
    END IF;

    UPDATE public.push_subscriptions
    SET is_active = false, updated_at = now()
    WHERE endpoint = trim(p_endpoint);

    RETURN FOUND;
END;
$$;

GRANT EXECUTE ON FUNCTION public.unsubscribe_push_subscription(TEXT) TO anon, authenticated;

-- 4. DUPLICATE PREVENTION LOG TABLE
CREATE TABLE IF NOT EXISTS public.notification_dispatch_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    subscription_id UUID NOT NULL REFERENCES public.push_subscriptions(id) ON DELETE CASCADE,
    dispatched_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_dispatch_per_sub UNIQUE (notification_type, entity_id, subscription_id)
);

ALTER TABLE public.notification_dispatch_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "No public access dispatch logs" ON public.notification_dispatch_logs FOR ALL TO anon, authenticated USING (false);

-- 5. ADMIN CUSTOM NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.admin_custom_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    url TEXT NOT NULL DEFAULT 'https://thetirumalaverse.in/',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'dispatching', 'completed', 'failed')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    dispatched_at TIMESTAMPTZ,
    recipient_count INT DEFAULT 0,
    success_count INT DEFAULT 0,
    failure_count INT DEFAULT 0,
    deactivated_count INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_admin_custom_notifications_status
    ON public.admin_custom_notifications(status);

CREATE INDEX IF NOT EXISTS idx_admin_custom_notifications_created_at
    ON public.admin_custom_notifications(created_at DESC);

ALTER TABLE public.admin_custom_notifications ENABLE ROW LEVEL SECURITY;

-- Strict RLS: Anon users get ZERO access
CREATE POLICY "No anon access custom notifications"
    ON public.admin_custom_notifications FOR ALL TO anon USING (false);

-- Strict Admin RLS: Only authorized admin account can SELECT/INSERT
CREATE POLICY "Admin select custom notifications"
    ON public.admin_custom_notifications FOR SELECT TO authenticated
    USING (
        auth.uid() = '7cf7f7f7-7216-4296-8ab3-bb4a78a4b7db'::uuid OR
        (auth.jwt() ->> 'email') = 'admin@thetirumalaverse.in'
    );

CREATE POLICY "Admin insert custom notifications"
    ON public.admin_custom_notifications FOR INSERT TO authenticated
    WITH CHECK (
        auth.uid() = '7cf7f7f7-7216-4296-8ab3-bb4a78a4b7db'::uuid OR
        (auth.jwt() ->> 'email') = 'admin@thetirumalaverse.in'
    );

-- 6. SUBSCRIBER COUNT SECURE RPC
CREATE OR REPLACE FUNCTION public.get_active_push_subscriptions_count()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_count INT;
BEGIN
    IF auth.uid() IS NULL OR (
        auth.uid() != '7cf7f7f7-7216-4296-8ab3-bb4a78a4b7db'::uuid AND
        coalesce(auth.jwt() ->> 'email', '') != 'admin@thetirumalaverse.in'
    ) THEN
        RAISE EXCEPTION 'Access denied. Only authorized admin can query subscriber counts.';
    END IF;

    SELECT COUNT(*)::INT INTO v_count
    FROM public.push_subscriptions
    WHERE is_active = true;

    RETURN v_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_active_push_subscriptions_count() TO authenticated;

-- 7. ATOMIC DISPATCH CLAIM RPC (Per Subscription)
-- Eliminates race conditions by attempting atomic INSERT before network delivery.
-- Returns true if claim succeeded, false if already claimed by another worker process.
CREATE OR REPLACE FUNCTION public.claim_notification_dispatch(
    p_notification_type TEXT,
    p_entity_id TEXT,
    p_subscription_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.notification_dispatch_logs (
        notification_type,
        entity_id,
        subscription_id,
        dispatched_at
    )
    VALUES (
        p_notification_type,
        p_entity_id,
        p_subscription_id,
        now()
    )
    ON CONFLICT (notification_type, entity_id, subscription_id) DO NOTHING;

    RETURN FOUND;
END;
$$;

-- 8. ATOMIC ADMIN NOTIFICATION CLAIM RPC (Per Notification Row)
-- Ensures only one worker process claims a pending admin notification.
CREATE OR REPLACE FUNCTION public.claim_admin_notification(p_notification_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_updated INT;
BEGIN
    UPDATE public.admin_custom_notifications
    SET status = 'dispatching', dispatched_at = now()
    WHERE id = p_notification_id AND status = 'pending';

    GET DIAGNOSTICS v_updated = ROW_COUNT;
    RETURN v_updated > 0;
END;
$$;
