import React, { FC, ReactElement } from 'react';

interface MenuProps {
    setActivePage: (i: String) => void
}

const Menu: FC<MenuProps> = (props: MenuProps): ReactElement => {
    return (<div className='container menu'>
        <div className='menu-item' onClick={() => props.setActivePage("MAIN")}>LOGO</div>
        <div className='menu-item' onClick={() => props.setActivePage("EXPLORE")}>Exploration de titres</div>
        <div className='menu-item' onClick={() => props.setActivePage("COMPOSE")}>Composition de portefeuille</div>
        <div className='menu-item' onClick={() => props.setActivePage("FOLLOW")}>Suivi de portefeuille</div>
    </div>)
};

export default Menu;