INSERT INTO users (name, username, password, isadmin) VALUES
('jon', 'jon@gmail.com','$2a$10$/itzrPRCQ1Xf2bb2f3hnCurEyHSTMOigj0knjVwwQhTq3nqvUuN0C',false);

INSERT INTO users (name, username, password, isadmin) VALUES
('unnur', 'unnur@gmail.com','$2a$10$EI.WacBdYwRHdnlPZ1m3Pualb9t.LH/88lnB6BT8y.yzrw.B7HoXm',true);

INSERT INTO events (userid, name, slug, description, created, updated) VALUES
(1, 'Forritarahittingur í febrúar', 'forritarahittingur-i-februar', 'Forritarar hittast í febrúar og forrita saman eitthvað frábært.', current_timestamp, current_timestamp);

INSERT INTO events (userid, name, slug, description, created, updated) VALUES
(2, 'Hönnuðahittingur í mars', 'honnudahittingur-i-mars', 'Spennandi hittingur hönnuða í Hönnunarmars.', current_timestamp, current_timestamp);

INSERT INTO registrations (userid, comment, eventid, created) VALUES
(2, 'Hlakka til', 1, current_timestamp);
