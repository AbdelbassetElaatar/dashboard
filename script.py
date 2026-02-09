import requests

# WooCommerce API credentials
url = "https://lightslategray-grouse-831517.hostingersite.com/wp-json/wc/v3/orders"
username = "ck_375166f223f532c5b4f279aee847c9c50f5597c7"
password = "cs_9d9d05d6b5f45da9b6159e8307e4bb7e7f3c0aab"

# Parameters to fetch all orders (no filter by status)
params = {
    'per_page': 100,        # Number of orders per page
    'page': 1               # Initial page
}

# Initialize total amount
total_amount = 0

while True:
    # Send GET request to WooCommerce API
    response = requests.get(url, params=params, auth=(username, password))
    
    # Check for a successful response
    if response.status_code == 200:
        orders = response.json()
        
        # Sum the total amount for each order
        for order in orders:
            total_amount += float(order['total'])
        
        # Check if there are more pages
        if len(orders) < 100:
            break  # Exit the loop if there are no more orders
        else:
            params['page'] += 1  # Increment page number to fetch next batch of orders
    else:
        print(f"Error: {response.status_code}")
        break

# Output the total amount of all orders
print(f"Total amount of all orders: {total_amount}")
