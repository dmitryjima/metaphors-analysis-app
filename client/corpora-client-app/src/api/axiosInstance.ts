import axios from 'axios';

import { store } from '../app/store'
import { _setLoginModalShown, _setLoginSessionExpired } from '../slices/uiSlice';
import { _resetState } from '../slices/userSlice';

export const axiosInstance = axios.create();


axiosInstance.interceptors.response.use((response) => {
    return response;
}, (err) => {
    if (err.response && err.response.status === 401) {
        store.dispatch(_resetState());
        store.dispatch(_setLoginSessionExpired(true));
        store.dispatch(_setLoginModalShown(true));
    } 
    return Promise.reject(err);
});