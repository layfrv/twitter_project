import {ReactComponent as ClearIcon} from '../icons/cross.svg';
import './TextField.scss';

type TextFieldProps = {
label: string;
value: string;
placeholder: string;
name: string;
onChange: (value: any) => void;
required?: boolean;
minLength?: number;
};

export default function TextField(props: TextFieldProps) {
    const {value, label, placeholder, name, onChange, required, minLength} = props;

    const isRequired = required && {required: true};

    function resizeTextarea() {
        const textareas: any = document.getElementsByClassName('text-field__text');
        const arrayFromElements: any = Array.from(textareas);
        arrayFromElements.map(
            // eslint-disable-next-line no-return-assign
            (element) => element.style.height = `${element.scrollHeight}px`,
        );
    }

    const handleChange = (event) => {
        onChange(event.target.value);
        resizeTextarea();
    };

    const deleteText = () => onChange('');

    return (
        <div className='text-field'>
            <label
                className='text-field__label'
                htmlFor='input'
            >
                {label}
            </label>

            <div className='text-field__container'>
                <textarea
                    {...isRequired}
                    name={name}
                    autoComplete='off'
                    className='text-field__text'
                    id='textarea'
                    placeholder={placeholder}
                    value={value}
                    onChange={handleChange}
                    minLength={minLength && minLength}
                />
                {value !== '' && (
                    <ClearIcon
                        className='text-field__icon'
                        onClick={deleteText}
                    />
                )}
            </div>
        </div>
    );
}
