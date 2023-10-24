import Axios from 'axios';
import Cookies from 'js-cookie';
import {BASE_URL} from './constants/auth';
import {store} from './redux/store';
import {logoutUser} from './redux/userReducer';

const axios = Axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});

axios.interceptors.request.use((config) => {
    const accessToken = Cookies.get('accessToken');
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
});

axios.interceptors.response.use((config) => {
    if (config.status === 401) {
        store.dispatch(logoutUser());
    }
    return config;
});

export default axios;
