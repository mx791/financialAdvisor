import pandas as pd
import numpy as np
import json


def get_returns(data: np.array) -> np.array:
    returns = data[1:] / data[:-1] - 1.0
    return returns[~np.isnan(returns)]


if __name__ == "__main__":

    df = pd.concat([
        pd.read_csv("./etf_list.csv"),
        pd.read_csv("./funds.csv")
    ])

    names, symbols, number_of_values, first_years, mean_volumme = [], [], [], [], []
    mean_returns, stds = {i: [] for i in range(2014, 2025)}, {i: [] for i in range(2014, 2025)}

    for i in range(len(df)):
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
            mean_volumme.append(data["volumme"].mean())

            names.append(name)
            symbols.append(ids)
            number_of_values.append(len(data))
            first_years.append(int(first_year))

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
    }
    aggregated = pd.DataFrame(obj).dropna()
    aggregated.to_csv("./aggregated.csv")
    json.dump(obj, open("../web/src/data/list_aggregated.json", "w+"))
