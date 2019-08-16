DROP DATABASE bamazon_db

CREATE DATABASE bamazon_db
USE bamazon_db

CREATE TABLE products (
    id INT NOT NULL AUTO_INCREMENT, 
    product VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    PRIMARY KEY(id)
); 