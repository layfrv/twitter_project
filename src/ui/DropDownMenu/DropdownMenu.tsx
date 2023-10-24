import {useRef, useState} from 'react';
import useClickOutside from '../../hooks/useClickOutside';
import {ReactComponent as MenuIcon} from '../icons/menu-dots.svg';
import './DropdownMenu.scss';

type ItemsType = {
name: string;
func: () => void;
};

type DropdownMenuType = {
items: ItemsType[];
selectOnClick?: () => void;
};

export default function DropdownMenu(props: DropdownMenuType) {
    const menuRef = useRef(null);
    const [isOpenMenu, setOpenMenu] = useState(false);

    const menuHandler = () => {
        setOpenMenu(!isOpenMenu);
    };

    useClickOutside(menuRef, () => setOpenMenu(false));

    return (
        <div
            className='dropdown-menu'
            onClick={props.selectOnClick}
            role='button'
            onKeyDown={props.selectOnClick}
            tabIndex={0}
        >
            <div className='dropdown-menu__menu-icon'>
                <MenuIcon
                    ref={menuRef}
                    onClick={menuHandler}
                />
            </div>

            {isOpenMenu && (
                <div className='dropdown-menu__container'>
                    <ul
                        className='dropdown-menu__list'
                        role="menu"
                    >
                        {props.items.map((item) => (
                            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                            <li
                                className='dropdown-menu__list-item'
                                onClick={() => item.func()}
                                key={item.name}
                            >
                                <p>{item.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
