import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import sys

visited_pages = set()
broken_links = []

BASE_URL = "https://www.mae.tn/"

def is_internal_link(link):
    parsed = urlparse(link)
    return parsed.netloc in ("", urlparse(BASE_URL).netloc)

def get_html(url):
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return response.text
        else:
            return None
    except requests.RequestException:
        return None

def check_link(url):
    try:
        response = requests.head(url, allow_redirects=True, timeout=10)
        return response.status_code
    except requests.RequestException:
        return None

def crawl_page(url):
    if url in visited_pages:
        return
    visited_pages.add(url)

    html = get_html(url)
    if not html:
        return

    soup = BeautifulSoup(html, "html.parser")
    links = soup.find_all("a", href=True)

    for tag in links:
        href = tag.get("href")
        full_url = urljoin(url, href)

        if not is_internal_link(full_url):
            continue  # Ignore external links

        status = check_link(full_url)
        if status != 200:
            broken_links.append({
                "source": url,
                "broken_url": full_url,
                "status": status
            })
            print(f"[BROKEN] {full_url} (from {url}) - Status: {status}")

        if full_url not in visited_pages:
            crawl_page(full_url)

if __name__ == "__main__":
    print(f"Scanning internal links on: {BASE_URL}")
    crawl_page(BASE_URL)

    print("\nRésumé des liens cassés trouvés :")
    if broken_links:
        for item in broken_links:
            print(f"- Lien cassé : {item['broken_url']} (trouvé sur {item['source']}) - Code: {item['status']}")
    else:
        print("Aucun lien cassé détecté.")
