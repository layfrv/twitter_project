import Button from '../Button';
import {ReactComponent as Logo} from '../icons/logo.svg';
import {ReactComponent as MenuIcon} from '../icons/menu-mobile.svg';

interface IPropsMenu {
className: string,
}

export default function DesktopHeader(props: IPropsMenu) {
    const {className} = props;

    return (
        <div className={className}>
            <button
                className={`${className}-logo`}
                aria-label="logo"
            >
                <Logo />
            </button>
            <div className={`${className}-btns`}>
                <Button
                    secondary
                    label='Войти'
                />
                <button
                    className='header-menu'
                    aria-label="menu"
                >
                    <MenuIcon />
                </button>
            </div>
        </div>
    );
}
