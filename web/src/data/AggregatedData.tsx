import Data from "./list_aggregated.json"

export type Instrument = {
    name: string,
    identifier: string,
    mean_return: number,
    volatility: number,
}

const fcs = {

    GetYears: () : string[] => {
        return Data["first_year"].sort().filter(
            (el,i,a) => i === a.indexOf(el)
        )
    },

    GetData: (max_year: string) : Instrument[] => {
        const out: Instrument[] = [];
        for (let i=0; i<Data["name"].length; i++) {
            if (parseInt(Data["first_year"][i]) < parseInt(max_year)) {
                if (Data["vol_2018"][i] > 1.5) {
                    continue
                }
                out.push({
                    name: Data["name"][i],
                    identifier: Data["symbols"][i],
                    mean_return: Data["return_2018"][i]*100,
                    volatility: Data["vol_2018"][i]*100,
                })
            }
        }
        return out;
    }
    
}

export default fcs;