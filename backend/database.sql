CREATE DATABASE travel_planner CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS excursions;


CREATE USER 'travel_user'@'localhost' IDENTIFIED BY 'parola_ta';
GRANT ALL PRIVILEGES ON travel_planner.* TO 'travel_user'@'localhost';
FLUSH PRIVILEGES;
