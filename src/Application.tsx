import Cookies from 'js-cookie';
import * as React from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom';
import RouterWrapper from './RouterWrapper';
import {RoutePaths} from './constants/routes';
import {sortPostByPinPost} from './redux/postsReducer';
import {useAppDispatch, useAppSelector} from './redux/store';
import {getUser} from './redux/userReducer';
import {router} from './routes';
import Loader from './ui/Loader';

export const App = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);
    const {isReady, error} = useAppSelector((root) => root.app);

    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');

    React.useEffect(() => {
        if (accessToken && refreshToken) {
            dispatch(getUser());

            if (user !== null) {
                dispatch(sortPostByPinPost());
            }
        }
    }, [accessToken]);

    if (!isReady) {
        return <Loader />;
    }

    if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        window.location.replace(RoutePaths.ROUTE_LOGIN);
    }

    return (
        <Router>
            <Switch>
                {router.map((route, index) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        exact
                        component={() => (
                            <RouterWrapper isPrivate={route.isPrivate}>
                                {route.element}
                            </RouterWrapper>
                        )}
                    />
                ))}
            </Switch>
        </Router>
    );
};
