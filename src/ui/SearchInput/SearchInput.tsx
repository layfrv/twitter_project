import {LegacyRef} from 'react';
import './SearchInput.scss';

interface IInputProps {
value?: string;
name: string;
placeholder: string;
onChange?: (value: string) => void;
ref?: LegacyRef<HTMLInputElement>;
}

export default function SearchInput(props: IInputProps) {
    const {value, placeholder, onChange, name, ref} = props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <div className='search-input'>
            <input
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
        </div>
    );
}
