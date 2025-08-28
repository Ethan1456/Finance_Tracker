from fastapi import FastAPI, HTTPException
import pymysql
app = FastAPI()
from OCR import extract_items, date_purchased
from classification import classify_items
from database import insertItems, create_mysql_connection
from datetime import datetime
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from fastapi import BackgroundTasks
from dotenv import load_dotenv
import os
from sklearn.linear_model import LinearRegression
import numpy as np

# Pydantic model for a single purchase update
class PurchaseUpdate(BaseModel):
    id: int
    quantity: int
    price: float
    isEssential: bool
    category: str


load_dotenv()


# MySQL connection info
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", 3306))  # default to 3306 if not set

TABLE_NAME = "items"

# add this to show up in table as stops browser blocking
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)



# connecting to database
def get_connection():
    try:
        conn = pymysql.connect(
            host=DB_HOST,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME,  # directly connect to DB
            cursorclass=pymysql.cursors.DictCursor
        )
        return conn
    except pymysql.MySQLError as e:
        print(f"Error connecting to MySQL: {e}")
        return None

# purchase endpoint
@app.get("/purchases")
def get_purchases():
    connection = get_connection()
    if connection is None:
        raise HTTPException(status_code=500, detail="DB connection failed")

    cursor = connection.cursor()
    cursor.execute(f"SELECT * FROM {TABLE_NAME}")
    rows = cursor.fetchall()  # each row is already a dict
    cursor.close()
    connection.close()

    return rows  # no mapping needed

@app.post("/upload")
async def upload_receipt(file: UploadFile = File(...)):
    # Read and save the file temporarily
    contents = await file.read()
    path = "temp_receipt.png"
    with open(path, "wb") as f:
        f.write(contents)

    # Extract items from the receipt
    itemDict = extract_items(path)
    rawDate = date_purchased(path)
    classifiedItems = classify_items(itemDict)

    print(f"Raw extracted items: {itemDict}")
    print(f"Raw date purchased: {rawDate}")
    print(f"Classified items: {classifiedItems}")

    # Insert items into the database
    connection = get_connection()
    insertedItems = insertItems(connection, "FinanceTracker", classifiedItems, rawDate)
    connection.close()

    # Return inserted items and the purchase date
    return {
        "message": "Receipt uploaded and items added successfully.",
        "inserted_items": insertedItems,
        "date": rawDate
    }

@app.patch("/update-purchases")
def update_purchases(purchases: List[PurchaseUpdate]):
    
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="DB connection failed")
    cursor = conn.cursor()
    try:
        for purchase in purchases:
            cursor.execute(
                f"""
                UPDATE {TABLE_NAME}
                SET quantity=%s, price=%s, isEssential=%s, category=%s
                WHERE id=%s
                """,
                (
                    purchase.quantity,
                    purchase.price,
                    1 if purchase.isEssential else 0,
                    purchase.category,
                    purchase.id,
                ),
            )
        conn.commit()
        return {"message": f"{len(purchases)} purchases updated successfully"}
    finally:
        cursor.close()
        conn.close()

@app.get("/predicted-spending")
def get_predicted():
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="DB connection failed")
    cursor = conn.cursor()
    try:
        # Fetch total spending per month
        cursor.execute(
            f"""
            SELECT 
                YEAR(date_purchased) AS year, 
                MONTH(date_purchased) AS month, 
                SUM(price * quantity) AS total_spent
            FROM {TABLE_NAME}
            GROUP BY year, month
            ORDER BY year, month
            """
        )
        rows = cursor.fetchall()

        if len(rows) < 2:
            return {"error": "Not enough data to make predictions."}

        # Prepare data for linear regression
        X = np.array([[i] for i in range(len(rows))])  # Months as integers
        y = np.array([row['total_spent'] for row in rows])

        # Train linear regression model
        model = LinearRegression()
        model.fit(X, y)

        # Predict next month's spending
        next_month_index = np.array([[len(rows)]])
        predicted_spending = model.predict(next_month_index)[0]

        return {
            "historical_data": rows,
            "predicted_next_month_spending": predicted_spending
        }
    finally:
        cursor.close()
        conn.close()

@app.delete("/delete-purchase/{purchase_id}")
def delete_purchase(purchase_id: int):
    conn = get_connection()
    if conn is None:
        raise HTTPException(status_code=500, detail="DB connection failed")
    cursor = conn.cursor()
    try:
        cursor.execute(
            f"DELETE FROM {TABLE_NAME} WHERE id=%s",
            (purchase_id,),
        )
        conn.commit()
        return {"message": "Purchase deleted successfully"}
    finally:
        cursor.close()
        conn.close()