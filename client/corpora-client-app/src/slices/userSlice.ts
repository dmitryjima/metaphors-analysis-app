import { createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';

import { loadStateLS, saveStateLS } from '../utils/localStorage';

import { login, logout, checkToken } from '../api/endpoints/authentication';
import { AppDispatch, RootState } from '../app/store';

// Toasts
import { toast } from 'react-toastify';
import { _setLoginModalShown, _setLoginSessionExpired } from './uiSlice';
import { DefaultRootState } from 'react-redux';

export interface UserState {
    user: string,
    isAuthenticated: boolean,
    isLoading: boolean,
    error?: string
}

const defaultState: UserState = {
    user: '',
    isAuthenticated: false,
    isLoading: false
}

const initialState = loadStateLS('user') ? loadStateLS('user') : defaultState;

export const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        _setUser(state, action) {
            const { user } = action.payload;
            state.user = user
        },
        _setAuthenticated(state, action) {
            state.isAuthenticated = action.payload
        },
        _setLoading(state, action) {
            state.isLoading = action.payload
        },
        _resetState(state, action) {
            state = defaultState
        },
        _setError(state, action) {
            state.error = action.payload
        }
    }
});

export const {
    _setUser,
    _setAuthenticated,
    _setLoading,
    _resetState,
    _setError
} = user.actions;


export const handleLogin = (
    username: string,
    password: string,
    successMsg?: string,
    errorMsg?: string
) => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
        dispatch(_setLoading(true));
        dispatch(_setError(''));

        const response = await login(username, password);

        if(response && response.status === 'OK') {
            dispatch(_setAuthenticated(true));
            dispatch(_setUser(username));

            dispatch(_setLoginModalShown(false));
            dispatch(_setLoading(false));

            saveStateLS(
                {
                    user: username,
                    isAuthenticated: true,
                    isLoading: false
                }, 
                'user'
            );

            toast.success(successMsg ? successMsg : "Logged in succesfully");
        }
    } catch (err) {
        dispatch(_setLoading(false));
        dispatch(_setError(err.toString()));
        dispatch(_resetState(''))
        console.log(err);
        toast.error(errorMsg ? errorMsg : "An error occured")
    }
}

export const handleLogout = () => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
        dispatch(_setLoading(true));
        dispatch(_setError(''));

        const response = await logout();

        if(response && response.status === 'OK') {
            dispatch(_resetState(''));
            dispatch(_setLoading(false));
            saveStateLS(
                defaultState, 
                'user'
            );
        }
    } catch (err) {
        dispatch(_resetState(''));
        dispatch(_setLoading(false));
        console.log(err);
    }
}

export const handleCheckToken = () => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
        let state = getState()

        if (state.user && state.user.isAuthenticated) {
            const checkTokeRes = await checkToken()
            if(!checkTokeRes || checkTokeRes.status !== 'OK') {
                dispatch(_setLoginModalShown(true));
                dispatch(_setLoginSessionExpired(true));
                dispatch(_resetState(''));
                saveStateLS(
                    defaultState, 
                    'user'
                );
            }
        } else {
            return
        }
    } catch (err) {
        console.log(err);
        dispatch(_setLoginModalShown(true));
        dispatch(_setLoginSessionExpired(true));
        dispatch(_resetState(''));
        saveStateLS(
            defaultState, 
            'user'
        );
    }
}


export default user.reducer;