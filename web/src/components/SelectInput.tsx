import React, { FC, ReactElement } from 'react';

interface SelectProps {
    name: string,
    options: string[],
    value: string,
    setValue: (v: string) => void
}

const SelectInput: FC<SelectProps> = (props: SelectProps): ReactElement => {
    return (<select className='textbox'>
        { props.options.map((itm) => (
            <option
                selected={itm === props.value}
                onClick={() => props.setValue(itm)}
            >{itm}</option>
        ))}
    </select>)
};

export default SelectInput;