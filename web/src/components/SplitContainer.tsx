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
    const divStyle2 = {
        flex: "1",
        paddingLeft: "1em"
    }
    
    return (<div style={containerStyle}>
        <div style={divStyle}>{ props.firstChild }</div>
        <div style={divStyle2}>{ props.secondChild }</div>
    </div>)
};

export default SplitContainer;
