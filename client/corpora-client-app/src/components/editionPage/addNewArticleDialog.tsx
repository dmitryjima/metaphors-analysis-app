import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next';

import { Article, Edition } from '../../api/dataModels';

// Stylings
import styled from 'styled-components';
import { AppBar, Button, createStyles, Dialog, IconButton, LinearProgress, makeStyles, Slide, TextField, Theme, Toolbar, Typography } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { KeyboardDatePicker } from '@material-ui/pickers';
import CloseIcon from '@material-ui/icons/CloseOutlined'

// Trix editor
import "trix/dist/trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";

interface AddNewArticleDialogProps {
    edition: Edition,
    isOpen: boolean,
    isAddArticleLoading: boolean,
    handleClose: () => void,
    handleAddNewArticle: (article: Article, cb?: Function) => void
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const FormContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    margin-bottom: 3rem;
`

const FormWrapper = styled.div`
    width: 100%;

    background-color: #FFF;

    box-shadow: 0px 4px 10px 3px rgba(165, 148, 249, 0.3);

    padding: .5rem;
    padding-top: 2rem;

    .trixEditorCustom {
        min-height: 300px;
    }

    @media(min-width: 769px) {
        width: 740px;

        .trixEditorCustom {
            min-height: 450px;
        }
    }
`

const AddNewArticleDialog: React.FC<AddNewArticleDialogProps> = ({
    edition,
    isOpen,
    isAddArticleLoading,
    handleClose,
    handleAddNewArticle
}) => {
    const { t } = useTranslation("editionPage");

    const classes = useStyles();

    // Article in edit
    const defaultArticle: Article = {
        heading: '',
        body: '',
        fullyAnnotated: false,
        edition: edition,
        lang: edition.lang
    }
    const [articleInEdit, setArticleInEdit] = useState(defaultArticle);

    const [isValid, setIsValid] = useState(false);

    const resetArticleInEdit = () => {
        setArticleInEdit(defaultArticle);
    }

    const handleHeadingInput = (value: string) => {
        let workingObject = {...articleInEdit};
        workingObject.heading = value;
        setArticleInEdit({...workingObject});
    }

    const handleBodyInput = (value: string) => {
        let workingObject = {...articleInEdit};
        workingObject.body = value;
        setArticleInEdit({...workingObject});
    }

    const handleURLInput = (value: string) => {
        let workingObject = {...articleInEdit};
        workingObject.url = value;
        setArticleInEdit({...workingObject});
    }

    const handleDateInput = (value: Date | null) => {
        let workingObject = {...articleInEdit};
        workingObject.publication_date = value;
        setArticleInEdit({...workingObject});
    }

    useEffect(() => {
        if (
            articleInEdit.heading && 
            articleInEdit.body &&
            articleInEdit.publication_date &&
            articleInEdit.url
        ) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }, [articleInEdit])

    return (
        <Dialog 
            fullScreen 
            open={isOpen} 
            onClose={() => {
                handleClose();
                resetArticleInEdit();
            }} 
            TransitionComponent={Transition}
        >
            <AppBar className={classes.appBar}>
                <Toolbar>
                    <IconButton 
                        edge="start" 
                        color="inherit" 
                        onClick={() => {
                            handleClose();
                            resetArticleInEdit();
                        }} 
                        aria-label="close"
                        disabled={isAddArticleLoading}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {t(`dialogs.AddNewArticle.title`)}
                    </Typography>
                    <Button 
                        autoFocus 
                        color="inherit" 
                        onClick={() => {
                            handleAddNewArticle(
                                articleInEdit,
                                () => {
                                    handleClose();
                                    resetArticleInEdit();
                                }
                            )
                        }}
                        disabled={isAddArticleLoading || !isValid}
                    >
                        {t(`dialogs.AddNewArticle.saveBtn`)}
                    </Button>
                </Toolbar>
            </AppBar>
            {
                isAddArticleLoading
                ?
                <LinearProgress />
                :
                <div style={{height: `4px`}}/>
            }
            <FormContainer>
                <FormWrapper>
                    <div
                        style={{
                            paddingTop: '.3rem',
                            paddingBottom: '.3rem',
                            marginBottom: '2rem'
                        }}
                    >
                        <TextField
                            style={{
                                width: `100%`
                            }}
                            label={t(`dialogs.AddNewArticle.headingLabel`)}
                            value={articleInEdit.heading}
                            disabled={isAddArticleLoading}
                            onChange={(e) => {
                                handleHeadingInput(e.target.value)
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: `flex`,
                            justifyContent: `space-between`,
                            alignItems: `center`
                        }}
                    >
                    <div
                        style={{
                            paddingTop: '.3rem',
                            paddingBottom: '.3rem',
                            marginBottom: '2rem',
                            width: `50%`
                        }}
                    >
                        <KeyboardDatePicker
                            disableToolbar
                            variant="inline"
                            format="dd/MM/yyyy"
                            margin="normal"
                            id="date-picker-inline"
                            label={t(`dialogs.AddNewArticle.publicationDateLabel`)}
                            value={articleInEdit.publication_date}
                            onChange={(date: Date | null, val) => {
                                handleDateInput(date);
                            }}
                            allowKeyboardControl
                            disabled={isAddArticleLoading}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            
                        />
                    </div>
                    <div
                        style={{
                            paddingTop: '.7rem',
                            paddingBottom: '.3rem',
                            marginBottom: '2rem',
                            width: `45%`
                        }}
                    >
                        <TextField
                            style={{
                                width: `100%`
                            }}
                            label={t(`dialogs.AddNewArticle.urlLabel`)}
                            value={articleInEdit.url}
                            disabled={isAddArticleLoading}
                            onChange={(e) => {
                                handleURLInput(e.target.value)
                            }}
                        />
                    </div>
                    </div>
                    <TrixEditor 
                        className="trixEditorCustom"
                        mergeTags={[]}
                        value={articleInEdit.body}
                        onChange={(html, text) => {
                            handleBodyInput(html);
                        }}
                    />
                </FormWrapper>
            </FormContainer>
        </Dialog>
    )
}

export default AddNewArticleDialog;