import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@material-ui/core';


import { useTranslation } from 'react-i18next';


import { useAppDispatch, useAppSelector } from '../../app/hooks';


import { Edition } from '../../api/dataModels';
import { handleAddNewEdition } from '../../slices/editionsSlice';


interface AddEditionModalDialogProps {
    isOpen: boolean,
    handleClose: Function
}

const defaultEditionInEdit: Edition = {
    name: '',
    lang: 'en',
}

const languagesOptions = [
    'en',
    'ru',
    'zh'
]

const AddEditionModalDialog: React.FC<AddEditionModalDialogProps> = ({
    isOpen,
    handleClose
}) => {
    const { t, i18n, ready } = useTranslation('editionsMain');

    const dispatch = useAppDispatch();
    const { editions: editionsState } = useAppSelector(state => state)

    // Adding new edition
    const [editionInEdit, setEditionInEdit] = useState(defaultEditionInEdit)

    const handleInput = (key: keyof Edition, value: any) => {
        let workingObject = {...editionInEdit};
        workingObject[key] = value;
        setEditionInEdit({...workingObject});
    }

    const handleClearEditionToAdd = () => {
        setEditionInEdit(defaultEditionInEdit);
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
        validateEditionInEdit(editionInEdit)
    }, [editionInEdit]);

    return (
        <Dialog 
          style={{
            width: `100%`
          }}
          open={isOpen} 
          onClose={() => {
            handleClose();
            handleClearEditionToAdd()
          }}
        >
            <DialogTitle>{t(`modals.addEditionModal.title`)}</DialogTitle>
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
                        label={t(`modals.addEditionModal.nameLabel`)}
                        value={editionInEdit.name}
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
                        label={t(`modals.addEditionModal.languageLabel`)}
                        value={editionInEdit.lang}
                        onChange={(e) => {
                            handleInput('lang', e.target.value);
                        }}
                        helperText={t(`modals.addEditionModal.languageHelperText`)}
                        variant="outlined"
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
                        label={t(`modals.addEditionModal.descriptionLabel`)}
                        value={editionInEdit.description}
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
                        dispatch(handleAddNewEdition(
                            editionInEdit,
                            handleClose,
                            handleClearEditionToAdd
                        ));
                    }}
                    disabled={editionsState.addNewEditionLoading || !formValid}
                >
                    {t(`modals.addEditionModal.submitBtn`)}
                </Button>
                <Button 
                    color="primary" 
                    onClick={() => {
                        handleClose();
                        handleClearEditionToAdd()
                    }}
                    disabled={editionsState.addNewEditionLoading}
                >
                    {t(`modals.addEditionModal.cancelBtn`)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddEditionModalDialog;