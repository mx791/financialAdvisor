import React, { FC, ReactElement } from 'react';

const Menu: FC = (): ReactElement => {
    return (<div className='container menu'>
        <div className='menu-item'>LOGO</div>
        <div className='menu-item'>Accueil</div>
        <div className='menu-item'>Exploration de titres</div>
        <div className='menu-item'>Composition de portefeuille</div>
        <div className='menu-item'>Suivi de portefeuille</div>
    </div>)
};

export default Menu;