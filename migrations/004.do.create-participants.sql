CREATE TYPE decision AS ENUM(
    'coming',
    'pending',
    'declined'
);

CREATE TABLE meerkats_participants (
    user_id INTEGER
        REFERENCES meerkats_users(id) ON DELETE SET NULL,
    events_id INTEGER
        REFERENCES meerkats_events(id) ON DELETE CASCADE,
    attending decision NOT NULL
);