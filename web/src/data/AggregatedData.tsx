import Data from "./aggregated.json"


const GetExtremumValue = () => {
    const metrics = {
        min_return: 1000,
        max_return: -1000,
        min_std: 1000,
        max_std: -1000
    };
    console.log(Data)
    console.log(Data["vol"])
    for (let i=0; i<Object.keys(Data["name"]).length; i++) {
        //const returns = Data["mean_return"];
        //metrics["min_return"] = Math.min(metrics["min_return"], returns["0"]);
    }
    return metrics;
};

export default GetExtremumValue;