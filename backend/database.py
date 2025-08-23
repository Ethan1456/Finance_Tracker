# mysql database
import mysql.connector
from mysql.connector import Error

def create_mysql_connection(host_name, user_name, user_password):
    """
    Creates and returns a MySQL connection.
    """
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            password=user_password
        )
        if connection.is_connected():
            print("Connected to MySQL")
            return connection
    except Error as e:
        print(f"Error: '{e}'")
        return None

def create_database(connection, db_name):
    """
    Creates a database if it doesn't already exist.
    """
    try:
        cursor = connection.cursor()
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {db_name}")
        print(f"Database '{db_name}' created or already exists.")
        cursor.close()
    except Error as e:
        print(f"Error: '{e}'")

def create_tables(connection, db_name):
    """
    Creates necessary tables in the specified database.
    """
    cursor = connection.cursor()
    try:
        connection.database = db_name
        # drop to avoid potential duplicate table errors
        cursor.execute("DROP TABLE IF EXISTS items")
        # Create items table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date_purchased DATE,
                name VARCHAR(255) NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                isEssential BOOLEAN DEFAULT FALSE,
                category VARCHAR(100),
                UNIQUE KEY unique_item (date_purchased, name)
            )
        """)
        print("Table 'items' created or already exists.")
    except Error as e:
        print(f"Error: '{e}'")
    finally:
        cursor.close()

def insertItems(connection, db_name, items, date_purchased):
    connection.database = db_name
    cursor = connection.cursor()
    try:
        for name, details in items.items():
            # skip the grand total item in dictionary
            if name.strip().upper() in  ["GRAND TOTAL", "TOTAL"]:
                continue
            # execute query
            cursor.execute("""
                INSERT INTO items (date_purchased, name, quantity, price, isEssential, category)
                VALUES (%s, %s, %s, %s, %s, %s)
                    ON DUPLICATE KEY UPDATE
                        quantity = VALUES(quantity),
                        price = VALUES(price),
                        isEssential = VALUES(isEssential),
                        category = VALUES(category)
            """, (
                date_purchased,
                name,
                details['quantity'],
                details['price'],
                False,  # Assuming isEssential is False by default
                details.get('category', None)  # Category can be None if not provided
            ))
        connection.commit()
        print("Items inserted successfully.")
    except Error as e:
        print(f"Error: '{e}'")
    finally:
        cursor.close()

    

