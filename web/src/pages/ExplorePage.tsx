import React, { FC, ReactElement } from 'react';
import SplitContainer from '../components/SplitContainer';
import TextBox from '../components/TextBox';
import ImageSection from '../components/ImageSection';
import Button from '../components/Button';
import AggregatedData, { Instrument } from '../data/AggregatedData';
import SelectInput from '../components/SelectInput';
import Plot from 'react-plotly.js';
import Constants from '../Constants';
import Modal from '../components/Modal';


interface InstrumentDetailModalProps {
    instrument: Instrument,
    closeModal: () => void 
}

const InstrumentDetailModal: FC<InstrumentDetailModalProps> = (props: InstrumentDetailModalProps): ReactElement => {
    
    const [values, setValues] = React.useState(undefined as number[] | undefined);
    const [dates, setDates] = React.useState(undefined as string[] | undefined);
    
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
                width: Math.floor(window.innerWidth*0.8), height: 500, title: "Evolution du prix de l'actif"
            }}
        />
    </>)}/>)
};

const ExplorePage: FC = (): ReactElement => {

    const [years] = React.useState(AggregatedData.GetYears());
    const defaultData : Instrument[] = [];
    const [data, setData] = React.useState(defaultData);
    const [year, setYear] = React.useState(years[0]);
    const [minVolumme, setMinVolumme] = React.useState(0);
    const [minReturn, setMinReturn] = React.useState(-100);
    const [maxReturn, setMaxReturn] = React.useState(100);
    const [minVolatility, setMinVolatility] = React.useState(0);
    const [maxVolatility, setMaxVolatility] = React.useState(100);
    const [selectedInstrument, setSelectedInstruement] = React.useState(undefined as Instrument | undefined);
    const [modalOpen, setModalOpen] = React.useState(false);

    const filterData = () => {
        setData(AggregatedData.GetData(
            year, minVolumme, minReturn, maxReturn, minVolatility, maxVolatility
        ));
    };

    return (<div>
        <ImageSection children={(<>
            <div className='space'></div>
            <h1>Exploration des titres</h1>
            <p>Partez à la recherche des pépites de notre base de données</p>
            <div className='space'></div>
        </>)} />

        <div className='sub-space'></div>
        <div className='container'>

            <div className='space'></div>
            <h2>Historique</h2>
            <SelectInput
                name='Année minimale'
                options={years}
                value={year}
                setValue={setYear}
            />
            <div className='sub-space'></div>

            <h2>Volume</h2>
            <TextBox
                name="Volumme minimal"
                type="number"
                value={String(minVolumme)}
                setValue={(v) => setMinVolumme(parseFloat(v))}
            />
            <div className='sub-space'></div>

            <h2>Rendement</h2>
            <SplitContainer
                firstChild={(<TextBox
                    name="Rendement minimal (%)"
                    type="number"
                    value={String(minReturn)}
                    setValue={(v) => setMinReturn(parseFloat(v))}
                />)}
                secondChild={(<TextBox
                    name="Rendement maximal (%)"
                    type="number"
                    value={String(maxReturn)}
                    setValue={(v) => setMaxReturn(parseFloat(v))}
                />)}
            />
            <div className='sub-space'></div>

            <h2>Volatilité</h2>
            <SplitContainer
                firstChild={(<TextBox
                    name="Volatilité minimal (%)"
                    type="number"
                    value={String(minVolatility)}
                    setValue={(v) => setMinVolatility(parseFloat(v))}
                />)}
                secondChild={(<TextBox
                    name="Volatilité maximal (%)"
                    type="number"
                    value={String(maxVolatility)}
                    setValue={(v) => setMaxVolatility(parseFloat(v))}
                />)}
            />
            <div className='sub-space'></div>
            
            <center>
                <Button text='Filtrer' onClick={filterData}/>
            </center>
            <div className='space'></div>

            { data.length !== 0 ? (<p>{data.length} items</p>) : "" }
            { data.length !== 0 ? (
            <Plot
                data={[{
                    x: data.map(itm => itm.volatility),
                    y: data.map(itm => itm.mean_return),
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                        color: Constants.themeColor,
                        size: data.map(itm => 5 + Math.log(1+itm.volumme))
                    },
                    text: data.map(itm => itm.name),
                    hoverinfo: "text"
                }]}
                layout={{
                    width: Math.min(1000, Math.floor(window.innerWidth*0.9)), height: 500, title: 'Diagramme risk/return',
                    xaxis: {title: "Volatilité %"},
                    yaxis: {title: "Rendement moyen annualisé %"},
                }}
                onClick={(event) => setSelectedInstruement(data[event.points[0].pointIndex])}
            />) : "" }

            <div className='sub-space'></div>
            { typeof selectedInstrument === "undefined" ? "" : (<div className='box' onClick={() => setModalOpen(true)}>
                <b>{ selectedInstrument?.name }</b><br/>
                <p>Début def l'historique: { selectedInstrument?.first_year }</p>
                <p>Rendement moyen depuis { selectedInstrument.aggregated_from }: { Math.floor(selectedInstrument?.mean_return*100.0)/100.0 } % / ans</p>
                <p>Volatilité depuis { selectedInstrument.aggregated_from }: { Math.floor(selectedInstrument?.volatility*100.0)/100.0 } %</p>
                <p>Ratio de Sharp: { Math.floor(selectedInstrument.mean_return / selectedInstrument.volatility * 100.0) / 100.0 }</p>
                <p>Moyenne des volumes quotidiens: { Math.floor(selectedInstrument?.volumme) } €</p>
            </div>) }

            <div className='space'></div>

            { modalOpen && typeof selectedInstrument !== "undefined" ? (<InstrumentDetailModal
                instrument={selectedInstrument}
                closeModal={() => setModalOpen(false)}
            />) : "" }
        </div>
    </div>)
};

export default ExplorePage;
