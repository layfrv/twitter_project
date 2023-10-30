import Axios, {AxiosInstance, InternalAxiosRequestConfig} from 'axios';
import Cookies from 'js-cookie';
import {BASE_URL} from './constants/auth';
import {store} from './redux/store';
import {getAccessToken, logoutUser} from './redux/userReducer';

const axios: AxiosInstance = Axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

axios.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
    const accessToken = Cookies.get('accessToken');
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

axios.interceptors.response.use((config) => {
    const refreshToken = Cookies.get('refreshToken');
    if (config.status === 401) {
        store.dispatch(logoutUser());
    }
    if (config.status === 403) {
        store.dispatch(getAccessToken(refreshToken));
    }
    return config;
});

export default axios;
