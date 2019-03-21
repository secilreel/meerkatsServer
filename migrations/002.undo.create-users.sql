ALTER TABLE meerkats_events
  DROP COLUMN IF EXISTS user_id;

DROP TABLE IF EXISTS meerkats_users CASCADE;
