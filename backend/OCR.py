from PIL import Image
import pytesseract
import re
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# converts image to text
img = Image.open(r"C:\Users\ethan\Documents\Side Projects\Finance_Tracker\receipts\receipt1.png")
config = r'--oem 3 --psm 6'
text = pytesseract.image_to_string(img, config=config)

# regex for extracting the actual text
items = re.finditer(r'(\d+)\s([A-Za-z\s]+?)\s(\d+\.\d{2})',text)

# item dictionary
itemDict = {}
for item in items:
    quantity = item.group(1)
    name = item.group(2).strip()
    price = item.group(3)
    itemDict[name] = {'quantity': quantity, 'price': price}

for name,details in itemDict.items():
    print(f"{name}, Quantity: {details['quantity']}, Price: {details['price']}")