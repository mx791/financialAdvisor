import React, { FC, ReactElement } from 'react';
import SplitContainer from '../components/SplitContainer';
import TextBox from '../components/TextBox';
import ImageSection from '../components/ImageSection';
import Button from '../components/Button';
import GetExtremumValue from '../data/AggregatedData';

const ExplorePage: FC = (): ReactElement => {

    React.useEffect(() => {
        GetExtremumValue()
    }, [])
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

            <h2>Historique</h2>
            <TextBox name="Nombre de mois minimal d'historique" type="number" />
        </div>

        <div className='space'></div>
        
        <center>
            <Button text='Filtrer' />
        </center>
        <div className='space'></div>

    </div>)
};

export default ExplorePage;