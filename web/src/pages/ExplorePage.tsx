import React, { FC, ReactElement } from 'react';
import SplitContainer from '../components/SplitContainer';
import TextBox from '../components/TextBox';
import ImageSection from '../components/ImageSection';
import Button from '../components/Button';
import AggregatedData, { Instrument } from '../data/AggregatedData';
import SelectInput from '../components/SelectInput';
import Plot from 'react-plotly.js';
import Constants from '../Constants';

const ExplorePage: FC = (): ReactElement => {

    const defaultYears: string[] = []
    const [years, setYears] = React.useState(defaultYears);
    React.useEffect(() => {
        setYears(AggregatedData.GetYears());
    }, []);

    const defaultData : Instrument[] = [];
    const [data, setData] = React.useState(defaultData);

    const filterData = () => {
        setData(AggregatedData.GetData("2018"));
    }

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
            <SelectInput name='Année minimale' options={years} />
            <div className='sub-space'></div>


            <h2>Rendement</h2>
            <SplitContainer
                firstChild={(<TextBox name="Rendement minimal (%)" type="number" />)}
                secondChild={(<TextBox name="Rendement maximal (%)" type="number" />)}
            />
            <div className='sub-space'></div>


            <h2>Volatilité</h2>
            <SplitContainer
                firstChild={(<TextBox name="Volatilité minimal (%)" type="number" />)}
                secondChild={(<TextBox name="Volatilité maximal (%)" type="number" />)}
            />
            <div className='sub-space'></div>
            
            <center>
                <Button text='Filtrer' onClick={filterData}/>
            </center>
            <div className='space'></div>

            { data.length !== 0 ? (
            <Plot
                data={[{
                    x: data.map(itm => itm.volatility),
                    y: data.map(itm => itm.mean_return),
                    type: 'scatter',
                    mode: 'markers',
                    marker: {
                        color: Constants.themeColor,
                        size: data.map(itm => 1 + Math.log(1+itm.volumme))
                    },
                    text: data.map(itm => itm.name),
                    hoverinfo: "text"
                }]}
                layout={{
                    width: Math.floor(window.innerWidth*0.8), height: 500, title: 'Diagramme risk/return',
                    xaxis: {title: "Volatilité %"},
                    yaxis: {title: "Rendement moyen annualisé %"},
                }}
            />) : "" }


            <div className='space'></div>
        
        </div>

    </div>)
};

export default ExplorePage;