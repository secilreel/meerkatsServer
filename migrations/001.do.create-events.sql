CREATE TABLE meerkats_events (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  title TEXT NOT NULL,
  details TEXT,
  meeting_day DATE,
  meeting_time TIME,
  place TEXT,
  date_created TIMESTAMP DEFAULT now() NOT NULL
);
