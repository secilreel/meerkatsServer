CREATE TABLE meerkats_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  details TEXT,
  meeting_time DATE,
  place TEXT,
  total_participants INT,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
