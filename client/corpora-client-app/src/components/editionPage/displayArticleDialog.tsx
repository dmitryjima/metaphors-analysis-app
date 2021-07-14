import React, { useState, useEffect } from 'react'

// State & handlers
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../app/hooks';
import { updateArticleBody, updateArticleComment, updateArticleTone } from '../../api/endpoints/articles';
import { Article, Edition, MetaphorCase, MetaphorModel } from '../../api/dataModels';


// Trix editor
import "trix/dist/trix";
import "trix/dist/trix.css";
import { TrixEditor } from "react-trix";


// Stylings
import styled from 'styled-components';
import { AppBar, Button, createStyles, Dialog, Fab, IconButton, LinearProgress, makeStyles, Menu, MenuItem, Slide, TextField, Theme, Toolbar, Typography } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import { KeyboardDatePicker } from '@material-ui/pickers';
import Zoom from '@material-ui/core/Zoom';
import CloseIcon from '@material-ui/icons/CloseOutlined'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from '@material-ui/icons/Cancel';

// Components
import AddNewMetaphorModalDialog from './addNewMetaphorCaseDialog';
import DisplayMetaphorCaseModalDialog from './displayMetaphorCaseDialog';


// Toasts
import { toast } from 'react-toastify';

// Utils
import useWindowSize from '../../utils/useWindowResize';
import { articleToneColorSwitch } from './articleRow';


interface DisplayArticleDialogProps {
    article: Article,
    edition: Edition,
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

const ToolBox = styled.div`
    display: flex;
    flex-wrap: wrap;

    padding-left: 1rem;
    padding-right: 1rem;

    margin-bottom: 3rem;


    @media(min-width: 1325px) {
        position: fixed;
        right: 1rem;
        top: 6rem;

        width: calc(50vw - 400px);

        padding: initial;
        margin: initial;
    } 
`

interface ArticleToneMarkerProps {
    bgColor: string
}


const ArticleToneMarker = styled.div<ArticleToneMarkerProps>`
    height: 32px;
    width: 32px;
    border-radius: 50%;
    border-width: 4px;
    border-style: solid;
    border: transparent;

    background-color: ${
        props => (
            props.bgColor
        )
    };
`

const SelectToneWidgetStyled = styled.div`
    display: flex;
    justify-content: space-around;
`

interface ArticleToneMarkerSelectProps {
    bgColor: string,
    isSelected: boolean
}


const ArticleToneMarkerSelect = styled.div<ArticleToneMarkerSelectProps>`
    height: 32px;
    width: 32px;
    border-radius: 50%;

    border-width: 4px;
    border-style: solid;

    transition: .2s ease-in-out;
    cursor: pointer;

    background-color: ${
        props => (
            props.bgColor
        )
    };
    border-color: ${
        props => (
            props.isSelected ? `#a594f9` : `transparent`
        )
    };
