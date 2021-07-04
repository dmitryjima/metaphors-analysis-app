import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useTranslation } from 'react-i18next';


import { useAppDispatch, useAppSelector } from '../../app/hooks';


import { Article, Edition, MetaphorCase, MetaphorModel } from '../../api/dataModels';
import { handleAddNewEdition } from '../../slices/editionsSlice';
import { createNewMetaphorCase, fetchAllMetaphorModels } from '../../api/endpoints/metaphors';


interface DisplayMetaphorCaseModalDialogProps {
    isOpen: boolean,
    handleClose: Function,
    metaphorCase?: MetaphorCase | null,
    handleSetArticlesUpdatingLoading: (value: boolean) => void,
    handleUpdateArticleInState: (article: Article) => void,
    updateCurrentlyDisplayedArticle: (article: Article) => void
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

const DisplayMetaphorCaseModalDialog: React.FC<DisplayMetaphorCaseModalDialogProps> = ({
    isOpen,
    handleClose,
    metaphorCase,
    handleSetArticlesUpdatingLoading,
    handleUpdateArticleInState,
    updateCurrentlyDisplayedArticle
}) => {
    const { t, i18n, ready } = useTranslation('editionPage');
    const { user: userState } = useAppSelector(state => state);

    // View mode - view and edit
    const [viewMode, setViewMode] = useState('view');

    // Metaphor models
    const [metaphorModels, setMetaphorModels] = useState<MetaphorModel[]>([]);
    const [isMetaphorModelsLoading, setIsMetaphorModelsLoading] = useState(false);

    const dispatch = useAppDispatch();
    const { editions: editionsState } = useAppSelector(state => state)

    // Adding new edition
    const [metaphorInEdit, setMetaphorInEdit] = useState(metaphorCase ? metaphorCase : {} as MetaphorCase)
    const [dataModelValue, setDataModelValue] = useState<MetaphorModel | null>({} as MetaphorModel)
    const [inputDataModelValue, setDataModelInputValue] = useState('')

    const handleDisplayMetaphorCaseCase = async () => {
        try {
            handleSetArticlesUpdatingLoading(true);

            const res = await createNewMetaphorCase(
                metaphorInEdit.sourceArticleId!!, 
                metaphorInEdit, 
                metaphorInEdit.metaphorModel
                )

            console.log(res);

            handleUpdateArticleInState(res.updatedArticle);

            updateCurrentlyDisplayedArticle(res.updatedArticle);

            if(metaphorModels.findIndex(m => m._id === res.metaphorModel._id) === -1) {
                setMetaphorModels(metaphorModels => [...metaphorModels, res.metaphorModel]);
            }

            handleClose();
            handleSetArticlesUpdatingLoading(false);
        } catch (err) {
            handleSetArticlesUpdatingLoading(false);
            console.log(err);
        }
    }

    // Form valid state
    const [formValid, setFormValid] = useState(false)

    const validateEditionInEdit = (metaphorCase: MetaphorCase) => {
        if(!metaphorInEdit?.text) {
            setFormValid(false)
        } else {
            setFormValid(true)
        }
    }


    // Fetch metaphor models
    useEffect(() => {
        async function fetchModels() {
            try {
                setIsMetaphorModelsLoading(true);

                const models = await fetchAllMetaphorModels();

                setMetaphorModels(metaphorModels => [...models]);

                setIsMetaphorModelsLoading(false);
            } catch (err) {
                setIsMetaphorModelsLoading(false);
                console.log(err);
            }
        }

        fetchModels();
    }, []);

    useEffect(() => {
        if(metaphorCase) {
            setMetaphorInEdit(metaphorCase)
        }
    }, [metaphorCase]);

    useEffect(() => {
        console.log(dataModelValue)
        console.log(inputDataModelValue)


        

    }, [inputDataModelValue, dataModelValue])

    useEffect(() => {
        validateEditionInEdit(metaphorInEdit)
    }, [metaphorInEdit]);

    return (
        <Dialog 
          style={{
            width: `100%`
          }}
          open={isOpen} 
          onClose={() => {
            handleClose();
          }}
        >
            <DialogTitle>{t(`modals.displayMetaphorModal.title`)}</DialogTitle>
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
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t(`modals.displayMetaphorModal.textLabel`)}
                        value={metaphorInEdit.text}
                        onChange={(e) => {
                            let workingObject = {...metaphorInEdit}
                            workingObject.text = e.target.value;
                            setMetaphorInEdit({...workingObject});
                        }}
                    />
                </div>
                <div
                    style={{
                        padding: '.3px',
                        marginTop: '1.5rem',
                    }}
                >
                    <TextField
                        style={{
                            width: `100%`
                        }}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t(`modals.displayMetaphorModal.commentLabel`)}
                        value={metaphorInEdit.comment}
                        onChange={(e) => {
                            let workingObject = {...metaphorInEdit}
                            workingObject.comment = e.target.value;
                            setMetaphorInEdit({...workingObject});
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
                    <Autocomplete
                        options={metaphorModels}
                        getOptionLabel={(option) => option.name}
                        style={{ width: 300 }}
                        value={metaphorCase?.metaphorModel}
                        clearOnBlur={false}
                        onChange={(event: any, newValue) => {
                            setDataModelValue(newValue);

                            if (newValue) {
                                let workingObject = {...metaphorInEdit}
                                workingObject.metaphorModel = newValue;
                                setMetaphorInEdit({...workingObject});
                            }
                        }}
                        inputValue={inputDataModelValue}
                        onInputChange={(event, newInputValue) => {
                            setDataModelInputValue(newInputValue);

                            if (newInputValue !== metaphorInEdit.metaphorModel.name) {
                                let newMetaphorModel: MetaphorModel = {
                                    name: newInputValue
                                }
                                let workingObject = {...metaphorInEdit}
                                workingObject.metaphorModel = newMetaphorModel
                                setMetaphorInEdit({...workingObject});
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label={t(`modals.displayMetaphorModal.metaphorModelLabel`)} variant="outlined" /> }
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary" 
                    onClick={() => handleDisplayMetaphorCaseCase()}
                    disabled={editionsState.addNewEditionLoading || !formValid}
                >
                    {t(`modals.displayMetaphorModal.submitBtn`)}
                </Button>
                <Button 
                    color="primary" 
                    onClick={() => {
                        handleClose();
                    }}
                    disabled={editionsState.addNewEditionLoading}
                >
                    {t(`modals.displayMetaphorModal.cancelBtn`)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DisplayMetaphorCaseModalDialog;