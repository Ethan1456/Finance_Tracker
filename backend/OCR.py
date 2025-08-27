from datetime import datetime
from unicodedata import name
from PIL import Image
import pytesseract
import re
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# converts image to text
def date_purchased(path):
    date_purchased = None
    img = Image.open(path)
    config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(img, config=config)

    # find the date
    date_match = re.search(r'\b\d{2}[/-]\d{2}[/-]\d{2,4}\b',text)

    # if date
    if date_match:
        date_purchased = date_match.group(0)
        try:
            if len(date_purchased.split("/")[-1]) == 2:
                # 2-digit year
                date_purchased = datetime.strptime(date_purchased, "%d/%m/%y").date()
            else:
                # 4-digit year
                date_purchased = datetime.strptime(date_purchased, "%d/%m/%Y").date()
        except ValueError:
            print(f"Warning: could not parse date '{date_purchased}', using None")
            date_purchased = None

    # print(f"Date Purchased: {date_purchased}")
    return date_purchased

def extract_items(path):

    img = Image.open(path)
    config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(img, config=config)

    # item dictionary
    itemDict = {}
    skip_keywords = ["GRAND TOTAL", "TOTAL", "TAX", "SUBTOTAL"]
    for line in text.splitlines():
        if any(k in line.upper() for k in skip_keywords):
            continue
        
        match = re.match(r'^\s*(\d+)\s+([A-Za-z\s]+?)\s+\$?(\d+\.\d{2})\s*$', line)
        
        if match:
            quantity = int(match.group(1))
            name = match.group(2).strip()
            price = float(match.group(3))
            itemDict[name] = {"quantity": quantity, "price": price}

    # print items
    for name,details in itemDict.items():
        print(f"Name: {name}, Quantity: {details['quantity']}, Price: {details['price']}")

    return itemDict
