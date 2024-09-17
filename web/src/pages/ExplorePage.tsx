import React, { FC, ReactElement } from 'react';
import SplitContainer from '../components/SplitContainer';
import TextBox from '../components/TextBox';


const ExplorePage: FC = (): ReactElement => {
    return (<div>
        <div className='space'></div>
        <div className='container'>
            <h1>Exploration des titres</h1>
            <p>Partez à la recherche des pépites de notre base de données</p>
            <div className='space'></div>
            <h2>Rendement</h2>
            <SplitContainer
                firstChild={(<TextBox name="Rendement minimal" type="number" />)}
                secondChild={(<TextBox name="Rendement maximal" type="number" />)}
            />
        </div>
    </div>)
};

export default ExplorePage;