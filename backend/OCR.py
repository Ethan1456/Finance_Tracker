from PIL import Image
import pytesseract
import re
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# converts image to text


def extract_items(path):

    img = Image.open(path)
    config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(img, config=config)

    # find the date
    date_match = re.search(r'\b\d{2}[/-]\d{2}[/-]\d{2,4}\b',text)

    # if date
    if date_match:
        date_purchased = date_match.group(0)
    
    print(f"Date Purchased: {date_purchased}")

    # regex for extracting the actual text
    items = re.finditer(r'(\d+)\s([A-Za-z\s]+?)\s(\d+\.\d{2})',text)


    # item dictionary
    itemDict = {}

    # loop through items and add to dictionary
    for item in items:
        quantity = item.group(1)
        name = item.group(2).strip()
        price = item.group(3)
        itemDict[name] = {'quantity': quantity, 'price': price}

    # print items
    for name,details in itemDict.items():
        print(f"Date :{date_purchased},Name: {name}, Quantity: {details['quantity']}, Price: {details['price']}")

    return itemDict
