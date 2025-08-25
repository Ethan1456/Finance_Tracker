import requests


def classify_items(itemDict):
    """
    Classifies items based on their names and returns a dictionary with categories.
    """
    classifiedItems = {}
    electronics_keywords = ['laptop', 'phone', 'headphones', 'charger', 'monitor', 'tv', 'usb', 'mouse', 'keyboard']
    # get categories from api
    url = "https://world.openfoodfacts.org/cgi/search.pl"
    # loop through the items in the dictionary
    for name,details in itemDict.items():
        params = {
            "search_terms": name,
            "search_simple": 1,
            "action": "process",
            "json": 1
        }
        # go to api to get the name
        response = requests.get(url, params=params)
        # if response successful
        if response.status_code == 200:
            # get the data in json format
            data = response.json()
            category = None
            # get the category if it exists
            if data.get("products"):
                # get first product name found from product json
                product = data["products"][0]
                # extract category from the product JSON format
                category = product.get("categories_tags", ["Other"])[0]
                # if category exists, add to classified items
                if category:
                    # formatting
                    category = category.replace("en:", "").replace("-", " ").title()
                    # just get first word of category
                    category = category.split()[0]
                else:
                    category = "Other"
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




