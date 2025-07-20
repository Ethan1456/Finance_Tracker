from PIL import Image
import pytesseract
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

img = Image.open(r"C:\Users\ethan\Documents\Side Projects\Finance_Tracker\receipts\receipt1.png")
config = r'--oem 3 --psm 6'
text = pytesseract.image_to_string(img, config=config)

print(text)
