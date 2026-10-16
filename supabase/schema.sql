-- ============================================================================
-- HAPPY MESSAGES • SUPABASE POSTGRESQL SCHEMA MIGRATION
-- Run this script in your Supabase SQL Editor (1-Click Run)
-- ============================================================================

-- 1. Create Couple Spaces Table
CREATE TABLE IF NOT EXISTS public.couple_spaces (
  id TEXT PRIMARY KEY,
  pairing_code VARCHAR(12) NOT NULL UNIQUE,
  couple_name TEXT NOT NULL DEFAULT 'Our Little Universe',
  website_title TEXT NOT NULL DEFAULT 'Our Little Universe 💌',
  active_theme_id TEXT NOT NULL DEFAULT 'pink-romance',
  custom_theme JSONB DEFAULT '{}'::jsonb,
  members JSONB NOT NULL DEFAULT '{"partnerA": null, "partnerB": null}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create Couple Messages Table
CREATE TABLE IF NOT EXISTS public.couple_messages (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  sender_role VARCHAR(20) NOT NULL,
  sender_name TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  mood VARCHAR(40) DEFAULT 'romantic',
  photo_data TEXT DEFAULT '',
  voice_data TEXT DEFAULT '',
  scheduled_date VARCHAR(20) NOT NULL,
  is_draft BOOLEAN NOT NULL DEFAULT FALSE,
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  design JSONB NOT NULL DEFAULT '{}'::jsonb,
  reactions JSONB NOT NULL DEFAULT '[]'::jsonb,
  replies JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Couple Design Templates Table
CREATE TABLE IF NOT EXISTS public.couple_templates (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  design JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create Couple Memories Table
CREATE TABLE IF NOT EXISTS public.couple_memories (
  id TEXT PRIMARY KEY,
  couple_id TEXT NOT NULL REFERENCES public.couple_spaces(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  caption TEXT DEFAULT '',
  category VARCHAR(60) DEFAULT 'special-date',
  date VARCHAR(20) NOT NULL,
  photo_data TEXT DEFAULT '',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_couple_spaces_pairing_code ON public.couple_spaces(pairing_code);
CREATE INDEX IF NOT EXISTS idx_couple_messages_couple_id ON public.couple_messages(couple_id);
CREATE INDEX IF NOT EXISTS idx_couple_templates_couple_id ON public.couple_templates(couple_id);
CREATE INDEX IF NOT EXISTS idx_couple_memories_couple_id ON public.couple_memories(couple_id);

-- ============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION (Instant phone-to-phone live sync)
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'couple_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.couple_messages;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'couple_spaces'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.couple_spaces;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'couple_templates'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.couple_templates;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'couple_memories'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.couple_memories;
  END IF;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE public.couple_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.couple_memories ENABLE ROW LEVEL SECURITY;

-- Allow public access for paired couples (validated via SHA-256 in app)
DROP POLICY IF EXISTS "Public access to couple_spaces" ON public.couple_spaces;
CREATE POLICY "Public access to couple_spaces" ON public.couple_spaces FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to couple_messages" ON public.couple_messages;
CREATE POLICY "Public access to couple_messages" ON public.couple_messages FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to couple_templates" ON public.couple_templates;
CREATE POLICY "Public access to couple_templates" ON public.couple_templates FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to couple_memories" ON public.couple_memories;
CREATE POLICY "Public access to couple_memories" ON public.couple_memories FOR ALL USING (true) WITH CHECK (true);
