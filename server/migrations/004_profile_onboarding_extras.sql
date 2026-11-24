ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS intro_video_url TEXT,
  ADD COLUMN IF NOT EXISTS question_family_meaning TEXT,
  ADD COLUMN IF NOT EXISTS question_stay_in_touch TEXT,
  ADD COLUMN IF NOT EXISTS question_hoping_for TEXT;