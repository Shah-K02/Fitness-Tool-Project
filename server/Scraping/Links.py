import requests
from bs4 import BeautifulSoup

url = 'https://world.openfoodfacts.org/'

links = []
website = requests.get(url)
website_text = website.text
soup = BeautifulSoup(website_text, 'html.parser')

# Filter links for product pages
for link in soup.find_all('a', href=lambda href: href and '/product/' in href):
    links.append(link.get('href'))

# Include the base URL in the links
links_with_base_url = [url + link for link in links]

# Specify the full path for the file
file_path = r'C:\Users\shahk\OneDrive - Aston University\Desktop\FYP\Project\Scraping\products_links.txt'

# Write links to the specified text file
with open(file_path, 'w') as file:
    for product_link in links_with_base_url:
        file.write(f"'{product_link}',\n")

print(f"{len(links_with_base_url)} product links with the base URL have been written to '{file_path}'.")
