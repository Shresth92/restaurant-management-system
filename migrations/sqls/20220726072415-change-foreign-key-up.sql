/* Replace with your SQL commands */

ALTER TABLE session
ADD COLUMN user_id uuid,
ADD CONSTRAINT session_user_id_fkey
FOREIGN KEY (user_id) 
REFERENCES users (id);

CREATE UNIQUE INDEX CONCURRENTLY table_users_email
    ON users (email);

ALTER TABLE users
    ADD CONSTRAINT unique_users_email
        UNIQUE USING INDEX table_users_email;