CREATE TABLE meerkats_participants (
    user_id INTEGER
        REFERENCES meerkats_users(id) ON DELETE SET NULL
    events_id INTEGER
        REFERENCES meerkats_events(id) ON DELETE CASCADE
);