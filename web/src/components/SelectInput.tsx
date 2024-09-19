import React, { FC, ReactElement } from 'react';

interface SelectProps {
    name: string,
    options: string[],
    value: string,
    setValue: (v: string) => void
}

const SelectInput: FC<SelectProps> = (props: SelectProps): ReactElement => {
    return (<>
    <p>{props.name}</p>
    <select className='textbox' value={props.value} onChange={(e) => props.setValue(e.target.value)}>
        { props.options.map((itm) => (
            <option>{itm}</option>
        )) }
    </select></>)
};

export default SelectInput;
