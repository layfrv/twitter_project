import {NavLink} from 'react-router-dom';
import {RoutePaths} from '../../constants/routes';
import {useAppSelector} from '../../redux/store';
import './Error404Page.scss';

export default function Error404Page() {
    const user = useAppSelector((state) => state.user.user);

    return (
        <div className='error-page'>
            <h1>Такой страницы нет</h1>
            <NavLink to={user !== null ? RoutePaths.ROUTE_PROFILE : RoutePaths.ROUTE_LOGIN}>На главную</NavLink>
        </div>
    );
}
