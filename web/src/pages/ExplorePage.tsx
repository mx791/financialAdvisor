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

            <div className='space'></div>
            
            <center>
                <Button text='Filtrer' onClick={filterData}/>
            </center>
            <div className='space'></div>

            <Plot
                data={[{
                    x: data.map(itm => itm.volatility),
                    y: data.map(itm => itm.mean_return),
                    type: 'scatter',
                    mode: 'markers',
                    marker: {color: Constants.lightThemeColor},
                }]}
                layout={{
                    width: 500, height: 500, title: 'Diagramme risk/return',
                    "xaxis.title": "Volatilité"
                }}
            />

            <div className='space'></div>
        
        </div>

    </div>)
};

export default ExplorePage;