import pandas as pd
import numpy as np
import json


def get_returns(data: np.array) -> np.array:
    data = [data[i] if data[i] > 0 else data[i-1] for i in range(len(data))]
    return data[1:] / data[:-1] - 1.0


if __name__ == "__main__":

    df = pd.concat([
        pd.read_csv("./etf_list.csv"),
        pd.read_csv("./funds.csv")
    ])

    names, symbols, number_of_values, first_years = [], [], [], []
    mean_returns, stds = {i: [] for i in range(2014, 2025)}, {i: [] for i in range(2014, 2025)}

    for i in range(len(df)):
        try:
            name = df["name"].values[i]
            ids = df["link"].values[i]
            data = pd.read_csv(f"./out/{ids}.csv", index_col=0)
            data = data.dropna()
            data["date"] = pd.to_datetime(data["date"])

            first_year = data["date"].dt.year.min()
            returns = get_returns(data["close"].values)

            names.append(name)
            symbols.append(ids)
            number_of_values.append(len(data))
            first_years.append(f"{first_year}")

            DAYS = 252

            for year in range(2014, 2025):
                if year < first_year:
                    mean_returns[year].append(0)
                    stds[year].append(0)
                else:
                    data_year_filtered = data[data["date"].dt.year >= year]
                    returns = get_returns(data_year_filtered["close"].values)
                    mean_returns[year].append(np.mean(returns) * DAYS)
                    stds[year].append(np.std(returns) * np.sqrt(DAYS))
        except:
            pass
    
    obj = {
        "name": names,
        "symbols": symbols,
        "number_of_values": number_of_values,
        "first_year": first_years,
        **{f"return_{col}": mean_returns[col] for col in mean_returns},
        **{f"vol_{col}": stds[col] for col in stds},
    }
    aggregated = pd.DataFrame(obj)
    aggregated.to_csv("./aggregated.csv")
    json.dump(obj, open("../web/src/data/list_aggregated.json", "w+"))
