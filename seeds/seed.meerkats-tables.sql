-- psql -U secilreel -d meerkats -f ./seeds/seed.meerkats-tables.sql

BEGIN;

TRUNCATE
  meerkats_participants,
  meerkats_friends,
  meerkats_users,
  meerkats_events
  RESTART IDENTITY CASCADE;

INSERT INTO meerkats_events (id, title, details, meeting_time, place)
VALUES
  (1, 'Pho Dinner', 'Meet me at the pho place tonight', '2019-03-19 19:00:00', 'Pho Basil'),
  (2, 'Ski Getaway', 'Time to rent a house in NH', '2019-03-22 12:00:00', 'Carroll, NH'),
  (3, 'Auction Gala', 'Let''s support the school', '2019-03-30 18:30:00', 'Newton Shareton'),
  (4, 'Breadmaking Practice', 'Come to our place to bake bread 15:00:00', '2019-03-30', 'Our house'),
  (5, 'Playdate', 'Let''s take the kids to the park', '2019-03-20 10:30:00', 'Elm Bank Reservation');

ALTER SEQUENCE meerkats_events_id_seq RESTART WITH 6;

COMMIT;

BEGIN;

INSERT INTO meerkats_users (id, user_name, full_name, password)
VALUES
  (1, 'secil', 'Secil Reel', 'pass1'),
  (2, 'meer', 'Meer Cat', 'pass2'),
  (3, 'joe', 'Joe Cuddle', 'pass3'),
  (4, 'jenn', 'Jenn Huddle','pass4'),
  (5, 'marry', 'Merry Marry', 'pass5');

ALTER SEQUENCE meerkats_users_id_seq RESTART WITH 6;

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
