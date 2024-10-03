import React, { FC, ReactElement } from 'react';
import ImageSection from '../components/ImageSection';
import Portefeuille from '../data/Portefeuille';
import TextBox from '../components/TextBox';
import Button from '../components/Button';


const ComposePage: FC = (): ReactElement => {

    const [portefeuille] = React.useState(() => Portefeuille.instance);
    const [totalPonderation, setTotalPonderation] = React.useState(Portefeuille.getInstance().getTotalPonderation())
    const updatePonderation = (tardgetId: String, newValue: number) => {
        portefeuille.updatePonderation(tardgetId, newValue);
        setTotalPonderation(portefeuille.getTotalPonderation())
    }
    const [waiting, setWaiting] = React.useState(false);

    const click = async () => {
        setWaiting(true);
        await portefeuille.simulatePortefeuille();
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
        
        <div className='sub-space'></div>
        
        </div>

    </div>)
};

export default ComposePage;