-- ==========================================================
-- SQL to Create About Us Tables in Supabase Database
-- Run this in Supabase -> SQL Editor -> New Query -> Run
-- ==========================================================

-- 1. Primary Dedicated State Table for About Us
CREATE TABLE IF NOT EXISTS public.bv_about_us_state (
  id VARCHAR(100) PRIMARY KEY,
  section_name VARCHAR(150),
  state_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Alias table matching the "admin_*" naming pattern shown in your Supabase dashboard
CREATE TABLE IF NOT EXISTS public.admin_about_us (
  id VARCHAR(100) PRIMARY KEY,
  section_name VARCHAR(150),
  state_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS and Policies for bv_about_us_state
ALTER TABLE public.bv_about_us_state ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to bv_about_us_state" ON public.bv_about_us_state;
CREATE POLICY "Allow public read access to bv_about_us_state" ON public.bv_about_us_state FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access to bv_about_us_state" ON public.bv_about_us_state;
CREATE POLICY "Allow full access to bv_about_us_state" ON public.bv_about_us_state FOR ALL USING (true);

-- Enable RLS and Policies for admin_about_us
ALTER TABLE public.admin_about_us ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access to admin_about_us" ON public.admin_about_us;
CREATE POLICY "Allow public read access to admin_about_us" ON public.admin_about_us FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow full access to admin_about_us" ON public.admin_about_us;
CREATE POLICY "Allow full access to admin_about_us" ON public.admin_about_us FOR ALL USING (true);

-- 2. Individual Tables for Events & News
CREATE TABLE IF NOT EXISTS public.admin_about_events (
  id BIGINT PRIMARY KEY,
  type VARCHAR(50) DEFAULT 'event', -- 'event' or 'news'
  title TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.admin_about_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access to admin_about_events" ON public.admin_about_events;
CREATE POLICY "Allow full access to admin_about_events" ON public.admin_about_events FOR ALL USING (true);

-- 3. Individual Table for History Milestones
CREATE TABLE IF NOT EXISTS public.admin_about_history (
  sr INTEGER PRIMARY KEY,
  year VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  detail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.admin_about_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access to admin_about_history" ON public.admin_about_history;
CREATE POLICY "Allow full access to admin_about_history" ON public.admin_about_history FOR ALL USING (true);

-- 4. Individual Table for Awards & Recognition
CREATE TABLE IF NOT EXISTS public.admin_about_awards (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE public.admin_about_awards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow full access to admin_about_awards" ON public.admin_about_awards;
CREATE POLICY "Allow full access to admin_about_awards" ON public.admin_about_awards FOR ALL USING (true);
