import React, { FC, ReactElement } from 'react';

interface TextBoxProps {
    name: string,
    type: string
}

const TextBox: FC<TextBoxProps> = (props: TextBoxProps): ReactElement => {
    return (<div className=''>
        <input
            className='textbox'
            type={props.type}
            name={props.name}
            placeholder={props.name}
        />
    </div>)
};

export default TextBox;