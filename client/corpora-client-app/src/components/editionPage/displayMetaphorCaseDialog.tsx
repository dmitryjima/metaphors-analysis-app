import React, { useEffect, useState } from 'react';

// Stylings
import styled from 'styled-components';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { deleteMetaphorCase, fetchAllMetaphorModels, updateMetaphorCase } from '../../api/endpoints/metaphors';
import { Article, MetaphorCase, MetaphorModel } from '../../api/dataModels';


interface DisplayMetaphorCaseModalDialogProps {
    article: Article,
    isOpen: boolean,
    handleClose: Function,
    metaphorCase?: MetaphorCase | null,
    handleUpdateDisplayedMetaphorCase: (metaphorCase: MetaphorCase) => void,
    isArticlesUpdatingLoading: boolean,
    handleSetArticlesUpdatingLoading: (value: boolean) => void,
    handleUpdateArticleInState: (article: Article) => void,
    updateCurrentlyDisplayedArticle: (article: Article) => void
}


const TextFieldReadOnly = styled(TextField)`

`

const DialogTitleWithButtons = styled(DialogTitle)`
    position: relative;
`

const TitleCTAsContainer = styled.div`
    position: absolute;

    right: 0;
    top: 0;

    .displayMetaphorCase__button {
        position: absolute;

        transition: .2s ease-in;
    }

    @media(min-width: 1024px) {
        .displayMetaphorCase__button {
            opacity: 0;
        }

        &:hover {
            .displayMetaphorCase__button {
                opacity: 1;
            }
        }
    } 
`


