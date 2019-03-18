CREATE TABLE meerkats_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  details TEXT,
  meeting_time DATETIME,
  place TEXT,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
