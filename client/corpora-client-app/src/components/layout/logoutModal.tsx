import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';


import { useTranslation } from 'react-i18next';


import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { _setLogoutModalShown } from '../../slices/uiSlice';
import { handleLogout } from '../../slices/userSlice';

const LogoutModalDialog = () => {
    const { t, i18n, ready } = useTranslation('logoutModal');

    const dispatch = useAppDispatch();
    const { user: userState, ui: uiState } = useAppSelector(state => state)

    return (
        <Dialog 
          open={uiState.isLogoutModalShown} 
          onClose={() => {
            dispatch(_setLogoutModalShown(false));
          }}
        >
            <DialogTitle>{t(`title`)}</DialogTitle>
            <DialogContent>
                <div
                    style={{
                        padding: '.3px'
                    }}
                >
                    {t(`message`)}
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary" 
                    onClick={() => {
                        dispatch(handleLogout());
                    }}
                    disabled={userState.isLoading}
                >
                    {t(`submitBtn`)}
                </Button>
                <Button 
                    color="primary" 
                    onClick={() => {
                        dispatch(_setLogoutModalShown(false));
                    }}
                >
                    {t(`cancelBtn`)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default LogoutModalDialog;