-- psql -U secilreel -d meerkats -f ./seeds/seed.meerkats-tables.sql

BEGIN;

TRUNCATE
  meerkats_participants,
  meerkats_friends,
  meerkats_users,
  meerkats_events
  RESTART IDENTITY CASCADE;

INSERT INTO meerkats_events (title, details, meeting_day, meeting_time, place)
VALUES
  ('Pho Dinner', 'Meet me at the pho place tonight', '2019-03-19', '19:00:00', 'Pho Basil'),
  ('Ski Getaway', 'Time to rent a house in NH', '2019-03-22', '12:00:00', 'Carroll, NH'),
  ('Auction Gala', 'Let''s support the school', '2019-03-30', '18:30:00', 'Newton Shareton'),
  ('Breadmaking Practice', 'Come to our place to bake bread', '2019-03-30', '15:00:00', 'Our house'),
  ('Playdate', 'Let''s take the kids to the park', '2019-03-20', '10:30:00', 'Elm Bank Reservation');

-- ALTER SEQUENCE meerkats_events_id_seq RESTART WITH 6;

COMMIT;

BEGIN;

INSERT INTO meerkats_users (user_name, full_name, password)
VALUES
  ('secil', 'Secil Reel', '$2a$08$kbFByA1I931gYX5DmvoH9O5Vv8o2KCXi7JFslTM7O/Pc2rRWqY9Te'),
  ('meer', 'Meer Cat', '$2a$08$d32c0p7OVtT9vOQwl2JZp.Ov6v45l3rWVMrJKt5vp9FEF9z5NNIpC'),
  ('joe', 'Joe Cuddle', '$2a$08$UNPV8OsMEX/YZ1fxpJhjsevED3Rytr5U12QAKDSSmnmQV7UJxkIS2'),
  ('jenn', 'Jenn Huddle','$2a$08$Y8qTZV9TDOXiic59h5WlTu77m3saVc7STMydxyotlK6ioWyUiLOaO'),
  ('marry', 'Merry Marry', '$2a$08$IJrMfUW2TUELJrQy1eLqw.WmKPMCyou5IueUTanwPIJ5QxTvv/TQC');

-- ALTER SEQUENCE meerkats_users_id_seq RESTART WITH 6;

COMMIT;

BEGIN;

INSERT INTO meerkats_friends (user_id, friends_id)
VALUES
(1,3),
(1,2),
(3,3),
(2,4),
(2,5);

COMMIT;

BEGIN;

INSERT INTO meerkats_participants (user_id, events_id)
VALUES
(1,1),
(1,2),
(1,5),
(2,3),
(2,4),
(4,5);

COMMIT;
