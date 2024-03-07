import mysql.connector
import os
import requests
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urlparse, unquote

# Function to extract product name from URL


def extract_product_name(url):
    parsed_url = urlparse(url)
    # Split the path of the URL and decode each part
    decoded_parts = [unquote(part)
                     for part in parsed_url.path.split('/') if part]
    # The product name is usually the last part of the path
    product_name = decoded_parts[-1] if decoded_parts else ''
    return product_name


# List of URLs to scrape
urls = [
    "https://world.openfoodfacts.org/product/3274080005003/eau-de-source-cristaline",
    'https://world.openfoodfacts.org//product/5449000214799/coca-cola-zero',
    'https://world.openfoodfacts.org//product/3451080155161',
    'https://world.openfoodfacts.org//product/5059697734953/roast-chicken-gravy-tesco',
    # Add more URLs here
]
# Function to scrape nutrition facts table from a given URL


def scrape_nutrition_facts_table(url):
    # Send a GET request to the URL
    response = requests.get(url)

    # Parse the HTML content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the table with aria-label="Nutrition facts"
    table = soup.find('table', {'aria-label': 'Nutrition facts'})

    # Check if the table is found
    if table:
        # Extract table headers
        headers = [th.get_text(strip=True) for th in table.find(
            'thead').find('tr').find_all('th')]

        # Extract table rows
        rows = []
        for row in table.find('tbody').find_all('tr'):
            # Extract data from each cell in the row
            cells = [cell.get_text(strip=True) for cell in row.find_all('td')]
            rows.append(cells)

        # Create a DataFrame
        df = pd.DataFrame(rows, columns=headers)

        # Add a column for the product name
        product_name = extract_product_name(url)

        # Replace the problematic text in the DataFrame
        df = df.replace("Fruitsâ€š vegetablesâ€š nuts and rapeseedâ€š walnut and olive oils (estimate from ingredients list analysis)",
                        "Fruits, vegetables, nuts and rapeseed, walnut and olive oils (estimate from ingredients list analysis)")

        return product_name, df
    else:
        print(f"Table not found on the page: {url}")
        return None, None


# Output CSV file
output_csv = "nutrition_facts_combined.csv"

# Delete existing CSV file if it exists
if os.path.exists(output_csv):
    os.remove(output_csv)

# Iterate over each URL
for url in urls:
    print(f"Scraping data from: {url}")
    # Scrape the table
    product_name, nutrition_df = scrape_nutrition_facts_table(url)

    # Check if the DataFrame is not None
    if nutrition_df is not None:
        # Write headers for the table
        with open(output_csv, 'a') as f:
            header_row = ",".join(nutrition_df.columns)
            f.write(f"Product: {product_name}\n")
            f.write(header_row + "\n")

        # Append the DataFrame to the CSV file
        nutrition_df.to_csv(output_csv, mode='a', header=False, index=False)

        # Add empty lines
        with open(output_csv, 'a') as f:
            f.write("\n\n")
        print("Data appended to CSV file")

print(f"All data appended to '{output_csv}'")
