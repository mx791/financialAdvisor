import pandas as pd
import numpy as np
import json
from scipy.stats import pearsonr
import yfinance as yf
from tqdm import tqdm


def get_avg_count_per_years(data: pd.DataFrame) -> int:
    data["y"] = data["date"].dt.year
    points_per_year = data.groupby("y").count()
    if len(points_per_year) < 3:
        return 252
    return int(points_per_year.values[1:-1].mean())


def get_returns(data: np.array, delta: int = 1) -> np.array:
    #returns = data[1:] / data[:-1] - 1.0
    returns = data[delta:] / data[:-delta] - 1.0
    return returns[~np.isnan(returns)]


def compute_mm(data,  windows = 100):
    out = np.array([data[i] / data[i-windows] for i in range(windows, len(data))])
    return out


def correlation(data: pd.DataFrame, target: pd.DataFrame):
    target["date"] = pd.to_datetime(target.index, utc=True)
    data["date"] = pd.to_datetime(data["date"], utc=True)
    target["date_"] = target["date"].dt.strftime("%d-%m-%Y")
    data["date_"] = data["date"].dt.strftime("%d-%m-%Y")

    data = data.merge(target, on="date_")
    data = data.sort_values(by="date_")

    prices = data["close"].values
    index = data["Close"].values

    if len(compute_mm(prices)) < 15:
        return 0.0
        
    return pearsonr(compute_mm(prices), compute_mm(index))[0]



INDEXS = {
    "CAC40": "^FCHI",
    "NASDAQ": "^IXIC",
    "SP500": "^GSPC",
    "DAX": "^GDAXI",
    "NIKKEI": "^N225",
    "MSCI World": "^990100-USD-STRD",
    "EURO STOX 600": "^STOXX",
}


if __name__ == "__main__":

    indexes_data = {
        key: yf.Ticker(val).history("10y") for key, val in INDEXS.items()
    }

    df = pd.concat([
        #pd.read_csv("./etf_list.csv"),
        #pd.read_csv("./funds.csv"),
        pd.read_csv("./symbols.csv"),
    ])
    print(len(df), " lines before processing")
    df["link"] = df["id"]

    names, symbols, number_of_values, first_years, mean_volumme = [], [], [], [], []
    MIN_YEAR = 2022
    START_YEAR = 2014
    CURRENT_YEAR = 2024
    mean_returns, stds, percent_loss = {i: [] for i in range(2014, MIN_YEAR)}, {i: [] for i in range(2014, MIN_YEAR)}, {i: [] for i in range(2014, MIN_YEAR)}
    correlations = {index: [] for index in indexes_data}

    for i in tqdm(range(len(df))):
    #for i in tqdm(range(200)):
        name = df["name"].values[i]
        ids = df["link"].values[i]

        try:
            data = pd.read_csv(f"./out/{ids}.csv", index_col=0)
            data = data.dropna()
            data = data[data["close"] > 0.0]
            data["date"] = pd.to_datetime(data["date"])
        except:
            continue

        first_year = data["date"].dt.year.min()
        last_year = data["date"].dt.year.max()
        if last_year < CURRENT_YEAR or first_year > MIN_YEAR:
            continue

        records_per_years = get_avg_count_per_years(data)

        if len(data) < 200:
            print(f"Not enought data for {ids} ({len(data)})")
            continue        

        mean_volumme.append(data["volumme"].mean())

        names.append(name)
        symbols.append(ids)
        number_of_values.append(len(data))
        first_years.append(int(first_year))

        for index in indexes_data:
            correlations[index].append(correlation(data, indexes_data[index]))

        DAYS = 252

        for year in range(2014, MIN_YEAR):
            if year < first_year:
                mean_returns[year].append(0)
                stds[year].append(0)
                percent_loss[year].append(0)

            else:
                data_year_filtered = data[data["date"].dt.year >= year]
                if len(data_year_filtered) <= records_per_years:
                    mean_returns[year].append(0)
                    stds[year].append(0)
                    percent_loss[year].append(0)
                    continue
                returns = get_returns(data_year_filtered["close"].values, records_per_years)
                mean_returns[year].append(np.mean(returns))
                stds[year].append(np.std(returns))
                percent_loss[year].append(len(returns[returns >= 1.0]))
    
    obj = {
        "name": names,
        "symbols": symbols,
        "number_of_values": number_of_values,
        "first_year": first_years,
        #"last_year": last_years,
        "volumme": mean_volumme,
        **{f"return_{col}": mean_returns[col] for col in mean_returns},
        **{f"vol_{col}": stds[col] for col in stds},
        **{f"loss_{col}": percent_loss[col] for col in percent_loss},
        **{f"correlation_{col}": correlations[col] for col in correlations},
    }
    aggregated = pd.DataFrame(obj).dropna()
    print(len(aggregated), " lines after processing")
    aggregated.to_csv("./aggregated.csv")
    json.dump(obj, open("../web/src/data/list_aggregated.json", "w+"))
