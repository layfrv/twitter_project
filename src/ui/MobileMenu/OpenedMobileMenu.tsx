import {NavLink} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {ReactComponent as NewsIcon} from '../icons/news.svg';
import {ReactComponent as SubscriptionsIcon} from '../icons/subscriptions.svg';
import {ReactComponent as UserIcon} from '../icons/user.svg';
import './MobileMenu.scss';

type OpenedMobileMenuProps = {
handleLogout: () => void,
}

export default function OpenedMobileMenu(props: OpenedMobileMenuProps) {
    const {handleLogout} = props;
    return (
        <div className='mobile-menu'>
            <nav className='mobile-menu__items'>
                <NavLink
                    to={RoutePaths.ROUTE_NEWS}
                    className="mobile-menu__item"
                    activeClassName="mobile-menu__item_active"
                >
                    <NewsIcon className='mobile-menu__item-icon' />
                    <p className='mobile-menu__item-text'>Новости</p>
                </NavLink>
                <NavLink
                    to={RoutePaths.ROUTE_SUBSCRIPTIONS}
                    className="mobile-menu__item"
                    activeClassName="mobile-menu__item_active"
                >
                    <SubscriptionsIcon className='mobile-menu__item-icon' />
                    <p className='mobile-menu__item-text'>Подписки</p>
                </NavLink>
                <NavLink
                    to={RoutePaths.ROUTE_PROFILE}
                    className="mobile-menu__item"
                    activeClassName="mobile-menu__item_active"
                >
                    <UserIcon className='mobile-menu__item-icon' />
                    <p className='mobile-menu__item-text'>Мой профиль</p>
                </NavLink>
            </nav>

            <div className='mobile-menu__footer'>
                <button
                    className='mobile-menu__footer_button'
                    onClick={handleLogout}
                >
                    <p className='mobile-menu__footer_button-text'>Выйти из аккаунта</p>
                </button>
            </div>
        </div>
    );
}
