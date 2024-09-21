import requests
import json
import pandas as pd
import datetime
import tqdm


def fetch(symbol: str) -> pd.DataFrame:
    url = f"https://www.boursorama.com/bourse/action/graph/ws/GetTicksEOD?symbol={symbol}&length=3650&period=0&guid="
    content = requests.get(url).content
    obj = json.loads(content)
    d, o, h, l, c, v = [], [], [], [], [], []
    for i in obj["d"]["QuoteTab"]:
        d.append(datetime.datetime(1970, 1, 1) + datetime.timedelta(days=i["d"]))
        o.append(i["o"])
        h.append(i["h"])
        l.append(i["l"])
        c.append(i["c"])
        v.append(i["v"])

    return pd.DataFrame({"date": d, "open": o, "close": c, "high": h, "low": l, "volumme": v})
    

if __name__ == "__main__":

    df = [
        #*pd.read_csv("./etf_list.csv")["link"].values,
        #*pd.read_csv("./funds.csv")["link"].values,
        *pd.read_csv("./symbols.csv")["id"].values,
    ]

    print(f"{len(df)} lines to fetch")

    for s in tqdm.tqdm(df):
        try:
            data = fetch(s)
            data.to_csv(f"./out/{s}.csv")
        except Exception:
            print("error with : " + s)
