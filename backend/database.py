import sqlite3
connection = sqlite3.connect('finance_tracker.db')
cursor = connection.cursor()

# creating table for the transaction
