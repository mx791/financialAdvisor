import React, { ReactElement } from "react"


interface ModalProps {
    close: () => void,
    children: ReactElement
}

const Modal: React.FC<ModalProps> = (props: ModalProps): React.ReactElement => {
    return (<>
        <div className="modal-dark" onClick={() => props.close()}></div>
        <div className="modal-light">{ props.children }</div>
    </>)
};

export default Modal;