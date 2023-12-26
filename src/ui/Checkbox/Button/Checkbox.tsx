import {ReactComponent as CheckIcon} from '../../icons/check.svg';
import './Checkbox.scss';

interface ICheckboxProps {
text: string,
isActive: boolean,
onClick: (ChangeEvent) => void,
}

export default function Checkbox(props: ICheckboxProps) {
    const {text, isActive, onClick} = props;

    return (
        <div className='checkbox'>
            <button
                onClick={onClick}
                className={`checkbox-icon ${isActive ? 'checkbox-icon__checked' : ''}`}
            >
                {isActive && <CheckIcon />}
            </button>

            <p className='checkbox-text'>{text}</p>
        </div>
    );
}
