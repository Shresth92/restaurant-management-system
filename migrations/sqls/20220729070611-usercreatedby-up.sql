/* Replace with your SQL commands */

ALTER TABLE if exists roles
    ADD COLUMN created_by uuid
        REFERENCES users (id);

ALTER TABLE restaurant
    ADD CONSTRAINT unique_restaurant UNIQUE (name, address);