import pandas as pd
import numpy as np
import json


def get_returns(data: np.array) -> np.array:
    return data[1:] / data[:-1] - 1.0


if __name__ == "__main__":

    df = pd.concat([
        pd.read_csv("./etf_list.csv"),
        pd.read_csv("./funds.csv")
    ])

    names, symbols, number_of_values, first_years = [], [], [], []
    rs, vs = [], []
    mean_returns, stds = {i: [] for i in range(1, 11)}, {i: [] for i in range(1, 11)}

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
            rs.append(np.mean(returns) * DAYS)
            vs.append(np.std(returns) * np.sqrt(DAYS))
        except:
            pass
    
    obj = {
        "name": names,
        "symbols": symbols,
        "number_of_values": number_of_values,
        "first_year": first_years,
        "mean_return": rs,
        "vol": vs
    }
    aggregated = pd.DataFrame(obj)
    aggregated.to_csv("./aggregated.csv")
    json.dump(obj, open("./aggregated.json", "w+"))
