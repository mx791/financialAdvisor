import React, { FC, ReactElement } from 'react';

interface ButtonProps {
    text: string
}

const Button: FC<ButtonProps> = (props: ButtonProps): ReactElement => {
    return (<div className='button'>
        {props.text}
    </div>)
};

export default Button;