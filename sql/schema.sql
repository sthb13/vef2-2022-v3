CREATE TABLE users (
  id serial primary key,
  name VARCHAR(64) NOT NULL,
  username VARCHAR(64) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  isadmin BOOLEAN DEFAULT FALSE
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  userid INT NOT NULL,
  name VARCHAR(64) not null,
  slug VARCHAR(64) not null,
  description VARCHAR(255),
  created DATE,
  updated DATE,
  CONSTRAINT userid FOREIGN KEY (userid) REFERENCES users (id)
);

CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  userid INT NOT NULL,
  comment VARCHAR(255),
  eventId INT NOT NULL,
  created DATE,
  CONSTRAINT userid FOREIGN KEY (userid) REFERENCES users (id),
  CONSTRAINT eventid FOREIGN KEY (eventid) REFERENCES events (id)
);
