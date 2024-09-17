import React, { FC, ReactElement } from 'react';
import SplitContainer from '../components/SplitContainer';


const Footer: FC = (): ReactElement => {

    return (<div className='footer'>
        <div className='container'>
            <div className='sub-space'></div>
            <SplitContainer
                firstChild={(<>
                    <p><b>financial-advisor</b></p>
                    <p>2024</p>
                    <p>Tous droits réservés</p>
                </>)}
                secondChild={(<>
                    <p><b>A propos du créateur:</b></p>
                    <p>Charles LAURIOZ</p>
                    <p>Consultant data</p>
                    <p>Paris</p>
                </>)}
            />
        </div>
        <div className='sub-space'></div>
    </div>)
};

export default Footer;