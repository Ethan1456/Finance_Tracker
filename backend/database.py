# mysql database
import mysql.connector
from mysql.connector import Error
from main import date_purchased, classifiedItems

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
        # Create items table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                date_purchased DATE,
                name VARCHAR(255) NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                isEssential BOOLEAN DEFAULT FALSE,
                category VARCHAR(100)
            )
        """)
        print("Table 'items' created or already exists.")
        cursor.close()
    except Error as e:
        print(f"Error: '{e}'")

def insertItems(connection, db_name, items, date_purchased):

    pass
    

def main():
    # MySQL connection details
    host_name = "localhost"
    user_name = "root"
    user_password = "Qweasdzxc$"

    # Database name
    db_name = "FinanceTracker"

# Create MySQL connection
    connection = create_mysql_connection(host_name, user_name, user_password)
   
    if connection:
        try:
            # Step 1: Create the database
            create_database(connection, db_name)
           
            # Step 2: Create the tables in the database
            create_tables(connection, db_name)
           
            # Step 3: insert data into the items table
            insertItems(connection, db_name, classifiedItems, date_purchased)

            



            
        finally:
            # Step 5: Close the MySQL connection
            connection.close()
            print("MySQL connection closed.")
    else:
        print("Failed to connect to MySQL")

    print("Database setup complete.")


if __name__ == "__main__":
    main()
