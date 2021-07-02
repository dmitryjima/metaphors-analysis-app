import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';


import { useTranslation } from 'react-i18next';


import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { _setLoginModalShown, _setLoginSessionExpired } from '../../slices/uiSlice';
import { handleLogin } from '../../slices/userSlice';

const LoginModalDialog = () => {
    const { t, i18n, ready } = useTranslation('loginModal');

    const dispatch = useAppDispatch();
    const { user: userState, ui: uiState } = useAppSelector(state => state)

    // Local state
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');


    return (
        <Dialog 
          open={uiState.isLoginModalShown} 
          onClose={() => {
            setPasswordInput('');
            setUsernameInput('');
            dispatch(_setLoginSessionExpired(false));
            dispatch(_setLoginModalShown(false));
          }}
        >
            <DialogTitle>{t(`title`)}</DialogTitle>
            <DialogContent>
                {
                uiState.isLoginSessionExpired
                ?
                <div style={{padding: '.3em'}}>
                    {t(`sessionExpiredMsg`)}
                </div>
                :
                null
                }
                <div style={{padding: '.3em'}}>
                    <TextField
                        size="small"
                        label={t(`usernameInputPlaceholder`)}
                        variant="outlined"
                        value={usernameInput}
                        onChange={e => {
                            setUsernameInput(e.target.value)
                        }}
                    />
                </div>
                <div style={{padding: '.3em'}}>
                    <TextField
                        size="small"
                        type="password"
                        label={t(`passwordInputPlaceholder`)}
                        variant="outlined"
                        value={passwordInput}
                        onChange={e => {
                            setPasswordInput(e.target.value)
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary" 
                    onClick={() => {
                        dispatch(handleLogin(
                            usernameInput,
                            passwordInput,
                            () => {
                                setPasswordInput('');
                                setUsernameInput('');
                            },
                            t(`successMsg`),
                            t(`errorMsg`)
                        ));
                    }}
                    disabled={!usernameInput || !passwordInput || userState.isLoading}
                >
                    {t(`submitBtn`)}
                </Button>
                <Button 
                    color="primary" 
                    onClick={() => {
                        setPasswordInput('');
                        setUsernameInput('')
                        dispatch(_setLoginModalShown(false));
                        dispatch(_setLoginSessionExpired(false));
                    }}
                >
                    {t(`cancelBtn`)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LoginModalDialog;