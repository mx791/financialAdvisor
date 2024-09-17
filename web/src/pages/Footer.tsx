import React, { FC, ReactElement } from 'react';
import SplitContainer from '../components/SplitContainer';


const Footer: FC = (): ReactElement => {
    return (<div className='footer'>
        <SplitContainer
            firstChild={(<>
                <p>financial-advisor</p>
                <p>2024</p>
                <p>Tous droits réservés</p>
            </>)}
            secondChild={(<>
                <p>A propos du créateur:</p>
                <p>Charles LAURIOZ</p>
                <p>Consultant data</p>
                <p>Paris</p>
            </>)}
        />
    </div>)
};

export default Footer;