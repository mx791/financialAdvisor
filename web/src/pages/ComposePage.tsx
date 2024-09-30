import React, { FC, ReactElement } from 'react';
import ImageSection from '../components/ImageSection';
import Portefeuille from '../data/Portefeuille';
import TextBox from '../components/TextBox';


const ComposePage: FC = (): ReactElement => {

    const [portefeuille] = React.useState(Portefeuille.getInstance());

    return (<div>
        <ImageSection children={(<>
            <div className='space'></div>
            <h1>Compostion de portefeuille</h1>
            <p>Explorez & exploitez les synergies entre différents actifs</p>
            <div className='space'></div>
        </>)} />

        <div className='container'>
            <div className='sub-space'></div>

        <h2>Ma composition :</h2>

        <table>
        { portefeuille.lines.map((itm) => <>
            <tr><td>{itm.name}</td><td>
                <TextBox name={"Pondération de " + itm.name} value={String(itm.ponderation)} type="number" setValue={(v) => parseFloat(v)}/>
            </td></tr>
        </>) }
        </table>
        
        </div>

    </div>)
};

export default ComposePage;