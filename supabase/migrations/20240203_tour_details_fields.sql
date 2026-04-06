ALTER TABLE tours ADD COLUMN IF NOT EXISTS destination_name text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS difficulty_level text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS age_min integer;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS age_max integer;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS group_size_min integer;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS group_size_max integer;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS activities_label text;
ALTER TABLE tours ADD COLUMN IF NOT EXISTS tour_label text;
