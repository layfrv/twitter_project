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
            {buttons.map((buttonText, i) => (
                <button
                    key={i}
                    name={buttonText}
                    onClick={() => onClick(i)}
                    className={i === clickedId ? 'button-toggle-btn__active' : 'button-toggle-btn'}
                    role="tab"
                >
                    {buttonText}
                </button>
            ))}
        </div>
    );
}
