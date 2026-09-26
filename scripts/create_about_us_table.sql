-- ============================================================
-- About Us — SINGLE TABLE for Admin + Public
-- Run in: Supabase → SQL Editor → New Query → RUN
-- ============================================================

-- Drop old duplicate tables (safe: data already in admin_about_us)
-- Only uncomment below if you're sure data is backed up:
-- DROP TABLE IF EXISTS public.bv_about_us_state CASCADE;
-- DROP TABLE IF EXISTS public.admin_about_us CASCADE;

-- 1. Create the ONE unified table
CREATE TABLE IF NOT EXISTS public.bv_about_us (
  id             VARCHAR(100)  PRIMARY KEY,          -- section key: 'about_hospital', 'history', etc.
  section_name   VARCHAR(200)  NOT NULL,             -- display label for admin sidebar
  section_type   VARCHAR(50)   DEFAULT 'object',     -- 'object' | 'array'
  state_data     JSONB         NOT NULL DEFAULT '{}',-- all content for this section
  display_order  INT           DEFAULT 0,            -- controls ordering in admin & public
  is_active      BOOLEAN       DEFAULT true,         -- false = hidden from public site
  created_at     TIMESTAMPTZ   DEFAULT NOW(),
  updated_at     TIMESTAMPTZ   DEFAULT NOW()
);

-- 2. Row Level Security
ALTER TABLE public.bv_about_us ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_bv_about_us"  ON public.bv_about_us;
DROP POLICY IF EXISTS "full_access_bv_about_us"  ON public.bv_about_us;

CREATE POLICY "public_read_bv_about_us" ON public.bv_about_us
  FOR SELECT USING (true);

CREATE POLICY "full_access_bv_about_us" ON public.bv_about_us
  FOR ALL USING (true);

-- 3. Auto-update timestamp
CREATE OR REPLACE FUNCTION update_bv_about_us_ts()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS trg_bv_about_us_ts ON public.bv_about_us;
CREATE TRIGGER trg_bv_about_us_ts
  BEFORE INSERT OR UPDATE ON public.bv_about_us
  FOR EACH ROW EXECUTE FUNCTION update_bv_about_us_ts();

-- 4. Migrate existing data from admin_about_us → bv_about_us
--    Skips about_us_state (full blob row) and any already-inserted rows.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='admin_about_us'
  ) THEN
    INSERT INTO public.bv_about_us
      (id, section_name, section_type, state_data, display_order, is_active)
    SELECT
      id,
      COALESCE(section_name, id) AS section_name,
      CASE
        WHEN id IN ('history','awards','management_team','new_developments','spiritual_advisors')
          THEN 'array'
        ELSE 'object'
      END AS section_type,
      state_data,
      CASE id
        WHEN 'about_hospital'      THEN 1
        WHEN 'vision_mission'      THEN 2
        WHEN 'history'             THEN 3
        WHEN 'chairman'            THEN 4
        WHEN 'inspiration'         THEN 5
        WHEN 'logo'                THEN 6
        WHEN 'awards'              THEN 7
        WHEN 'events_news'         THEN 8
        WHEN 'sri_chaitanya_trust' THEN 9
        WHEN 'management_team'     THEN 10
        WHEN 'new_developments'    THEN 11
        WHEN 'spiritual_advisors'  THEN 12
        ELSE 99
      END AS display_order,
      true AS is_active
    FROM public.admin_about_us
    WHERE id NOT IN ('about_us_state')
    ON CONFLICT (id) DO NOTHING;

    RAISE NOTICE 'Migrated from admin_about_us → bv_about_us';
  END IF;
END;
$$;

-- 5. Verify — should show 12 section rows
SELECT id, section_name, section_type, display_order, is_active, updated_at
FROM   public.bv_about_us
ORDER  BY display_order, id;
