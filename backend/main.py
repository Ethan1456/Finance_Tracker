from OCR import extract_items, date_purchased
from database import create_mysql_connection, create_database, create_tables, insertItems
from classification import classify_items
from datetime import datetime

def print_table_contents(connection, db_name, table_name):
    try:
        connection.database = db_name
        cursor = connection.cursor()
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()

        # Print column names
        column_names = [desc[0] for desc in cursor.description]
        print(" | ".join(column_names))
        print("-" * 50)

        # Print each row
        for row in rows:
            print(" | ".join(str(item) for item in row))

    except Exception as e:
        print(f"Error fetching data: {e}")
    finally:
        cursor.close()


def main():
    image_path = r"C:\Users\ethan\Documents\Side Projects\Finance_Tracker\receipts\receipt1.png"

    # Run OCR on them
    itemDict = extract_items(image_path)

    rawDate = date_purchased(image_path)
    formatdate = "%d/%m/%y"  
    # Convert the date to a standard format
    try:
        formattedDate = datetime.strptime(rawDate, formatdate).date()
    except ValueError:
        print(f"Error parsing date: {rawDate}. Please ensure the date is in the format {formatdate}.")
        return

    # classify items
    classifiedItems = classify_items(itemDict)
    
    # MySQL connection details
    host_name = "localhost"
    user_name = "root"
    user_password = "Qweasdzxc$"

    # Database name
    db_name = "FinanceTracker"

    connection = create_mysql_connection(host_name, user_name, user_password)
    create_database(connection, db_name)
    create_tables(connection, db_name)
    # Insert items into the database
    insertItems(connection, db_name, classifiedItems, formattedDate)
    print_table_contents(connection, db_name, "items")

    # Close the connection
    connection.close()


    print("Ran")
    # print mysql tables



if __name__ == "__main__":
    main()
    