const DisplayMetaphorCaseModalDialog: React.FC<DisplayMetaphorCaseModalDialogProps> = ({
    article,
    isOpen,
    handleClose,
    metaphorCase,
    handleUpdateDisplayedMetaphorCase,
    isArticlesUpdatingLoading,
    handleSetArticlesUpdatingLoading,
    handleUpdateArticleInState,
    updateCurrentlyDisplayedArticle
}) => {
    const { t } = useTranslation('editionPage');
    const { user: userState } = useAppSelector(state => state);

    // View mode - view and edit
    const [viewMode, setViewMode] = useState('view');

    // Delete menu
    const [anchorElDeleteMenu, setAnchorElDeleteMenu] = React.useState<null | HTMLElement>(null);

    const handleOpenDeleteMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorElDeleteMenu(event.currentTarget);
    };
  
    const handleCloseDeleteMenu = () => {
      setAnchorElDeleteMenu(null);
    };

    const handleDeleteMetaphorCase = async () => {
        try {
            let workingArticle = {...article}

            if (metaphorCase && workingArticle.metaphors) {
                const res = await deleteMetaphorCase(article._id!!, metaphorCase._id!!);
    
                workingArticle.metaphors = workingArticle.metaphors?.filter(m => m._id !== metaphorCase._id);
    
                handleUpdateArticleInState(workingArticle);
    
                updateCurrentlyDisplayedArticle(workingArticle);

                handleCloseDeleteMenu();
                handleClose();
            }
        } catch (err) {
            console.log(err);
        }
    }

    // Metaphor models
    const [metaphorModels, setMetaphorModels] = useState<MetaphorModel[]>([]);
    const [isMetaphorModelsLoading, setIsMetaphorModelsLoading] = useState(false);

    // Updating metaphor
    const [metaphorInEdit, setMetaphorInEdit] = useState(metaphorCase ? metaphorCase : {} as MetaphorCase)
    const [dataModelValue, setDataModelValue] = useState<MetaphorModel | null>(metaphorCase?.metaphorModel ?? {} as MetaphorModel)
    const [inputDataModelValue, setDataModelInputValue] = useState('')

    const handleUpdateMetaphorCase = async () => {
        try {
            handleSetArticlesUpdatingLoading(true);

            const res = await updateMetaphorCase(
                metaphorInEdit._id!!, 
                metaphorInEdit, 
                metaphorInEdit.metaphorModel
                )

            let workingArticle = {...article}

            if (workingArticle.metaphors) {

                let metaphorIndex = workingArticle.metaphors?.findIndex(m => m._id === res._id);
    
                workingArticle.metaphors[metaphorIndex] = {...res}
    
                handleUpdateArticleInState(workingArticle);
    
                updateCurrentlyDisplayedArticle(workingArticle);

                handleUpdateDisplayedMetaphorCase(res);
            }

            if(metaphorModels.findIndex(m => m._id === res.metaphorModel._id) === -1) {
                setMetaphorModels(metaphorModels => [...metaphorModels, res.metaphorModel]);
            }
            
            setViewMode('view')
            handleSetArticlesUpdatingLoading(false);
        } catch (err) {
            handleSetArticlesUpdatingLoading(false);
            console.log(err);
        }
    }

    // Form valid state
    const [formValid, setFormValid] = useState(false)

    const validateMetaphorInEdit = (metaphorCase: MetaphorCase) => {
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

            // @ts-ignore
            let model: MetaphorModel = metaphorCase?.metaphorModel.name
            ?
            metaphorCase?.metaphorModel.name
            :
            // @ts-ignore
            metaphorModels && metaphorModels.find(model => model._id === metaphorCase.metaphorModel!!)


            setMetaphorInEdit(metaphorCase);
            setDataModelValue(model ?? {} as MetaphorModel);
        }
    }, [metaphorCase, metaphorModels]);

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
            setViewMode('view');
            handleClose();
          }}
        >
            <DialogTitleWithButtons>
                {t(`modals.displayMetaphorModal.title`)}
                {
                    userState.isAuthenticated && viewMode === 'view'
                    ?
                    <TitleCTAsContainer>
                        <IconButton
                            style={{
                                right: `3rem`,
                                top: `.5rem`
                            }}
                            color={`primary`}
                            className={`displayMetaphorCase__button`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setViewMode('edit');
                            }}
                        >
                            <EditIcon/>
                        </IconButton>
                        <IconButton
                            style={{
                                right: `.5rem`,
                                top: `.5rem`
                            }}
                            color={`secondary`}
                            className={`displayMetaphorCase__button`}
                            onClick={handleOpenDeleteMenu}
                        >
                            <DeleteIcon/>
                        </IconButton>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorElDeleteMenu}
                            keepMounted
                            open={Boolean(anchorElDeleteMenu)}
                            onClose={handleCloseDeleteMenu}
                        >
                            <MenuItem onClick={handleDeleteMetaphorCase}>
                                {t(`modals.displayMetaphorModal.confirmDeleteBtn`)}
                            </MenuItem>
                            <MenuItem onClick={handleCloseDeleteMenu}>
                                {t(`modals.displayMetaphorModal.cancelDeleteBtn`)}
                            </MenuItem>
                        </Menu>
                    </TitleCTAsContainer>
                    :
                    null
                }
            </DialogTitleWithButtons>
            {
                viewMode === 'edit'
                ?
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
                            renderInput={(params) => <TextField {...params} label={t(`modals.displayMetaphorModal.metaphorModelLabel`)} variant="outlined" /> }
                        />
                    </div>
                </DialogContent>
                :
                <DialogContent>
                    <div
                        style={{
                            padding: '.3px'
                        }}
                    >
                        <TextFieldReadOnly
                            style={{
                                width: `100%`
                            }}
                            multiline
                            rows={4}
                            variant="outlined"
                            label={t(`modals.displayMetaphorModal.textLabel`)}
                            value={metaphorCase?.text}
                        />
                    </div>
                    {
                        metaphorCase?.comment
                        ?
                        <div
                            style={{
                                padding: '.3px',
                                marginTop: '1.5rem',
                            }}
                        >
                            <TextFieldReadOnly
                                style={{
                                    width: `100%`
                                }}
                                multiline
                                rows={4}
                                variant="outlined"
                                label={t(`modals.displayMetaphorModal.commentLabel`)}
                                value={metaphorCase?.comment}
                            />
                        </div>
                        :
                        null
                    }
                    <div
                        style={{
                            padding: '.3px',
                            marginTop: '1.5rem',
                            display: `flex`
                        }}
                    >
                        <TextFieldReadOnly
                            label={t(`modals.displayMetaphorModal.metaphorModelLabel`)} 
                            variant="outlined"
                            value={
                                metaphorCase?.metaphorModel.name
                                ?
                                metaphorCase?.metaphorModel.name
                                :
                                metaphorModels && metaphorModels.find(model => model._id === metaphorCase?.metaphorModel)?.name
                            }
                            style={{
                                width: 300
                            }}
                        />
                    </div>
                </DialogContent>
            }
            <DialogActions>
            {
                viewMode === 'edit'
                ?
                <>
                <Button
                    color="primary" 
                    onClick={() => handleUpdateMetaphorCase()}
                    disabled={isArticlesUpdatingLoading || !formValid}
                >
                    {t(`modals.displayMetaphorModal.submitBtn`)}
                </Button>
                <Button 
                    color="primary" 
                    onClick={() => {
                        setViewMode('view');
                    }}
                    disabled={isArticlesUpdatingLoading}
                >
                    {t(`modals.displayMetaphorModal.cancelBtn`)}
                </Button>
                </>
                :
                null
            }
            </DialogActions>
        </Dialog>
    );
}

export default DisplayMetaphorCaseModalDialog;