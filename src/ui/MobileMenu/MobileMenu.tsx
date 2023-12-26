import {Dispatch, SetStateAction, useEffect, useMemo} from 'react';
import {createPortal} from 'react-dom';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store';
import Avatar from '../Avatar';
import {ReactComponent as CloseIcon} from '../icons/cross.svg';
import {ReactComponent as Logo} from '../icons/logo.svg';
import {ReactComponent as MenuIcon} from '../icons/menu-mobile.svg';
import noneAvatar from '../images/none-avatar.png';
import './MobileMenu.scss';
import OpenedMobileMenu from './OpenedMobileMenu';

type MobileMenuProps = {
isMenuOpen: boolean,
setMenuOpen: Dispatch<SetStateAction<boolean>>,
handleLogout: () => void,
}

export default function MobileMenu(props: MobileMenuProps) {
    const {isMenuOpen, setMenuOpen, handleLogout} = props;
    const user = useSelector((state: RootState) => state.user.user);

    useEffect(() => {
        setMenuOpen(false);
    }, [setMenuOpen]);

    const isLogin = localStorage.getItem('accessToken');

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const avatarUrl = useMemo(
        () => user.avatarId
            ? `https://practice-backend.kozhin.dev/api/file/${user.avatarId}`
            : noneAvatar,
        [user],
    );

    if (!user) {
        return null;
    }

    return (
        <div className='mobile-header__container'>
            <div className='mobile-header  '>
                <button
                    className='mobile-header__logo'
                    aria-label="logo"
                >
                    <Logo />
                </button>
                <div className='mobile-header__btns'>
                    {isLogin ? (
                        <button
                            type='submit'
                            className='mobile-header__button'
                            aria-label="unsubscribe"
                        >
                            Войти
                        </button>
                    ) : (
                        <div className='mobile-header__user-avatar'>
                            <Avatar
                                imgUrl={avatarUrl}
                                size='36px'
                            />
                        </div>
                    )}
                    <button
                        className='mobile-header__menu'
                        aria-label="menu"
                    >
                        {isMenuOpen ? (
                            <CloseIcon onClick={toggleMenu} />
                        ) : (
                            <MenuIcon onClick={toggleMenu} />
                        )}
                    </button>
                </div>
            </div>

            {isMenuOpen && createPortal(
                <OpenedMobileMenu handleLogout={handleLogout} />,
                document.getElementById('root'),
            )}
        </div>
    );
}
