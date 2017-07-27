

CREATE USER content_manager;

CREATE DATABASE products_and_articles WITH OWNER content_manager;

\c products_and_articles

CREATE TABLE products (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(125) UNIQUE NOT NULL,
  price FLOAT NOT NULL,
  inventory INT NOT NULL DEFAULT 0
);

INSERT INTO products (name, price, inventory) VALUES
  ('rock', 10.99, 2),
  ('hardplace', 12.50, 1000);