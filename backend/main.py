from OCR import extract_items
from database import insertItems
from classification import classify_items

image_path = r"C:\Users\ethan\Documents\Side Projects\Finance_Tracker\receipts\receipt1.png"

# Run OCR on them
itemDict = extract_items(image_path)

# classify items
classifiedItems = classify_items(itemDict)


# Pass the results to the database function
insertItems(classifiedItems)

print("Ran")