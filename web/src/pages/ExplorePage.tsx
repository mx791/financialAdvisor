import React, { FC, ReactElement } from 'react';
import SplitContainer from '../components/SplitContainer';
import TextBox from '../components/TextBox';
import ImageSection from '../components/ImageSection';
import Button from '../components/Button';
import AggregatedData from '../data/AggregatedData';
import SelectInput from '../components/SelectInput';
import { Chart } from "react-google-charts";


const ExplorePage: FC = (): ReactElement => {

    const defaultYears: string[] = []
    const [years, setYears] = React.useState(defaultYears);
    React.useEffect(() => {
        setYears(AggregatedData.GetYears());
    }, []);

    const defaultData : any[][] = [];
    const [data, setData] = React.useState(defaultData);

    const filterData = () => {
        const out: any[][] = [["Risk", "Return"]];
        AggregatedData.GetData("2018").map((itm) => {
            out.push([itm.volatility, itm.mean_return]);
            return 0;
        })
        setData(out);
    }

    const options = {
        chart: {
          title: "Rendement en fonction du risque",
          subtitle: "based on hours studied",
        },
        axes: {
            x: {
                0: { side: "bottom" },
            }, y: {
                0: { side: "left" },
            },
        },
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

            <Chart
                chartType="Scatter"
                width="100%"
                height="500px"
                data={data}
                options={options}
            />

            <div className='space'></div>
        
        </div>

    </div>)
};

export default ExplorePage;