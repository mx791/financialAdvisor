import React, { FC, ReactElement } from 'react';

interface ImageSectionProps {
    children: ReactElement,
    imageLink?: String
}

const ImageSection: FC<ImageSectionProps> = (props: ImageSectionProps): ReactElement => {
    
    return (<div className='background-image'>
        <div className='container'>
            { props.children }
        </div>
    </div>)
};

export default ImageSection;