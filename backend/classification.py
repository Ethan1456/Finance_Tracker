import requests

def classify_items(itemDict):
    """
    Classifies items based on their names and returns a dictionary with categories.
    Ensures all items are included, even if API fails or category is not found.
    """
    classifiedItems = {}
    electronics_keywords = ['laptop', 'phone', 'headphones', 'charger', 'monitor', 'tv', 'usb', 'mouse', 'keyboard']

    url = "https://world.openfoodfacts.org/cgi/search.pl"

    for name, details in itemDict.items():
        category = None  # default category

        try:
            params = {
                "search_terms": name,
                "search_simple": 1,
                "action": "process",
                "json": 1
            }
            response = requests.get(url, params=params, timeout=5)  # timeout to avoid long delays
            if response.status_code == 200:
                data = response.json()
                if data.get("products"):
                    product = data["products"][0]
                    category = product.get("categories_tags", ["Other"])[0]
                    # clean up category formatting
                    category = category.replace("en:", "").replace("-", " ").title()
                    category = category.split()[0] if category else "Other"
                else:
                    category = None
            else:
                print(f"Error fetching data from API: {response.status_code}")

        except requests.RequestException as e:
            print(f"Error fetching data for '{name}': {e}")

        # fallback if API didn't return a valid category
        if not category:
            item_name = name.lower()
            if any(keyword in item_name for keyword in electronics_keywords):
                category = 'Electronics'
            else:
                category = 'Other'

        # finally, add item to classifiedItems
        classifiedItems[name] = {
            'quantity': details['quantity'],
            'price': details['price'],
            'category': category
        }

    return classifiedItems
