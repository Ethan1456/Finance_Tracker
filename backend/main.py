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

# Pydantic model for a single purchase update
class PurchaseUpdate(BaseModel):
    id: int
    quantity: int
    price: float
    isEssential: bool
    category: str




# MySQL connection info
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = "Qweasdzxc$"
DB_NAME = "FinanceTracker"
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
    contents = await file.read()
    # save file temporarily
    path = f"temp_receipt.png"
    with open(path, "wb") as f:
        f.write(contents)


    # run OCR
    itemDict = extract_items(path)
    rawDate = date_purchased(path)


    print("item dict:", itemDict)
    classifiedItems = classify_items(itemDict)

    # insert into DB
    connection = get_connection()
    if connection is None:
        raise Exception("DB connection failed")
    insertItems(connection, "FinanceTracker", classifiedItems, rawDate)
    connection.close()

    return {"inserted_items": classifiedItems}

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