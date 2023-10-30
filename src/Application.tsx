import {useEffect} from 'react';
import {
    Route,
    BrowserRouter as Router,
    Switch,
} from 'react-router-dom';
import RouterWrapper from './RouterWrapper';
import {useAppDispatch, useAppSelector} from './redux/store';
import {getUser} from './redux/userReducer';
import {router} from './routes';
import Loader from './ui/Loader';

export const App = () => {
    const dispatch = useAppDispatch();
    const {isReady, error} = useAppSelector((root) => root.app);

    useEffect(() => {
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
            dispatch(getUser());
        }
    }, []);

    if (!isReady && window.location.pathname !== '/login' && window.location.pathname !== '/') {
        return <Loader />;
    }

    if (error) {
        // eslint-disable-next-line no-console
        console.log(error);
    }

    return (
        <Router>
            <Switch>
                {router.map((route) => (
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
