-- ============================================================
-- TIRUMALA VERSE — EVENT TIMINGS SCHEMA EXTENSION
-- Database schema migration for admin-configurable event timings
-- ============================================================

-- 1. Add end_time (TIME WITHOUT TIME ZONE, nullable when event has no explicit end time)
-- 2. Add timing_source (TEXT, default 'default', set to 'admin' when explicitly set)
ALTER TABLE public.events 
    ADD COLUMN IF NOT EXISTS end_time TIME,
    ADD COLUMN IF NOT EXISTS timing_source TEXT DEFAULT 'default';

-- Comment documentation
COMMENT ON COLUMN public.events.start_time IS 'Event start time in IST (Asia/Kolkata)';
COMMENT ON COLUMN public.events.end_time IS 'Optional event end time in IST (Asia/Kolkata)';
COMMENT ON COLUMN public.events.timing_source IS 'Source of timing: "admin" (explicit) or "default" (7:00 AM fallback)';
