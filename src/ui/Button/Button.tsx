import cn from 'classnames';
import {
    MouseEventHandler,
} from 'react';
import './Button.scss';

type ButtonPropsType = {
label: string;
primary?: boolean;
secondary?: boolean;
onClick?: MouseEventHandler<HTMLButtonElement>;
isDisabled?: object;
width?: string;
};

export default function Button(props: ButtonPropsType) {
    const {primary, secondary, onClick, label, isDisabled} = props;

    const buttonClass = cn('button', {
        'button-primary': primary,
        'button-secondary': secondary,
    });

    return (
        <button
            type='submit'
            className={buttonClass}
            onClick={onClick}
            {...isDisabled}
            style={props.width && {width: props.width}}
        >
            {label}
        </button>
    );
}
