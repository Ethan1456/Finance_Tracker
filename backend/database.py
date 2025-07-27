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
           
            # Step 3: Populate tables with data from the CSV files
            

           
            # Step 4: Execute queries and print results


            
        finally:
            # Step 5: Close the MySQL connection
            connection.close()
            print("MySQL connection closed.")
    else:
        print("Failed to connect to MySQL")

    print("Database setup complete.")


if __name__ == "__main__":
    main()
