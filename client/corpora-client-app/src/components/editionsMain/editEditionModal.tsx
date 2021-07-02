import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@material-ui/core';


import { useTranslation } from 'react-i18next';


import { useAppDispatch, useAppSelector } from '../../app/hooks';


import { Edition } from '../../api/dataModels';
import { handleUpdateEdition } from '../../slices/editionsSlice';


interface UpdateEditionModalDialogProps {
    isOpen: boolean,
    handleClose: Function,
    editionToUpdate: Edition | null,
    handleSetEditionToUpdate: Function
}


const languagesOptions = [
    'en',
    'ru',
    'zh'
]

const UpdateEditionModalDialog: React.FC<UpdateEditionModalDialogProps> = ({
    isOpen,    
    handleClose,
    editionToUpdate,
    handleSetEditionToUpdate
}) => {
    const { t, i18n, ready } = useTranslation('editionsMain');

    const dispatch = useAppDispatch();
    const { editions: editionsState } = useAppSelector(state => state)

    const handleInput = (key: keyof Edition, value: any) => {
        let workingObject = {...editionToUpdate};
        workingObject[key] = value;
        handleSetEditionToUpdate({...workingObject});
    }

    const handleClearEditionToUpdate = () => {
        handleSetEditionToUpdate(null);
    }

    // Form valid state
    const [formValid, setFormValid] = useState(false)

    const validateEditionInEdit = (edition: Edition) => {
        if(!edition.name || !edition.lang) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }

    useEffect(() => {
        if(editionToUpdate !== null) {
            validateEditionInEdit(editionToUpdate)
        }
    }, [editionToUpdate]);

    return (
        <Dialog 
          style={{
            width: `100%`
          }}
          open={isOpen} 
          onClose={() => {
            handleClose();
            handleClearEditionToUpdate()
          }}
        >
            <DialogTitle>{t(`modals.updateEditionModal.title`)}</DialogTitle>
            <DialogContent>
                <div
                    style={{
                        padding: '.3px'
                    }}
                >
                    <TextField
                        style={{
                            width: `100%`
                        }}
                        label={t(`modals.updateEditionModal.nameLabel`)}
                        value={editionToUpdate?.name}
                        onChange={(e) => {
                            handleInput('name', e.target.value)
                        }}
                    />
                </div>
                <div
                    style={{
                        padding: '.3px',
                        marginTop: '1.5rem',
                        display: `flex`
                    }}
                >
                    <TextField
                        style={{
                            width: `100%`
                        }}
                        select
                        label={t(`modals.updateEditionModal.languageLabel`)}
                        value={editionToUpdate?.lang}
                        onChange={(e) => {
                            handleInput('lang', e.target.value);
                        }}
                        helperText={t(`modals.updateEditionModal.languageHelperText`)}
                        variant="outlined"
                        disabled={true}
                        >
                        {languagesOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {t(`languages.${option}`)}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>
                <div
                    style={{
                        padding: '.3px',
                        marginTop: '1rem',
                        display: `flex`
                    }}
                >
                    <TextField
                        style={{
                            width: `100%`
                        }}
                        label={t(`modals.updateEditionModal.descriptionLabel`)}
                        value={editionToUpdate?.description}
                        multiline
                        variant="outlined"
                        rows={4}
                        onChange={(e) => {
                            handleInput('description', e.target.value)
                        }}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary" 
                    onClick={() => {
                        dispatch(handleUpdateEdition(
                            editionToUpdate!!,
                            handleClose,
                            handleClearEditionToUpdate
                        ));
                    }}
                    disabled={editionsState.addNewEditionLoading || !formValid}
                >
                    {t(`modals.updateEditionModal.submitBtn`)}
                </Button>
                <Button 
                    color="primary" 
                    onClick={() => {
                        handleClose();
                        handleClearEditionToUpdate()
                    }}
                    disabled={editionsState.addNewEditionLoading}
                >
                    {t(`modals.updateEditionModal.cancelBtn`)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateEditionModalDialog;