/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS users
(
    id          uuid                     DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    email       TEXT NOT NULL,
    password    TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id)
);

CREATE TYPE role_name AS ENUM ('user', 'admin', 'sub admin');

CREATE TABLE IF NOT EXISTS roles
(
    user_id     uuid,
    role_name   role_name,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, role_name),
    FOREIGN KEY (user_id)
        REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS address
(
    user_id     uuid,
    address     TEXT NOT NULL,
    lat_long    point not null ,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, address),
    FOREIGN KEY (user_id)
        REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS restaurant
(
    id          uuid                     DEFAULT uuid_generate_v4(),
    user_id     uuid,
    name        TEXT NOT NULL,
    address     TEXT NOT NULL,
    lat_long    point NOT NULL ,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS dishes
(
    restaurant_id     uuid,
    name        TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at  TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (restaurant_id, name),
    FOREIGN KEY (restaurant_id)
        REFERENCES restaurant (id)
);

CREATE TABLE IF NOT EXISTS session
(
    id          uuid                     DEFAULT uuid_generate_v4(),
    user_id     uuid,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_at  TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES restaurant (id)
);