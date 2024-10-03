import Data from "./list_aggregated.json"

export type Instrument = {
    name: string,
    identifier: string,
    mean_return: number,
    volatility: number,
    lossRate: number,
    volumme: number,
    first_year: number,
    aggregated_from: number,
    correlation_cac: number,
    correlation_sp: number,
    correlation_nasdaq: number,
    correlation_nikkei: number,
    correlation_dax: number,
    correlation_world: number,
    correlation_eurostoxx: number,
}

interface IData {
    return_2014: number[]
}


const fcs = {

    GetYears: () : string[] => {
        return Data["first_year"].sort().filter(
            (el,i,a) => i === a.indexOf(el)
        ).map(itm => itm + "")
    },

    GetData: (
        maxYear: string, minVolumme: number,
        minReturn: number, maxReturn: number,
        minVolatility: number, maxVolatility: number,
        textSearch: string, minSharp: number
    ) : Instrument[] => {
        console.log(maxYear);
        const out: Instrument[] = [];
        for (let i=0; i<Data["name"].length; i++) {
            if (Data["first_year"][i] > parseInt(maxYear)) {
                continue
            }

            if (Data["volumme"][i] < minVolumme) {
                continue
            }

            const vol = Data["vol_" + maxYear as keyof IData][i] * 100;
            const ret = Data["return_" + maxYear as keyof IData][i] * 100;
            if (vol < minVolatility || vol > maxVolatility || vol === 0.0) {
                continue;
            }
            if (ret < minReturn || ret > maxReturn) {
                continue;
            }

            if (textSearch !== "" && !Data["name"][i].includes(textSearch)) {
                continue;
            }

            if (minSharp >= ret / vol) {
                continue;
            }

            out.push({
                name: Data["name"][i],
                identifier: Data["symbols"][i],
                mean_return: Data["return_" + maxYear as keyof IData][i]*100,
                volatility: Data["vol_" + maxYear as keyof IData][i]*100,
                lossRate: 100-Data["loss_" + maxYear as keyof IData][i]*100,
                volumme: Data["volumme"][i],
                first_year: Data["first_year"][i],
                aggregated_from: parseInt(maxYear),
                correlation_cac: Data["correlation_CAC40"][i],
                correlation_sp: Data["correlation_SP500"][i],
                correlation_dax: Data["correlation_DAX"][i],
                correlation_nikkei: Data["correlation_NIKKEI"][i],
                correlation_nasdaq: Data["correlation_NASDAQ"][i],
                correlation_world: Data["correlation_MSCI World"][i],
                correlation_eurostoxx: Data["correlation_EURO STOX 600"][i],
            });
        }
        return out;
    }
}

export default fcs;
