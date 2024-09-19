import Data from "./list_aggregated.json"

export type Instrument = {
    name: string,
    identifier: string,
    mean_return: number,
    volatility: number,
    volumme: number
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

            out.push({
                name: Data["name"][i],
                identifier: Data["symbols"][i],
                mean_return: Data["return_" + maxYear as keyof IData][i]*100,
                volatility: Data["vol_" + maxYear as keyof IData][i]*100,
                volumme: Data["volumme"][i],
            });
        }
        return out;
    }
    
}

export default fcs;
