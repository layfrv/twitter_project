import React from 'react';
import './TabsControl.scss';

interface ITabsControlProps {
    buttons: string[];
    clickedId: number;
    onClick: (id: number) => void;
}

export default function TabsControl(props: ITabsControlProps) {
    const {buttons, clickedId, onClick} = props;

    return (
        <div className='button-toggle'>
            {buttons.map((button, i) => (
                <button
                    key={i}
                    name={button}
                    onClick={() => onClick(i)}
                    className={i === clickedId ? 'button-toggle-btn__active' : 'button-toggle-btn'}
                >
                    {button}
                </button>
            ))}
        </div>
    );
}
