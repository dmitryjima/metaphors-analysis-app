import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';


import { useTranslation } from 'react-i18next';


import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { handleDeleteEdition } from '../../slices/editionsSlice';

import { Edition } from '../../api/dataModels';


interface DeleteEditionModalDialogProps {
    isOpen: boolean,
    handleClose: Function,
    editionToDelete: Edition | null,
    handleClearEditionToDelete: Function
}

const DeleteEditionModalDialog: React.FC<DeleteEditionModalDialogProps> = ({
    isOpen,
    handleClose,
    editionToDelete,
    handleClearEditionToDelete
}) => {
    const { t, i18n, ready } = useTranslation('editionsMain');

    const dispatch = useAppDispatch();
    const { editions: editionsState } = useAppSelector(state => state)

    return (
        <Dialog 
          open={isOpen} 
          onClose={() => {
            handleClose();
            handleClearEditionToDelete()
          }}
        >
            <DialogTitle>{t(`modals.deleteEditionModal.title`)}</DialogTitle>
            <DialogContent>
                <div
                    style={{
                        padding: '.3px'
                    }}
                >
                    {t(`modals.deleteEditionModal.message`)}
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary" 
                    onClick={() => {
                        dispatch(handleDeleteEdition(
                            editionToDelete!!,
                            handleClose,
                            handleClearEditionToDelete
                        ));
                    }}
                    disabled={editionsState.removeEditionLoading}
                >
                    {t(`modals.deleteEditionModal.submitBtn`)}
                </Button>
                <Button 
                    color="primary" 
                    onClick={() => {
                        handleClose();
                        handleClearEditionToDelete()
                    }}
                    disabled={editionsState.removeEditionLoading}
                >
                    {t(`modals.deleteEditionModal.cancelBtn`)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteEditionModalDialog;