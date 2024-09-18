import Data from "./list_aggregated.json"

const fcs = {

    GetYears: () : string[] => {
        return Data["first_year"].sort().filter(
            (el,i,a) => i === a.indexOf(el)
        )
    }
    
}

export default fcs;