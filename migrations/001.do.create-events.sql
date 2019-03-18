CREATE TABLE meerkats_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  details TEXT,
  meeting_day DATE,
  meeting_time TIME,
  place TEXT,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
