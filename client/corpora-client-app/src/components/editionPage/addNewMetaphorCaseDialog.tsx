import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { createNewMetaphorCase, fetchAllMetaphorModels } from '../../api/endpoints/metaphors';
import { Article, MetaphorCase, MetaphorModel } from '../../api/dataModels';


import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface AddNewMetaphorModalDialogProps {
    isOpen: boolean,
    handleClose: Function,
    potentialMetaphorCase?: MetaphorCase | null,
    isArticlesUpdatingLoading: boolean,
    handleSetArticlesUpdatingLoading: (value: boolean) => void,
    handleUpdateArticleInState: (article: Article) => void,
    updateCurrentlyDisplayedArticle: (article: Article) => void
}


const AddNewMetaphorModalDialog: React.FC<AddNewMetaphorModalDialogProps> = ({
    isOpen,
    handleClose,
    potentialMetaphorCase,
    isArticlesUpdatingLoading,
    handleSetArticlesUpdatingLoading,
    handleUpdateArticleInState,
    updateCurrentlyDisplayedArticle
}) => {
    const { t } = useTranslation('editionPage');

    // Metaphor models
    const [metaphorModels, setMetaphorModels] = useState<MetaphorModel[]>([]);
    const [isMetaphorModelsLoading, setIsMetaphorModelsLoading] = useState(false);

    // Adding new metaphor
    const [metaphorInEdit, setMetaphorInEdit] = useState(potentialMetaphorCase ? potentialMetaphorCase : {} as MetaphorCase)
    const [dataModelValue, setDataModelValue] = useState<MetaphorModel | null>({} as MetaphorModel)
    const [inputDataModelValue, setDataModelInputValue] = useState('')

    const handleAddNewMetaphorCase = async () => {
        try {
            handleSetArticlesUpdatingLoading(true);

            const res = await createNewMetaphorCase(
                metaphorInEdit.sourceArticleId!!, 
                metaphorInEdit, 
                metaphorInEdit.metaphorModel
            )

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

    const validateMetaphorInEdit = (metaphorCase: MetaphorCase) => {
        if(metaphorInEdit?.text && metaphorInEdit.metaphorModel) {
            setFormValid(true)
        } else {
            setFormValid(false)
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
        if(potentialMetaphorCase) {
            setMetaphorInEdit(potentialMetaphorCase)
        }
    }, [potentialMetaphorCase]);

    useEffect(() => {
        validateMetaphorInEdit(metaphorInEdit)
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
            <DialogTitle>{t(`modals.addMetaphorModal.title`)} <br/> ({t(`modals.addMetaphorModal.${metaphorInEdit.location}`)})</DialogTitle>
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
                        label={t(`modals.addMetaphorModal.textLabel`)}
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
                        label={t(`modals.addMetaphorModal.commentLabel`)}
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
                        value={dataModelValue}
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
                        renderInput={(params) => <TextField {...params} label={t(`modals.addMetaphorModal.metaphorModelLabel`)} variant="outlined" /> }
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary" 
                    onClick={() => handleAddNewMetaphorCase()}
                    disabled={isArticlesUpdatingLoading || !formValid}
                >
                    {t(`modals.addMetaphorModal.submitBtn`)}
                </Button>
                <Button 
                    color="primary" 
                    onClick={() => {
                        handleClose();
                    }}
                    disabled={isArticlesUpdatingLoading}
                >
                    {t(`modals.addMetaphorModal.cancelBtn`)}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddNewMetaphorModalDialog;