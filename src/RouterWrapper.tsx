import Cookies from 'js-cookie';
import React from 'react';
import {RoutePaths} from './constants/routes';
import {useAppDispatch} from './redux/store';
import {getAccessToken} from './redux/userReducer';

type WrapperProps = {
isPrivate: boolean,
children?: React.ReactNode,
};

export default function RouterWrapper({isPrivate, children}: WrapperProps) {
    const dispatch = useAppDispatch();

    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    React.useEffect(() => {
        if (!accessToken && refreshToken) {
            dispatch(getAccessToken(refreshToken));
        }
        if (isPrivate && !accessToken && !refreshToken) {
            window.location.replace(RoutePaths.ROUTE_LOGIN);
        }
        if (!isPrivate && accessToken) {
            window.location.replace(RoutePaths.ROUTE_PROFILE);
        }
    }, []);

    return <>{children}</>;
}
