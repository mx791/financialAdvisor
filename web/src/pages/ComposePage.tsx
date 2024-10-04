import React, { FC, ReactElement } from 'react';
import ImageSection from '../components/ImageSection';
import Portefeuille, { Record } from '../data/Portefeuille';
import TextBox from '../components/TextBox';
import Button from '../components/Button';
import Plot from 'react-plotly.js';
import Constants from '../Constants';


const ComposePage: FC = (): ReactElement => {

    const [portefeuille] = React.useState(() => Portefeuille.instance);
    const [totalPonderation, setTotalPonderation] = React.useState(Portefeuille.getInstance().getTotalPonderation())
    const updatePonderation = (tardgetId: String, newValue: number) => {
        portefeuille.updatePonderation(tardgetId, newValue);
        setTotalPonderation(portefeuille.getTotalPonderation())
    }
    const [waiting, setWaiting] = React.useState(false);
    const [aggregated, setAggregated] = React.useState([] as Record[]);

    const click = async () => {
        setWaiting(true);
        const pf = await portefeuille.simulatePortefeuille();
        setAggregated(pf);
        setWaiting(false);
    }

    return (<div>
        <ImageSection children={(<>
            <div className='space'></div>
            <h1>Compostion de portefeuille</h1>
            <p>Explorez & exploitez les synergies entre différents actifs</p>
            <div className='space'></div>
        </>)} />

        <div className='container'>
        
        <div className='sub-space'></div>
        <b>Pondération totale : {Math.round(totalPonderation*100)} %</b>
        <div className='sub-space'></div>

        <h2>Ma composition :</h2>

        <table style={{width: "100%"}}>
        { portefeuille.lines.map((itm) => <>
            <tr><td>{itm.name}</td><td>
                <TextBox name="Pondération %" value={String(itm.ponderation * 100)} type="number" setValue={(v) => updatePonderation(itm.id, parseFloat(v)/100)}/>
            </td></tr>
        </>) }
        </table>

        <div className='sub-space'></div>
        <center>
            { waiting ? "Chargement..." : (
                <Button text='Simuler le portefeuille' onClick={click}/>
            ) }
        </center>

        { aggregated.length === 0 ? "" : (
        <Plot
            data={[{
                x: aggregated.map(i => i.date + ""),
                y: aggregated.map(i => i.value),
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
        ) }
        
        <div className='sub-space'></div>
        
        </div>

    </div>)
};

export default ComposePage;