import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';


import { useTranslation } from 'react-i18next';


import { Article } from '../../api/dataModels';


interface DeleteArticleModalDialogProps {
    isOpen: boolean,
    removeArticleLoading: boolean,
    handleClose: Function,
    articleToDelete: Article | null,
    handleClearArticleToDelete: Function,
    handleDeleteArticle: Function
}

const DeleteArticleModalDialog: React.FC<DeleteArticleModalDialogProps> = ({
    isOpen,
    removeArticleLoading,
    handleClose,
    articleToDelete,
    handleClearArticleToDelete,
    handleDeleteArticle
}) => {
    const { t, i18n, ready } = useTranslation('editionPage');

    return (
        <Dialog 
          open={isOpen} 
          onClose={() => {
            handleClose();
            handleClearArticleToDelete()
          }}
        >
            <DialogTitle>{t(`dialogs.deleteArticleModal.title`)}</DialogTitle>
            <DialogContent>
                <div
                    style={{
                        padding: '.3px'
                    }}
                >
                    {t(`dialogs.deleteArticleModal.message`)}
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary" 
                    onClick={() => {
                        handleDeleteArticle(
                            articleToDelete!!,
                            handleClose,
                            handleClearArticleToDelete
                        )
                    }}
                    disabled={removeArticleLoading}
                >
                    {t(`dialogs.deleteArticleModal.submitBtn`)}
                </Button>
                <Button 
                    color="primary" 
                    onClick={() => {
                        handleClose();
                        handleClearArticleToDelete()
                    }}
                    disabled={removeArticleLoading}
                >
                    {t(`dialogs.deleteArticleModal.cancelBtn`)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteArticleModalDialog;