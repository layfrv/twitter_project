import {ReactNode, useEffect} from 'react';
import './ModalWrapper.scss';

type ModalWrapperProps = {
children: ReactNode;
width?: string
}

export default function ModalWrapper({children, width = ''}: ModalWrapperProps) {
    useEffect(() => {
        const body = document.querySelector('body');

        body.style.overflow = 'hidden';

        return () => {
            body.style.overflow = 'auto';
        };
    }, []);

    return (
        <div className='modal-wrapper'>
            <div className='modal-wrapper__background' />
            <div
                className='modal-wrapper__content'
                style={{width}}
            >
                {children}
            </div>
        </div>
    );
}
