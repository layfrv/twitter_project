import {ReactComponent as BackIcon} from '../icons/back-left.svg';
import './ReturnButton.scss';

type ReturnButtonProps = {
onClickHandler: () => void;
};

export default function ReturnButton(props: ReturnButtonProps) {
    return (
        <>
            <button
                onClick={props.onClickHandler}
                className='return__button'
            >
                <BackIcon />
                <p>Назад</p>
            </button>
        </>
    );
}
