import React from 'react';
import {useHistory} from 'react-router-dom';
import {RoutePaths} from './constants/routes';
import {useAppSelector} from './redux/store';

type WrapperProps = {
isPrivate: boolean;
children?: React.ReactNode;
};

export default function RouterWrapper({isPrivate, children}: WrapperProps) {
    const history = useHistory();
    const user = useAppSelector((state) => state.user.user);

    React.useEffect(() => {
        if (isPrivate && user === null) {
            history.replace(RoutePaths.ROUTE_LOGIN);
            return;
        }
        if (!isPrivate && user) {
            history.push(RoutePaths.ROUTE_PROFILE);
        }
    }, [isPrivate, user, history]);

    return <>{children}</>;
}
