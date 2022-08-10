CREATE TABLE jwt_birthdays
(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    date DATE NOT NULL,
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
    owner UUID REFERENCES jwt_users(id) ON UPDATE CASCADE,
    CONSTRAINT pkey_tbl_birthday PRIMARY KEY (id)
);


CREATE TABLE jwt_users
(
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    name TEXT ,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    createdAt timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pkey_tbl PRIMARY KEY (id)
);