-- psql -U secilreel -d meerkats -f ./seeds/trunc.meerkats-tables.sql

TRUNCATE
  meerkats_participants,
  meerkats_friends,
  meerkats_users,
  meerkats_events
  RESTART IDENTITY CASCADE;
