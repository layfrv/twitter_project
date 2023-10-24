import {PropsWithChildren, useState} from 'react';
import {useMediaQuery} from 'react-responsive';
import {useHistory} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {RootState, useAppDispatch, useAppSelector} from '../../redux/store';
import {logoutUser} from '../../redux/userReducer';
import Loader from '../../ui/Loader';
import MobileMenu from '../../ui/MobileMenu';
import DesktopMenu from '../DesktopMenu';
import './Layout.scss';

export default function Layout({children}: PropsWithChildren) {
    const {isLoadingUser, userError} = useAppSelector(
        (state: RootState) => state.user,
    );
    const dispatch = useAppDispatch();
    const history = useHistory();

    const [isMenuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        history.replace(RoutePaths.ROUTE_LOGIN);
        dispatch(logoutUser());
    };

    const isDesktopOrLaptop = useMediaQuery({
        query: '(min-width: 1050px)',
    });

    return (
        <div
            className='layout'
            id='layout'
        >
            {isLoadingUser && <Loader />}
            {isDesktopOrLaptop ? (
                <DesktopMenu
                    isMenuOpen={isMenuOpen}
                    setMenuOpen={setMenuOpen}
                    handleLogout={handleLogout}
                />
            ) : (
                <MobileMenu
                    isMenuOpen={isMenuOpen}
                    setMenuOpen={setMenuOpen}
                    handleLogout={handleLogout}
                />
            )}
            <main
                className='layout-content'
                id='layout-content'
            >
                {children}
            </main>
        </div>
    );
}
