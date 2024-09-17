import React, { FC, ReactElement } from 'react';
import ImageSection from '../components/ImageSection';


const LandingPage: FC = (): ReactElement => {
    return (<div>
        <ImageSection children={(<>
            <div className='space'></div>
            <h1>Professionalisez la gestion de votre épargne</h1>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <div className='space'></div>
        </>)} />
        <div className='space'></div>
    </div>)
};

export default LandingPage;