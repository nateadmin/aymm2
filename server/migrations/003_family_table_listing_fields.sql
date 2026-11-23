ALTER TABLE family_tables
  ADD COLUMN IF NOT EXISTS dietary_certification TEXT
    CHECK (dietary_certification IS NULL OR dietary_certification IN ('kosher', 'halal', 'neither')),
  ADD COLUMN IF NOT EXISTS guest_expectations TEXT;