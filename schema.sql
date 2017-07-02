### Schema
CREATE DATABASE bongo;
USE bongo;

CREATE TABLE products
(
	item_id int NOT NULL AUTO_INCREMENT,
	product_name varchar(255) NOT NULL,
	department_name varchar(255) NOT NULL,
	price decimal(4,2) NOT NULL,
    stock_quantity integer(5) NOT NULL,
    PRIMARY KEY (item_id)
);

select * from products;