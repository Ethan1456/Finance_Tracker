import os
from dotenv import load_dotenv
load_dotenv()
import requests

# spoonacular api used
apiKey = os.getenv("SPOONACULAR_API_KEY")

def classify_items(itemDict):
    """
    Classifies items based on their names and returns a dictionary with categories.
    """
    classifiedItems = {}
    electronics_keywords = ['laptop', 'phone', 'headphones', 'charger', 'monitor', 'tv', 'usb', 'mouse', 'keyboard']
    # get categories from api
    url = f"https://api.spoonacular.com/food/ingredients/classify?apiKey={apiKey}"
    # loop throug the items in the dictionary
    for name,details in itemDict.items():
        # go to api to get the name
        response = requests.get(url, params={"ingredientName": name})
        # if response successful
        if response.status_code == 200:
            # get the data in json format
            data = response.json()
            # get the cartegory if it exists
            if data.get("category"):
                category = data["category"]
                # add to classified items
                classifiedItems[name] = {
                    'quantity': details['quantity'],
                    'price': details['price'],
                    'category': category
                }
            else:
                #if category does not exist, apply custom classification
            # convert to lowercase and then custom classify
                item_name = name.lower() 
                if any(keyword in item_name for keyword in electronics_keywords):
                    category = 'Electronics'
                else:
                    category = 'Other'

                # add to classified items
                classifiedItems[name] = {
                    'quantity': details['quantity'],
                    'price': details['price'],
                    'category': category
                }
        else:
            print(f"Error fetching data from API:", response.status_code)

    return classifiedItems
