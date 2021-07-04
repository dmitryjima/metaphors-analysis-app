import React, { useState, useEffect, useRef, MutableRefObject } from 'react'

import "trix/dist/trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";


import { useTranslation } from 'react-i18next';


import { Article, MetaphorCase, MetaphorModel } from '../../api/dataModels';



import { AppBar, Button, createStyles, Dialog, Divider, IconButton, LinearProgress, List, ListItem, ListItemText, makeStyles, Menu, MenuItem, Slide, TextField, Theme, Toolbar, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/CloseOutlined'
import { TransitionProps } from '@material-ui/core/transitions/transition';
import styled from 'styled-components';
import { KeyboardDatePicker } from '@material-ui/pickers';
import AddNewMetaphorModalDialog from './addNewMetaphorCaseDialog';
import DisplayMetaphorCaseModalDialog from './displayMetaphorCaseDialog';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../app/hooks';


interface DisplayArticleDialogProps {
    article: Article,
    isOpen: boolean,
    handleClose: () => void,
    isArticlesUpdatingLoading: boolean,
    handleSetArticlesUpdatingLoading: (value: boolean) => void,
    handleUpdateArticleInState: (article: Article) => void
    updateCurrentlyDisplayedArticle: (article: Article) => void
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

    .articleAnnotatedBody {
        min-height: 300px;
    }

    @media(min-width: 769px) {
        width: 740px;

        .articleAnnotatedBody {
            min-height: 450px;
        }
    }

    .metaphorCaseSpan {
        background-color: var(--middle-blue-green);

        cursor: pointer;
        transition: .2s ease-in;

        &:hover {
            background-color: var(--medium-slate-blue);
            color: #FFF;
        }
    }
`

const tagsToIgnore = [
    `<div>`,
    `<div>`,
    `<p>`,
    `</p>`,
    `<br>`,
    `<br/>`
]

const initialMouseState = {
    mouseX: null,
    mouseY: null,
};

enum LocationEnum {
    body = 'body',
    heading ='heading'
}

const DisplayArticleDialog: React.FC<DisplayArticleDialogProps> = ({
    article,
    isOpen,
    handleClose,
    isArticlesUpdatingLoading,
    handleSetArticlesUpdatingLoading,
    handleUpdateArticleInState,
    updateCurrentlyDisplayedArticle
}) => {
    const { t, i18n, ready } = useTranslation("editionPage");
    const { user: userState } = useAppSelector(state => state);

    // View mode - view and edit
    const [viewMode, setViewMode] = useState('view');

    const classes = useStyles();

    const [articleAnnotatedBody, setArticleAnnotatedBody] = useState(article.body);
    const [articleAnnotatedHeading, setArticleAnnotatedHeading] = useState(article.heading);


    // Metaphors 
    // New metaphor case
    const [potentialMetaphorCase, setPotentialMetaphorCase] = useState<MetaphorCase | null>(null);
    const [isAddNewMetaphorDialogOpen, setIsAddNewMetaphorDialogOpen] = useState(false);

    const handleCloseAndClearAddMetaphorCaseDialog = () => {
        setIsAddNewMetaphorDialogOpen(false);
        setPotentialMetaphorCase(null);
    }

    // Display existing metaphor
    const [currentlyDisplayedMetaphorCase, setCurrentlyDisplayedMetaphorCase] = useState<MetaphorCase | null>(null);
    const [isDisplayMetaphorDialogOpen, setIsDisplayMetaphorDialogOpen] = useState(false);

    const handleCloseAndClearDisplayMetaphorCaseDialog = () => {
        setIsDisplayMetaphorDialogOpen(false);
        setCurrentlyDisplayedMetaphorCase(null);
    }

    const [mouseState, setMouseState] = React.useState<{
        mouseX: null | number;
        mouseY: null | number;
    }>(initialMouseState);

    const handleContextMenuClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        if(!potentialMetaphorCase) return 

        setMouseState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    const handleContextMenuClose = () => {
        setMouseState(initialMouseState);
    };

    const checkIfSelectionContainesMetaphorCase = (selection: Selection): boolean => {
        let contains = false;
        let foundElementsCollection = document.getElementsByClassName(`metaphorCaseSpan`);


        if (!foundElementsCollection || foundElementsCollection.length === 0) {
            return contains;
        } else {
            for (let i = 0; i < foundElementsCollection.length; i++) {
                let foundNode: Node = foundElementsCollection[i] as Node;
                if (selection.containsNode(foundNode, true)) {
                    contains = true;
                    break;
                }
            }
        }

        return contains;
    }

    const handleSelection = (selectedLocation: LocationEnum) => {
        if(!userState.isAuthenticated) return

        let selection = window.getSelection();

        let selectionText = selection?.toString();
        let selectionHTML = getSelectionHTML();
        
        if(!selection || 
            checkIfSelectionContainesMetaphorCase(selection) || 
            (selectionHTML && tagsToIgnore.some(tag => selectionHTML.includes(tag)))
        ) {
            setPotentialMetaphorCase(null);
            return
        }    
        
        let innerHTMLOriginal = selectedLocation === 'body' ? article.body!! : article.heading
        let selectionTarget = selectedLocation === 'body' ? selectionHTML!! : selectionText!!
        

        let start = innerHTMLOriginal.indexOf(selectionTarget)
        let end = 0

        if (start) {
            end = start + (selectionTarget?.length ?? 0)
        } else {
            setPotentialMetaphorCase(null);
            return
        }    

        console.log(start)
        console.log(end)

        let ranges = [];
        let start2 = 0;
        let end2 = 0;

        while(start2 !== -1) {
            start2 = innerHTMLOriginal.indexOf(selectionTarget, end2)
            if (start2 !== -1) {
                end2 = start2 + (selectionTarget?.length ?? 0)

                ranges.push([start2, end2])
            } 
        }

        console.log(ranges)

        if (ranges.length > 1) {
            toast.warning(`Duplicate text, please choose more precise range!`)
            setPotentialMetaphorCase(null);
            return
        }

        let potentialMetaphor:MetaphorCase = {
            location: selectedLocation,
            char_range: [start, end],
            text: selectionText!!,
            metaphorModel: {} as MetaphorModel,
            sourceArticleId: article._id
        }

        console.log(potentialMetaphor)

        setPotentialMetaphorCase(potentialMetaphor);
    }

    // Extract HTML from Selection Object
    const getSelectionHTML = function () {
        let userSelection;
        let range: Range
        if (window.getSelection) {

            // W3C Ranges
            userSelection = window.getSelection();
            // Get the range:
            if (userSelection?.getRangeAt)
                range = userSelection.getRangeAt(0);
            else {
                range = document.createRange();
                if (userSelection?.anchorNode && userSelection?.focusNode) {
                    range.setStart(userSelection?.anchorNode, userSelection?.anchorOffset);
                    range.setEnd(userSelection?.focusNode, userSelection?.focusOffset);
                }
            }

            // And the HTML:
            let clonedSelection = range.cloneContents();
            let div = document.createElement('div');
            div.appendChild(clonedSelection);

            let result = div.innerHTML

            if(result.substring(0, 5) === `<div>`) {
                result = result.slice(6, result.length - 7)
            }
            return result;
        } else {
            return '';
        }
    };


    // Set metaphors' interactive spans
    useEffect(() => {
        let workingBody = article.body!!;
        let workingHeading = article.heading;

        console.log(article.metaphors)

        const meLength = 83


        if (article.metaphors && article.metaphors?.length > 0) {
            let headingMetaphors = article.metaphors.filter(m => m.location === 'heading').sort((a, b) => {
                if (a.char_range[0] < b.char_range[0])
                    return -1;
                if (a.char_range[0] > b.char_range[0])
                    return 1;
                return 0
            });
            let bodyMetaphors = article.metaphors.filter(m => m.location === 'body').sort((a, b) => {
                if (a.char_range[0] < b.char_range[0])
                    return -1;
                if (a.char_range[0] > b.char_range[0])
                    return 1;
                return 0
            });

            if (bodyMetaphors && bodyMetaphors.length > 0 ) {
                let accumulator = 0
                for (let metaphor of bodyMetaphors) {
                    console.log(metaphor);
                    console.log(accumulator);
    
                    let locationText = workingBody
                    
                    locationText = [
                        locationText?.slice(0, metaphor.char_range[0] + accumulator), 
                        `<span class="metaphorCaseSpan" id="metaphorCaseId_${metaphor._id}">`,
                        locationText?.slice(metaphor.char_range[0] + accumulator, metaphor.char_range[1]  + accumulator),
                        `</span>`,
                        locationText?.slice(metaphor.char_range[1] + accumulator),
                    ].join('')
    
                    console.log(metaphor.char_range[1] - metaphor.char_range[0])
    
                    accumulator += meLength;
    
                    workingBody = locationText
                }
            }

            if (headingMetaphors && headingMetaphors.length > 0 ) {
                let accumulator = 0
                for (let metaphor of headingMetaphors) {
                    console.log(metaphor);
                    console.log(accumulator);
    
                    let locationText = workingHeading
                    
                    locationText = [
                        locationText?.slice(0, metaphor.char_range[0] + accumulator), 
                        `<span class="metaphorCaseSpan" id="metaphorCaseId_${metaphor._id}">`,
                        locationText?.slice(metaphor.char_range[0] + accumulator, metaphor.char_range[1]  + accumulator),
                        `</span>`,
                        locationText?.slice(metaphor.char_range[1] + accumulator),
                    ].join('')
    
                    console.log(metaphor.char_range[1] - metaphor.char_range[0])
    
                    accumulator += meLength;
    
                    workingHeading = locationText
                }
            }
        }


        setArticleAnnotatedBody(workingBody);
        setArticleAnnotatedHeading(workingHeading);
    }, [article]);

    return (
        <Dialog 
            fullScreen 
            open={isOpen} 
            onClose={() => {
                handleClose();
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
                        }} 
                        aria-label="close"
                        disabled={isArticlesUpdatingLoading}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {t(`dialogs.DisplayArticle.title`)}
                    </Typography>
                    {
                        userState.isAuthenticated
                        ?
                        (
                        viewMode === 'view'
                        ?
                        <Button 
                            autoFocus 
                            color="inherit" 
                            onClick={() => {
                                setViewMode('edit');
                            }}
                            disabled={isArticlesUpdatingLoading}
                        >
                            {t(`dialogs.DisplayArticle.editBtn`)}
                        </Button>
                        :
                        <Button 
                            autoFocus 
                            color="inherit" 
                            onClick={() => {

                            }}
                            disabled={isArticlesUpdatingLoading}
                        >
                            {t(`dialogs.DisplayArticle.saveBtn`)}
                        </Button>
                        )
                        :
                        null
                    }
                </Toolbar>
            </AppBar>
            {
                isArticlesUpdatingLoading
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
                        <h2
                            dangerouslySetInnerHTML={{
                                __html: articleAnnotatedHeading
                            }}
                            style={{
                                width: `100%`,
                                cursor: 'context-menu'
                            }}
                            // label={t(`dialogs.DisplayArticle.headingLabel`)}
                            // value={articleAnnotatedHeading}
                            // disabled={true}
                            // onChange={(e) => {
                                
                            // }}
                            onClick={(e) => {
                                let el = e.target as HTMLElement
                                
                                if(el?.className !== 'metaphorCaseSpan') return 

                                console.log(el)
                                let metaphorId= el.id.slice(15)
                                console.log(metaphorId)

                                let metaphorToDisplay = article.metaphors?.find(m => m._id === metaphorId);

                                if (metaphorToDisplay) {
                                    setCurrentlyDisplayedMetaphorCase(metaphorToDisplay);
                                    setIsDisplayMetaphorDialogOpen(true);
                                }
                            }}
                            onContextMenu={handleContextMenuClick} 
                            onMouseUp={() => {
                                handleSelection(LocationEnum.heading);
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
                            label={t(`dialogs.DisplayArticle.publicationDateLabel`)}
                            value={article.publication_date}
                            onChange={(date: Date | null, val) => {
                            }}
                            allowKeyboardControl
                            disabled={true}
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
                            label={t(`dialogs.DisplayArticle.urlLabel`)}
                            value={article.url}
                            disabled={true}
                            onChange={(e) => {
                            }}
                        />
                    </div>
                    </div>
                    <div
                        className="articleAnnotatedBody"
                        onContextMenu={handleContextMenuClick} 
                        style={{ cursor: 'context-menu' }}
                    >
                        <div
                            className="articleAnnotatedBody__containerDiv"
                            dangerouslySetInnerHTML={{
                                __html: articleAnnotatedBody!!
                            }}

                            onMouseUp={() => {
                                handleSelection(LocationEnum.body);
                            }}

                            onClick={(e) => {
                                let el = e.target as HTMLElement
                                
                                if(el?.className !== 'metaphorCaseSpan') return 

                                console.log(el)
                                let metaphorId= el.id.slice(15)
                                console.log(metaphorId)

                                let metaphorToDisplay = article.metaphors?.find(m => m._id === metaphorId);

                                if (metaphorToDisplay) {
                                    setCurrentlyDisplayedMetaphorCase(metaphorToDisplay);
                                    setIsDisplayMetaphorDialogOpen(true);
                                }
                            }}
                        />
                    </div>
                    <Menu
                        keepMounted
                        open={mouseState.mouseY !== null}
                        onClose={handleContextMenuClose}
                        anchorReference="anchorPosition"
                        anchorPosition={
                        mouseState.mouseY !== null && mouseState.mouseX !== null
                            ? { top: mouseState.mouseY, left: mouseState.mouseX }
                            : undefined
                        }
                    >
                        {
                            potentialMetaphorCase
                            ?
                            <MenuItem 
                                onClick={() => {
                                    handleContextMenuClose();
                                    setIsAddNewMetaphorDialogOpen(true);
                                }}
                            >
                                Add new metaphor case
                            </MenuItem>
                            :
                            null
                        }
                    </Menu>
                </FormWrapper>
            </FormContainer>
            <AddNewMetaphorModalDialog
                isOpen={isAddNewMetaphorDialogOpen}
                handleClose={handleCloseAndClearAddMetaphorCaseDialog}
                potentialMetaphorCase={potentialMetaphorCase}
                handleSetArticlesUpdatingLoading={handleSetArticlesUpdatingLoading}
                handleUpdateArticleInState={handleUpdateArticleInState}
                updateCurrentlyDisplayedArticle={updateCurrentlyDisplayedArticle}
            />
            <DisplayMetaphorCaseModalDialog
                isOpen={isDisplayMetaphorDialogOpen}
                handleClose={handleCloseAndClearDisplayMetaphorCaseDialog}
                metaphorCase={currentlyDisplayedMetaphorCase}
                handleSetArticlesUpdatingLoading={handleSetArticlesUpdatingLoading}
                handleUpdateArticleInState={handleUpdateArticleInState}
                updateCurrentlyDisplayedArticle={updateCurrentlyDisplayedArticle}
            />
        </Dialog>
    )
}

export default DisplayArticleDialog;