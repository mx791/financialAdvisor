import React, { FC, ReactElement } from 'react';

interface TextBoxProps {
    name: string,
    type: string,
    value: string,
    setValue: (v: string) => void
}

const TextBox: FC<TextBoxProps> = (props: TextBoxProps): ReactElement => {
    return (<div className=''>
        <p>{ props.name }</p>
        <input
            className='textbox'
            type={props.type}
            name={props.name}
            placeholder={props.name}
            value={props.value}
            onChange={(v) => props.setValue(v.target.value)}
        />
    </div>)
};

export default TextBox;