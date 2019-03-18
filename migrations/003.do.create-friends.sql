CREATE TABLE meerkats_friends (
    user_id INTEGER
        REFERENCES meerkats_users(id) ON DELETE SET NULL,
    friends_id INTEGER
        REFERENCES meerkats_users(id) ON DELETE CASCADE
);