import React, { FC, ReactElement } from 'react';

interface SelectProps {
    name: string,
    options: string[]
}

const SelectInput: FC<SelectProps> = (props: SelectProps): ReactElement => {
    return (<select>
        { props.options.map((itm) => (
            <option>{itm}</option>
        ))}
    </select>)
};

export default SelectInput;