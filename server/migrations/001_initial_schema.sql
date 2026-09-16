CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
  is_blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL UNIQUE REFERENCES users(email) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  age INTEGER,
  location TEXT,
  zipcode TEXT,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  identity_type TEXT NOT NULL CHECK (identity_type IN ('daughter', 'son', 'mother', 'father', 'family')),
  seeking_type TEXT,
  seeking_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  religion TEXT,
  religion_private BOOLEAN NOT NULL DEFAULT FALSE,
  profile_photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  bio TEXT,
  real_life_visits BOOLEAN,
  seeking_for JSONB NOT NULL DEFAULT '[]'::jsonb,
  grow_up_goal TEXT,
  working_towards TEXT,
  favorite_foods TEXT,
  hobbies TEXT,
  last_book TEXT,
  last_movie TEXT,
  favorite_childhood_memory TEXT,
  has_biological_kids BOOLEAN,
  enjoy_feeding_youth BOOLEAN,
  can_host_visitors BOOLEAN,
  favorite_books TEXT,
  myths_about_my_day TEXT,
  if_you_were_my_kid TEXT,
  family_name TEXT,
  sibling_count INTEGER,
  beds_available INTEGER,
  favorite_holidays TEXT,
  family_vibe TEXT CHECK (family_vibe IS NULL OR family_vibe IN ('loud_house', 'church_mice')),
  seeking_sibling_reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  setup_complete BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('adopt', 'aymm', 'aymf')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (from_email, to_email)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_email TEXT NOT NULL,
  to_email TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  is_request BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS family_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_email TEXT NOT NULL,
  table_name TEXT NOT NULL,
  event_name TEXT NOT NULL,
  holiday TEXT,
  city TEXT NOT NULL,
  total_seats INTEGER NOT NULL,
  seats_remaining INTEGER,
  beds_available INTEGER,
  food_type TEXT,
  religion TEXT,
  language TEXT,
  alcohol_served BOOLEAN NOT NULL DEFAULT FALSE,
  event_date DATE,
  description TEXT,
  photo_url TEXT,
  event_photos JSONB NOT NULL DEFAULT '[]'::jsonb,
  attendees JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS table_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES family_tables(id) ON DELETE CASCADE,
  table_name TEXT,
  family_email TEXT NOT NULL,
  requester_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsfeed_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  photo_url TEXT,
  category TEXT CHECK (category IS NULL OR category IN ('family', 'holidays', 'stories', 'events', 'advice', 'other')),
  likes INTEGER NOT NULL DEFAULT 0,
  dislikes INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares INTEGER NOT NULL DEFAULT 0,
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES newsfeed_posts(id) ON DELETE CASCADE,
  author_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_email TEXT NOT NULL,
  reported_email TEXT,
  report_type TEXT NOT NULL CHECK (report_type IN ('profile', 'post', 'comment', 'message')),
  reason TEXT,
  target_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_email TEXT NOT NULL,
  blocked_email TEXT NOT NULL,
  blocked_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (blocker_email, blocked_email)
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  name TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS identity_change_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  current_identity TEXT NOT NULL,
  requested_identity TEXT NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  reviewed_by TEXT,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_identity ON profiles(identity_type);
CREATE INDEX IF NOT EXISTS idx_connections_from ON connections(from_email);
CREATE INDEX IF NOT EXISTS idx_connections_to ON connections(to_email);
CREATE INDEX IF NOT EXISTS idx_messages_from ON messages(from_email);
CREATE INDEX IF NOT EXISTS idx_messages_to ON messages(to_email);
CREATE INDEX IF NOT EXISTS idx_family_tables_city ON family_tables(city);
CREATE INDEX IF NOT EXISTS idx_newsfeed_posts_author ON newsfeed_posts(author_email);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
