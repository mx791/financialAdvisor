import React, { FC, ReactElement } from 'react';
import SplitContainer from '../components/SplitContainer';
import TextBox from '../components/TextBox';
import ImageSection from '../components/ImageSection';
import Button from '../components/Button';
import AggregatedData, { Instrument } from '../data/AggregatedData';
import SelectInput from '../components/SelectInput';
import Plot from 'react-plotly.js';
import Constants from '../Constants';
import InstrumentDetailModal from '../high_level/InstrumentDetailModal';


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
    const [textSearch, setTextSearch] = React.useState("");

    const filterData = () => {
        setData(AggregatedData.GetData(
            year, minVolumme, minReturn, maxReturn, minVolatility, maxVolatility, textSearch
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

            <TextBox
                name="Nom du fond"
                type="text"
                value={textSearch}
                setValue={(v) => setTextSearch(v)}
            />
            <div className='sub-space'></div>

            <TextBox
                name="Volumme minimal"
                type="number"
                value={String(minVolumme)}
                setValue={(v) => setMinVolumme(parseFloat(v))}
            />
            <div className='sub-space'></div>

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
