CREATE DATABASE IF NOT EXISTS FinanceTracker;

USE FinanceTracker;

CREATE TABLE IF NOT EXISTS items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date_purchased DATE,
    name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    isEssential BOOLEAN DEFAULT FALSE,
    category VARCHAR(100),
    UNIQUE KEY unique_item (date_purchased, name)
);
