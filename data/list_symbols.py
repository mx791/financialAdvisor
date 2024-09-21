import requests
from bs4 import BeautifulSoup
import pandas as pd
from tqdm import tqdm

SOURCES = [
    {
        "name": "ETF",
        "pre-url": "https://www.boursorama.com/bourse/trackers/recherche/autres/page-",
        "post-url": "?etfSearch%5BisEtf%5D=1",
        "count": 50
    }, {
        "name": "ETF",
        "pre-url": "https://www.boursorama.com/bourse/trackers/recherche/page-",
        "post-url": "?beginnerEtfSearch%5BisEtf%5D=1&beginnerEtfSearch%5Bpartners%5D=1",
        "count": 50
    }, {
        "name": "OPCVM",
        "pre-url": "https://www.boursorama.com/bourse/opcvm/recherche/page-",
        "post-url": "?beginnerFundSearch%5Bpartners%5D=1",
        "count": 100
    }
]

def parse_page(url, type):
    page = requests.get(url)
    soup = BeautifulSoup(page.text, 'html.parser')

    stocks = soup.find_all("tr")

    data = []
    for stock in stocks:
        try:
            link = stock.find("a")["href"]
            name = stock.find("a").text
            risk = stock.find(class_="c-gauge")["data-gauge-steps"]
            morning_star = stock.find(class_="u-only-clipboard").text
            data.append({
                "name": name,
                "id": link.split("/")[-2],
                "types": type
            })
        except:
            pass
    return data


if __name__ == "__main__":
    data = None
    for asset_type in SOURCES:
        print(f"Fetching {asset_type['name']}")
        tmp_data = []
        for index in tqdm(range(1, asset_type["count"])):
            scraped = parse_page(asset_type["pre-url"] + str(index) + asset_type["post-url"], asset_type["name"])
            tmp_data.extend(scraped)
        
        scraped = pd.DataFrame(tmp_data)
        scraped["type"] = asset_type["name"]

        if data is None:
            data = scraped
        else:
            data = pd.concat([data, scraped])
        
        data = data.drop_duplicates("id")
        print(len(scraped), "rows in dataset")
        data.to_csv("./symbols.csv")

    print("Done")
    print(len(data), "rows in dataset")
    