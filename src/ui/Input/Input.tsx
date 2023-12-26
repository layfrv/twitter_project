import {KeyboardEventHandler, useState} from 'react';
import emailValidation from '../../utils/emailValidation';
import {ReactComponent as CrossIcon} from '../icons/cross.svg';
import {ReactComponent as EyeIcon} from '../icons/view-hide.svg';
import './Input.scss';

interface IInputProps {
label: string,
type: 'text' | 'number' | 'email' | 'password',
name: string,
value: string | number | string[],
placeholder: string,
onChange: (value: any) => void,
disabled?: boolean,
required?: boolean,
maxLength?: number,
minLength?: number,
onKeyDownHandler?: KeyboardEventHandler,
}

export default function Input(props: IInputProps) {
    const {
        label,
        type,
        placeholder,
        name,
        value,
        onChange,
        required,
        maxLength,
        minLength,
        onKeyDownHandler,
    } = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    const inputClear = () => {
        onChange('');
    };

    const [passwordShown, setPasswordShown] = useState(false);

    const toggleVisiblePassword = () => {
        setPasswordShown((prevState) => !prevState);
    };

    const isText = type === 'text' || type === 'email';

    const buttonHandler = () => {
        if (isText) {
            inputClear();
        } else {
            toggleVisiblePassword();
        }
    };

    const isRequired = required && {required: true};

    return (
        <div className='input'>
            <label
                className='input-label'
                htmlFor={name}
            >
                {label}
            </label>

            <div className="input-field">
                <input
                    {...isRequired}
                    className='input-field__text'
                    id={name}
                    value={value}
                    name={name}
                    type={
                        type === 'email'
                            ? 'email'
                            : type === 'text'
                                ? 'text'
                                : passwordShown
                                    ? 'text'
                                    : 'password'
                    }
                    placeholder={placeholder}
                    onChange={handleChange}
                    minLength={minLength && minLength}
                    maxLength={maxLength && maxLength}
                    autoComplete='on'
                    onKeyDown={onKeyDownHandler}
                    pattern={type === 'email' && emailValidation}
                />
                <div
                    className='input-field__icon'
                    onClick={buttonHandler}
                    role='button'
                    tabIndex={0}
                    onKeyDown={buttonHandler}
                >
                    {type === 'password' ? <EyeIcon /> : <CrossIcon />}
                </div>
            </div>
        </div>
    );
}
