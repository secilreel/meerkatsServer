-- psql -U secilreel -d meerkats -f ./seeds/seed.meerkats-tables.sql

BEGIN;

TRUNCATE
  meerkats_participants,
  meerkats_friends,
  meerkats_users,
  meerkats_events
  RESTART IDENTITY CASCADE;

INSERT INTO meerkats_users (id, user_name, full_name, image, password)
VALUES
  (1, 'secil', 'Secil Reel', 'https://tinyfac.es/data/avatars/344CFC24-61FB-426C-B3D1-CAD5BCBD3209-200w.jpeg','$2a$12$IZfXMEVGh0yqehdlgq6l2uinSTbl3iT4ff.bjk0MpnngqRQiUDh4K'),
  (2, 'meer', 'Mere Cat','https://tinyfac.es/data/avatars/BA0CB1F2-8C79-4376-B13B-DD5FB8772537-200w.jpeg', '$2a$12$Ajg6WiaYm0E5zGv6fcznIeuikVFtxMsikKbaz2IKUqGbIU/DiTQ26'),
  (3, 'joe', 'Joe Cuddle','https://tinyfac.es/data/avatars/FBEBF655-4886-455A-A4A4-D62B77DD419B-200w.jpeg', '$2a$12$T/qPNl4/qmrqZQCuH63HWuXNup38OhYA2g.qr17qK8QqeC.W9/UWe'),
  (4, 'chat', 'Chat Huddle','https://tinyfac.es/data/avatars/1C4EEDC2-FE9C-40B3-A2C9-A038873EE692-200w.jpeg','$2a$12$DQBgSLx2gXXgfC5l3yanKeGzkQBPuifrdsXUxMn4dBjdl2LR6oJk6'),
  (5, 'marry', 'Merry Marry', 'https://tinyfac.es/data/avatars/03F55412-DE8A-4F83-AAA6-D67EE5CE48DA-200w.jpeg', '$2a$12$L/3haQiZFrZDtRldNoyPSOq00iQPlFPO4rGhVbZaunXTsszhyn6ky');

ALTER SEQUENCE meerkats_users_id_seq RESTART WITH 6;

INSERT INTO meerkats_events (id, title, details, meeting_day, meeting_time, place, event_owner)
VALUES
  (1, 'Pho Dinner', 'Meet me at the pho place tonight', '2019-03-19', '19:00:00', 'Pho Basil', 1),
  (2, 'Ski Getaway', 'Time to rent a house in NH', '2019-03-22', '12:00:00', 'Carroll, NH', 1),
  (3, 'Auction Gala', 'Let''s support the school', '2019-03-30', '18:30:00', 'Newton Shareton',2),
  (4, 'Breadmaking Practice', 'Come to our place to bake bread', '2019-03-30', '15:00:00', 'Our house',3),
  (5,'Playdate', 'Let''s take the kids to the park', '2019-03-20', '10:30:00', 'Elm Bank Reservation',4);

ALTER SEQUENCE meerkats_events_id_seq RESTART WITH 6;

INSERT INTO meerkats_friends (user_id, friends_id)
VALUES
(1,3),
(1,2),
(1,4),
(1,5),
(3,4),
(2,4),
(2,5);

INSERT INTO meerkats_participants (user_id, events_id, attending)
VALUES
(1,1, 'coming'),
(1,2, 'coming'),
(1,5, 'coming'),
(2,3, 'coming'),
(2,4, 'coming'),
(4,5, 'coming'),
(3,1, 'pending'),
(3,2, 'declined'),
(4,3, 'pending');

COMMIT;
