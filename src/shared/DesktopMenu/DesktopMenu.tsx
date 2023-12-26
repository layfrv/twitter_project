import {Dispatch, SetStateAction} from 'react';
import {NavLink} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {ReactComponent as Logo} from '../../ui/icons/logo.svg';
import {ReactComponent as LogoutIcon} from '../../ui/icons/logout.svg';
import {ReactComponent as MenuIcon} from '../../ui/icons/menu_left.svg';
import {ReactComponent as NewsIcon} from '../../ui/icons/news.svg';
import {ReactComponent as SubscriptionsIcon} from '../../ui/icons/subscriptions.svg';
import {ReactComponent as UserIcon} from '../../ui/icons/user.svg';
import './DesktopMenu.scss';

type DesktopMenuProps = {
  isMenuOpen: boolean,
  setMenuOpen: Dispatch<SetStateAction<boolean>>,
  handleLogout: () => void,
}

export default function DesktopMenu(props: DesktopMenuProps) {
    const {isMenuOpen, setMenuOpen, handleLogout} = props;

    return (
        <nav
            className={
                isMenuOpen
                    ? 'desktop-menu__container__open'
                    : 'desktop-menu__container__close'
            }
        >
            <div className='desktop-menu__header'>
                <div className='desktop-menu__header_logo'>
                    <Logo
                        className='desktop-menu__header_logo_icon'
                        onClick={() => setMenuOpen(!isMenuOpen)}
                    />
                    <p
                        className={
                            isMenuOpen ? 'desktop-menu__header_logo_text' : 'display-none'
                        }
                    >
                        KozhinDev
                    </p>
                </div>

                <button
                    onClick={() => setMenuOpen(!isMenuOpen)}
                    aria-label="open menu"
                >
                    <MenuIcon
                        className={isMenuOpen ? 'desktop-menu__icon' : 'display-none'}
                    />
                </button>
            </div>

            <ul className='desktop-menu__items'>
                <NavLink
                    className="desktop-menu__items_item"
                    activeClassName="desktop-menu__items_item_active"
                    to={RoutePaths.ROUTE_NEWS}
                >
                    <NewsIcon
                        className='desktop-menu__icon'
                        onClick={() => setMenuOpen(!isMenuOpen)}
                    />
                    <li
                        className={
                            isMenuOpen ? 'desktop-menu__items_item_text' : 'display-none'
                        }
                    >
                        Новости
                    </li>
                </NavLink>

                <NavLink
                    to={RoutePaths.ROUTE_SUBSCRIPTIONS}
                    className="desktop-menu__items_item"
                    activeClassName="desktop-menu__items_item_active"
                >
                    <SubscriptionsIcon
                        className='desktop-menu__icon'
                        onClick={() => setMenuOpen(!isMenuOpen)}
                    />
                    <li
                        className={
                            isMenuOpen ? 'desktop-menu__items_item_text' : 'display-none'
                        }
                    >
                        Подписки
                    </li>
                </NavLink>

                <NavLink
                    to={RoutePaths.ROUTE_PROFILE}
                    className="desktop-menu__items_item"
                    activeClassName="desktop-menu__items_item_active"
                >
                    <UserIcon
                        className='desktop-menu__icon'
                        onClick={() => setMenuOpen(!isMenuOpen)}
                    />

                    <li
                        className={
                            isMenuOpen ? 'desktop-menu__items_item_text' : 'display-none'
                        }
                    >
                        Мой профиль
                    </li>
                </NavLink>
            </ul>
            <div className='desktop-menu__footer'>
                <button
                    className='desktop-menu__footer__button'
                    onClick={handleLogout}
                >
                    <LogoutIcon className='desktop-menu__footer_icon' />
                    <p
                        className={
                            isMenuOpen ? 'desktop-menu__footer__button_text' : 'display-none'
                        }
                    >
                        Выйти из аккаунта
                    </p>
                </button>
            </div>
        </nav>
    );
}
