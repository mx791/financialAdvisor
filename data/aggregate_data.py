import pandas as pd
import numpy as np
import json
from scipy.stats import pearsonr
import yfinance as yf
from tqdm import tqdm


def get_returns(data: np.array) -> np.array:
    returns = data[1:] / data[:-1] - 1.0
    return returns[~np.isnan(returns)]


def correlation(data: pd.DataFrame, target: pd.DataFrame):
    target["date"] = pd.to_datetime(target.index, utc=True)
    data["date"] = pd.to_datetime(data["date"], utc=True)
    target["date_"] = target["date"].dt.strftime("%d-%m-%Y")
    data["date_"] = data["date"].dt.strftime("%d-%m-%Y")

    data = data.merge(target, on="date_")
    data = data.sort_values(by="date_")

    prices = data["close"].values
    index = data["Close"].values

    return pearsonr(prices, index)[0]



INDEXS = {
    "CAC40": "^FCHI",
    "NASDAQ": "^IXIC",
    "SP500": "^GSPC",
    "DAX": "^GDAXI",
    "NIKKEI": "^N225",
}


if __name__ == "__main__":

    indexes_data = {
        key: yf.Ticker(val).history("10y") for key, val in INDEXS.items()
    }

    df = pd.concat([
        pd.read_csv("./etf_list.csv"),
        pd.read_csv("./funds.csv"),
        #pd.read_csv("./symbols.csv"),
    ])
    print(len(df), " lines before processing")
    #df["link"] = df["id"]

    names, symbols, number_of_values, first_years, mean_volumme = [], [], [], [], []
    mean_returns, stds = {i: [] for i in range(2014, 2025)}, {i: [] for i in range(2014, 2025)}
    correlations = {index: [] for index in indexes_data}

    for i in tqdm(range(len(df))):
        try:
            name = df["name"].values[i]
            ids = df["link"].values[i]
            data = pd.read_csv(f"./out/{ids}.csv", index_col=0)
            data = data.dropna()
            data["date"] = pd.to_datetime(data["date"])
            if len(data) < 100:
                continue

            first_year = data["date"].dt.year.min()
            last_year = data["date"].dt.year.max()
            if last_year < 2024:
                continue

            mean_volumme.append(data["volumme"].mean())

            names.append(name)
            symbols.append(ids)
            number_of_values.append(len(data))
            first_years.append(int(first_year))

            for index in indexes_data:
                correlations[index].append(correlation(data, indexes_data[index]))

            DAYS = 252

            for year in range(2014, 2025):
                if year < first_year:
                    mean_returns[year].append(0)
                    stds[year].append(0)

                else:
                    data_year_filtered = data[data["date"].dt.year >= year]
                    if len(data_year_filtered) == 0:
                        mean_returns[year].append(0)
                        stds[year].append(0)
                        continue
                    returns = get_returns(data_year_filtered["close"].values)
                    mean_returns[year].append(np.mean(returns) * DAYS)
                    stds[year].append(np.std(returns) * np.sqrt(DAYS))
        except Exception as e:
            print(e)
    
    obj = {
        "name": names,
        "symbols": symbols,
        "number_of_values": number_of_values,
        "first_year": first_years,
        #"last_year": last_years,
        "volumme": mean_volumme,
        **{f"return_{col}": mean_returns[col] for col in mean_returns},
        **{f"vol_{col}": stds[col] for col in stds},
        **{f"correlation_{col}": correlations[col] for col in correlations},
    }
    aggregated = pd.DataFrame(obj).dropna()
    print(len(aggregated), " lines after processing")
    aggregated.to_csv("./aggregated.csv")
    json.dump(obj, open("../web/src/data/list_aggregated.json", "w+"))
