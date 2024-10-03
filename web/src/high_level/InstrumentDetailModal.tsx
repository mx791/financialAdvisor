import React, { FC, ReactElement } from 'react';
import { Instrument } from '../data/AggregatedData';
import Plot from 'react-plotly.js';
import Constants from '../Constants';
import Modal from '../components/Modal';
import Portefeuille from '../data/Portefeuille';
import { SmallButton } from '../components/Button';


interface InstrumentDetailModalProps {
    instrument: Instrument,
    closeModal: () => void 
}

const InstrumentDetailModal: FC<InstrumentDetailModalProps> = (props: InstrumentDetailModalProps): ReactElement => {
    
    const [values, setValues] = React.useState(undefined as number[] | undefined);
    const [dates, setDates] = React.useState(undefined as string[] | undefined);
    const indexes = ["S&P 500", "NASDAQ 100", "CAC 40", "DAX", "NIKKEI", "MSCI World", "Euro Stoxx 600"];
    const correlationsScores = [
        props.instrument.correlation_sp, props.instrument.correlation_nasdaq, props.instrument.correlation_cac,
        props.instrument.correlation_dax, props.instrument.correlation_nikkei, props.instrument.correlation_world,
        props.instrument.correlation_eurostoxx
    ];
    const [portefeuille] = React.useState(Portefeuille.instance);
    const [isInPf, setIsInPf] = React.useState(() => Portefeuille.instance.isInPortefeuille(props.instrument.identifier));

    
    React.useEffect(() => {
        const fc = async () => {
            const rawData = await fetch("https://raw.githubusercontent.com/mx791/financialAdvisor/refs/heads/main/data/out/" + props.instrument.identifier + ".csv");
            const content = await rawData.text();
            const newDates = content.split("\n").slice(1,-1).map(itm => itm.split(",")[1]);
            const newValues = content.split("\n").slice(1,-1).map(itm => parseFloat(itm.split(",")[2]));
            setValues(newValues);
            setDates(newDates);
        }
        fc();
    }, [props.instrument.identifier]);

    if (typeof values === "undefined") {
        return (<>Waiting...</>)
    }
    
    return (<Modal close={props.closeModal} children={(<>
        <h2>{ props.instrument.name }</h2>
        <Plot
            data={[{
                x: dates,
                y: values,
                type: 'scatter',
                mode: 'lines+markers',
                marker: {
                    color: Constants.themeColor,
                    size: 3
                }
            }]}
            layout={{
                width: Math.floor(window.innerWidth*0.8) - 20,
                height: Math.min(Math.floor(window.innerWidth*0.8), 500),
                title: "Evolution du prix de l'actif"
            }}
        />

        <Plot
            data={[{
                x: indexes,
                y: correlationsScores,
                type: 'bar',
                marker: {
                    color: Constants.themeColor
                }
            }]}
            layout={{
                width: Math.floor(window.innerWidth*0.8) - 20,
                height: Math.min(Math.floor(window.innerWidth*0.8), 500),
                title: "Corrélation avec les indices"
            }}
        />
        <br />
        { isInPf
            ? <p>Le titre est dans votre portefeuille</p>
            : <center><SmallButton
                text='Ajouter au portefeuille'
                onClick={() => {
                    portefeuille.addLine(props.instrument.identifier, props.instrument.name);
                    setIsInPf(true);
                }}
            /></center>
        }

    </>)}/>)
};

export default InstrumentDetailModal;