import {RoutePaths} from '../constants/routes';
import AuthPage from './AuthPage';
import EditProfilePage from './EditProfilePage';
import Error404Page from './Error404Page';
import NewsPage from './NewsPage';
import PostPage from './PostPage';
import ProfilePage from './ProfilePage';
import SubscriptionPage from './SubscriptionsPage';
import UserByIdPage from './UserByIdPage';

export const router = [
    {
        path: RoutePaths.ROUTE_INDEX,
        isPrivate: false,
        element: <AuthPage />,
    },
    {
        path: RoutePaths.ROUTE_LOGIN,
        isPrivate: false,
        element: <AuthPage />,
    },
    {
        path: RoutePaths.ROUTE_PROFILE,
        isPrivate: true,
        element: <ProfilePage />,
    },
    {
        path: RoutePaths.ROUTE_NEWS,
        isPrivate: true,
        element: <NewsPage />,
    },
    {
        path: RoutePaths.ROUTE_USER_ID,
        isPrivate: true,
        element: <UserByIdPage />,
    },
    {
        path: RoutePaths.ROUTE_SUBSCRIPTIONS,
        isPrivate: true,
        element: <SubscriptionPage />,
    },
    {
        path: RoutePaths.ROUTE_EDIT_PROFILE,
        isPrivate: true,
        element: <EditProfilePage />,
    },
    {
        path: RoutePaths.ROUTE_POST_ID,
        isPrivate: true,
        element: <PostPage />,
    },
    {
        path: '*',
        element: <Error404Page />,
        isPrivate: false,
    },
];