`
interface SelectToneWidgetProps {
    article: Article,
    isLoading: boolean,
    handleUpdateArticleTone: (tone: string) => void
}

const SelectToneWidget: React.FC<SelectToneWidgetProps> = ({
    article,
    isLoading,
    handleUpdateArticleTone
}) => {
    const options = [
        'positive',
        'negative',
        'neutral'
    ]

    return (
        <SelectToneWidgetStyled>
            {
                options.map(o => (
                    <ArticleToneMarkerSelect
                        bgColor={articleToneColorSwitch(o)}
                        isSelected={article.tone === o}
                        onClick={() => {
                            if (isLoading) return
                            handleUpdateArticleTone(o)
                        }}
                    />
                ))
            }
        </SelectToneWidgetStyled>
    )
}


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
    edition,
    isOpen,
    handleClose,
    isArticlesUpdatingLoading,
    handleSetArticlesUpdatingLoading,
    handleUpdateArticleInState,
    updateCurrentlyDisplayedArticle
}) => {
    const { t } = useTranslation("editionPage");
    const { user: userState } = useAppSelector(state => state);
    const classes = useStyles();

    const { width } = useWindowSize()

    // View mode - view and edit
    const [viewMode, setViewMode] = useState('view');
    const [articleInEdit, setArticleInEdit] = useState(article);

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

    const handleUpdateArticleBody = async (articleToUpdate: Article) => {
        try {
            handleSetArticlesUpdatingLoading(true);

            let res = await updateArticleBody(articleToUpdate);
            
            setArticleInEdit(res)
            handleUpdateArticleInState(res);
            updateCurrentlyDisplayedArticle(res);

            handleSetArticlesUpdatingLoading(false);

            setViewMode('view');
        } catch (err) {
            handleSetArticlesUpdatingLoading(false);
            console.log(err);
        }
    }

    const handleUpdateArticleTone = async (newTone: string) => {
        try {
            handleSetArticlesUpdatingLoading(true);

            let res = await updateArticleTone(
                article._id!!,
                newTone
            );

            handleUpdateArticleInState(res);
            updateCurrentlyDisplayedArticle(res);
            
            handleSetArticlesUpdatingLoading(false);
        } catch (err) {
            handleSetArticlesUpdatingLoading(false);
            console.log(err);
        }
    }

    const [commentInEdit, setCommentInEdit] = useState(article.comment);
    const [isCommentEdited, setCommentEdited] = useState(false);

    const handleUpdateArticleComment = async (comment: string) => {
        try {
            handleSetArticlesUpdatingLoading(true);

            let res = await updateArticleComment(
                article._id!!,
                comment
            );

            handleUpdateArticleInState(res);
            updateCurrentlyDisplayedArticle(res);

            setCommentEdited(false);
            setCommentInEdit(comment);
            
            handleSetArticlesUpdatingLoading(false);
        } catch (err) {
            handleSetArticlesUpdatingLoading(false);
            console.log(err);
        }
    }

    // Annotations
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

    const handleUpdateDisplayedMetaphorCase = (metaphor: MetaphorCase) => {
        setCurrentlyDisplayedMetaphorCase({...metaphor});
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

        let ranges = [];
        let start2 = 0;
        let end2 = 0;

        while(start2 !== -1) {
            start2 = innerHTMLOriginal.indexOf(selectionTarget, end2)
            if (start2 !== -1) {
                end2 = start2 + (selectionTarget?.length ?? 0)

                ranges.push([start2, end2])

                if(ranges.length > 1) break;
            } 
        }

        if (ranges.length > 1) {
            toast.warning(t(`dialogs.DisplayArticle.duplicateWarning`))
            setPotentialMetaphorCase(null);
            return
        }

        let potentialMetaphor:MetaphorCase = {
            location: selectedLocation,
            char_range: [start, end],
            text: selectionText!!,
            metaphorModel: {} as MetaphorModel,
            sourceArticleId: article._id,
            sourceEditionId: edition._id,
            sourceEditionName: edition.name,
            lang: edition.lang
        }

        setPotentialMetaphorCase(potentialMetaphor);
    }

    // Extract HTML from Selection Object
    const getSelectionHTML = function () {
        let userSelection;
        let range: Range
        if (window.getSelection) {

            userSelection = window.getSelection();
            // Get the range
            if (userSelection?.getRangeAt)
                range = userSelection.getRangeAt(0);
            else {
                range = document.createRange();
                if (userSelection?.anchorNode && userSelection?.focusNode) {
                    range.setStart(userSelection?.anchorNode, userSelection?.anchorOffset);
                    range.setEnd(userSelection?.focusNode, userSelection?.focusOffset);
                }
            }

            // Get HTML
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
                    let locationText = workingBody
                    
                    locationText = [
                        locationText?.slice(0, metaphor.char_range[0] + accumulator), 
                        `<span class="metaphorCaseSpan" id="metaphorCaseId_${metaphor._id}">`,
                        locationText?.slice(metaphor.char_range[0] + accumulator, metaphor.char_range[1]  + accumulator),
                        `</span>`,
                        locationText?.slice(metaphor.char_range[1] + accumulator),
                    ].join('')
    
                    accumulator += meLength;
    
                    workingBody = locationText
                }
            }

            if (headingMetaphors && headingMetaphors.length > 0 ) {
                let accumulator = 0
                for (let metaphor of headingMetaphors) {   
                    let locationText = workingHeading
                    
                    locationText = [
                        locationText?.slice(0, metaphor.char_range[0] + accumulator), 
                        `<span class="metaphorCaseSpan" id="metaphorCaseId_${metaphor._id}">`,
                        locationText?.slice(metaphor.char_range[0] + accumulator, metaphor.char_range[1]  + accumulator),
                        `</span>`,
                        locationText?.slice(metaphor.char_range[1] + accumulator),
                    ].join('')
    
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
                setViewMode('view');
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
                            setViewMode('view');
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
                                let workingObject = {...article}
                                setArticleInEdit(workingObject);
                            }}
                            disabled={isArticlesUpdatingLoading}
                        >
                            {t(`dialogs.DisplayArticle.editBtn`)}
                        </Button>
                        :
                        <>
                        <Button 
                            autoFocus 
                            color="inherit" 
                            onClick={() => {
                                handleUpdateArticleBody(articleInEdit);
                            }}
                            disabled={isArticlesUpdatingLoading}
                        >
                            {t(`dialogs.DisplayArticle.saveBtn`)}
                        </Button>
                        <Button 
                            autoFocus 
                            color="inherit" 
                            onClick={() => {
                                setViewMode('view');
                                let workingObject = {...article}
                                setArticleInEdit(workingObject);
                            }}
                            disabled={isArticlesUpdatingLoading}
                        >
                            {t(`dialogs.DisplayArticle.cancelBtn`)}
                        </Button>
                        </>
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
                {
                viewMode === 'edit' && userState.isAuthenticated
                ?
                <FormWrapper>
                    <div
                        style={{
                            paddingTop: '.3rem',
                            paddingBottom: '.3rem',
                            marginBottom: '2rem'
                        }}
                    >
                        {
                        article.metaphors && article.metaphors.length > 0
                        ?
                        <h2
                            dangerouslySetInnerHTML={{
                                __html: article.heading
                            }}
                        />
                        :
                        <TextField
                            style={{
                                width: `100%`
                            }}
                            label={t(`dialogs.AddNewArticle.headingLabel`)}
                            value={articleInEdit.heading}
                            disabled={isArticlesUpdatingLoading}
                            onChange={(e) => {
                                handleHeadingInput(e.target.value)
                            }}
                        />
                        }
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
                            disabled={isArticlesUpdatingLoading}
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
                            disabled={isArticlesUpdatingLoading}
                            onChange={(e) => {
                                handleURLInput(e.target.value)
                            }}
                        />
                    </div>
                    </div>
                    {
                        article.metaphors && article.metaphors.length > 0
                        ?
                        <div
                        className="articleAnnotatedBody"
                        >
                            <div
                                className="articleAnnotatedBody__containerDiv"
                                dangerouslySetInnerHTML={{
                                    __html: article.body!!
                                }}
                            />
                        </div>
                        :
                        <TrixEditor 
                            className="trixEditorCustom"
                            mergeTags={[]}
                            value={articleInEdit.body}
                            onChange={(html, text) => {
                                handleBodyInput(html);
                            }}
                        />
                    }
                </FormWrapper>
                :
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
                            onClick={(e) => {
                                let el = e.target as HTMLElement
                                
                                if(el?.className !== 'metaphorCaseSpan') return 

                                let metaphorId= el.id.slice(15)

                                let metaphorToDisplay = article.metaphors?.find(m => m._id === metaphorId);

                                if (metaphorToDisplay) {
                                    setCurrentlyDisplayedMetaphorCase(metaphorToDisplay);
                                    setIsDisplayMetaphorDialogOpen(true);
                                }
                            }}
                            onContextMenu={handleContextMenuClick} 
                            onPointerUp={() => {
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
                            readOnly={true}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            
                        />
                    </div>
                    <div
                        style={{
                            paddingTop: '2.75rem',
                            paddingBottom: '.3rem',
                            marginBottom: '2rem',
                            width: `45%`
                        }}
                    >
                        <a
                            target="blank"
                            href={article.url}
                        >
                            {article.url && article.url.length > 20 ? `${article.url.substr(0, 17)}...` : article.url}
                        </a>
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

                            onPointerUp={() => {
                                handleSelection(LocationEnum.body);
                            }}

                            onClick={(e) => {
                                let el = e.target as HTMLElement
                                
                                if (el?.className !== 'metaphorCaseSpan') return 

                                let metaphorId= el.id.slice(15)

                                let metaphorToDisplay = article.metaphors?.find(m => m._id === metaphorId);

                                if (metaphorToDisplay) {
                                    setCurrentlyDisplayedMetaphorCase(metaphorToDisplay);
                                    setIsDisplayMetaphorDialogOpen(true);
                                }
                            }}
                        />
                    </div>
                    {
                        article.metaphors && article.metaphors.length > 0 
                        ?
                        <h3>
                            {t(`dialogs.DisplayArticle.listOfMetaphors`)}
                        </h3>
                        :
                        null
                    }
                    {
                        article.metaphors && article.metaphors.map((m, i) => (
                            <div
                                key={m._id}
                                style={{
                                    marginBottom: '.5rem',
                                    cursor: `pointer`,
                                    textIndent: `.5rem`
                                }}
                                onClick={() => {
                                    let metaphorToDisplay = article.metaphors?.find(item => m._id === item._id);

                                    if (metaphorToDisplay) {
                                        setCurrentlyDisplayedMetaphorCase(metaphorToDisplay);
                                        setIsDisplayMetaphorDialogOpen(true);
                                    }
                                }}
                            >
                                <strong
                                    style={{
                                        marginRight: `1rem`
                                    }}
                                >
                                    {i + 1})
                                </strong>
                                <span>
                                    {m.text}
                                </span>
                            </div>
                        ))
                    }
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
                                {t(`dialogs.DisplayArticle.addNewMetaphorCasePopUp`)}
                            </MenuItem>
                            :
                            null
                        }
                    </Menu>
                </FormWrapper>
                }
            </FormContainer>
            <AddNewMetaphorModalDialog
                isOpen={isAddNewMetaphorDialogOpen}
                handleClose={handleCloseAndClearAddMetaphorCaseDialog}
                potentialMetaphorCase={potentialMetaphorCase}
                isArticlesUpdatingLoading={isArticlesUpdatingLoading}
                handleSetArticlesUpdatingLoading={handleSetArticlesUpdatingLoading}
                handleUpdateArticleInState={handleUpdateArticleInState}
                updateCurrentlyDisplayedArticle={updateCurrentlyDisplayedArticle}
            />
            <DisplayMetaphorCaseModalDialog
                article={article}
                isOpen={isDisplayMetaphorDialogOpen}
                handleClose={handleCloseAndClearDisplayMetaphorCaseDialog}
                metaphorCase={currentlyDisplayedMetaphorCase}
                handleUpdateDisplayedMetaphorCase={handleUpdateDisplayedMetaphorCase}
                isArticlesUpdatingLoading={isArticlesUpdatingLoading}
                handleSetArticlesUpdatingLoading={handleSetArticlesUpdatingLoading}
                handleUpdateArticleInState={handleUpdateArticleInState}
                updateCurrentlyDisplayedArticle={updateCurrentlyDisplayedArticle}
            />
            {
                width < 1024
                ?
                <Zoom
                    in={potentialMetaphorCase !== null}
                    timeout={200}
                    style={{
                    transitionDelay: `100ms`,
                    }}
                >
                    <Fab 
                        style={{
                            position: `fixed`,
                            right: `.5rem`,
                            bottom: `.5rem`
                        }}
                        size="small" 
                        color="secondary" 
                        aria-label="add metaphor case" 
                        onClick={() => {
                            handleContextMenuClose();
                            setIsAddNewMetaphorDialogOpen(true);
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Zoom>
                :
                null
            }
            <ToolBox>
                <div
                    style={{
                        width: `100%`,
                        height: `7rem`
                    }}
                >
                    <h3
                        style={{
                            textAlign: `center`
                        }}
                    >
                        {t(`toolBox.toneLabel`)}
                    </h3>
                    {
                        !userState.isAuthenticated
                        ?
                        <div
                            style={{
                                display: `flex`,
                                justifyContent: `center`
                            }}
                        >
                            <ArticleToneMarker
                                bgColor={articleToneColorSwitch(article.tone)}
                            />
                        </div>
                        :
                        <SelectToneWidget
                            article={article}
                            isLoading={isArticlesUpdatingLoading}
                            handleUpdateArticleTone={handleUpdateArticleTone}
                        />
                    }
                </div>
                {
                    !isCommentEdited
                    ?
                    (
                        (!userState.isAuthenticated && article.comment) || userState.isAuthenticated
                        ?
                        <TextField
                            style={{
                                width: `100%`
                            }}
                            multiline
                            rows={4}
                            variant="outlined"
                            label={t(`toolBox.commentLabel`)}
                            value={article?.comment}
                        />
                        :
                        null
                    )
                    :
                    <TextField
                        style={{
                            width: `100%`
                        }}
                        multiline
                        rows={4}
                        variant="outlined"
                        label={t(`toolBox.commentLabel`)}
                        value={commentInEdit}
                        onChange={(e) => {
                            setCommentInEdit(e.target.value)
                        }}
                    />
                }
                {
                    userState.isAuthenticated
                    ?
                    <div
                        style={{
                            width: `100%`,
                            display: `flex`,
                            justifyContent: `center`
                        }}                        
                    >
                        {
                            isCommentEdited
                            ?
                            <>
                            <IconButton
                                onClick={() => {
                                    handleUpdateArticleComment(commentInEdit!!);
                                }}
                                color="primary"
                                disabled={isArticlesUpdatingLoading}
                            >
                                <SaveIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => {
                                    setCommentInEdit(article.comment)
                                    setCommentEdited(false);
                                }}
                                color="secondary"
                                disabled={isArticlesUpdatingLoading}
                            >
                                <CancelIcon />
                            </IconButton>
                            </>
                            :
                            <IconButton
                                onClick={() => {
                                    setCommentEdited(true);
                                }}
                                color="primary"
                                disabled={isArticlesUpdatingLoading}
                            >
                                <EditIcon />
                            </IconButton>
                        }
                    </div>
                    :
                    null
                }
            </ToolBox>
        </Dialog>
    )
}

export default DisplayArticleDialog;