import React, { FC, ReactElement } from 'react';

interface ButtonProps {
    text: string,
    onClick: () => void
}

const Button: FC<ButtonProps> = (props: ButtonProps): ReactElement => {
    return (<div className='button' onClick={props.onClick}>
        {props.text}
    </div>)
};

export default Button;