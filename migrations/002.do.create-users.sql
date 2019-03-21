CREATE TABLE meerkats_users (
  id SERIAL PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  image TEXT,
  password TEXT NOT NULL
);

ALTER TABLE meerkats_events
  ADD COLUMN
    event_owner INTEGER REFERENCES meerkats_users(id)
    ON DELETE SET NULL;
