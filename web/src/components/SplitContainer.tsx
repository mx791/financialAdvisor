import React, { FC, ReactElement } from 'react';

interface SplitContainerProps {
    firstChild: ReactElement,
    secondChild: ReactElement,
}

const SplitContainer: FC<SplitContainerProps> = (props: SplitContainerProps): ReactElement => {
    
    const containerStyle = {
        display: "flex"
    }

    const divStyle = {
        flex: "1"
    }
    
    return (<div style={containerStyle}>
        <div style={divStyle}>{ props.firstChild }</div>
        <div style={divStyle}>{ props.secondChild }</div>
    </div>)
};

export default SplitContainer;