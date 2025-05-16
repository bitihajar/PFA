import requests
from bs4 import BeautifulSoup

def scrape_jumia(query):
    url = f"https://www.jumia.ma/catalog/?q={query}"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")
    products = []

    for item in soup.select(".prd"):
        name = item.select_one(".name")
        price = item.select_one(".prc")
        link_tag = item.find("a", href=True)
        image_tag = item.select_one("img")

        if name and price and link_tag and image_tag:
            products.append({
                "name": name.text.strip(),
                "price": price.text.strip(),
                "link": "https://www.jumia.ma" + link_tag["href"],
                "image": image_tag.get("data-src") or image_tag.get("src")
            })

    return products
