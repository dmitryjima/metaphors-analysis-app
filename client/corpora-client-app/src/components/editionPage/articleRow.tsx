import React from 'react';

import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../app/hooks';

// Stylings
import styled from 'styled-components';
import { Checkbox, TableCell, TableRow, Typography, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { Article } from '../../api/dataModels';

interface ArticleRowProps {
    article: Article,
    isArticlesUpdating: boolean,
    handleDisplayArticle: (article: Article) => void,
    handleSetArticleStagedForDelete: (article: Article) => void,
    handleToggleArticleFullyAnnotated: (article: Article) => void
}

interface ArticleToneProps {
    bgColor: string
}
const ArticleTone = styled.div<ArticleToneProps>`
    height: 32px;
    width: 32px;
    border-radius: 50%;

    background-color: ${
        props => (
            props.bgColor
        )
    };
`

export const articleToneColorSwitch = (tone: string | undefined) => {
    let color
    switch (tone) {
        case 'positive':
            color = '#A1D2CE'
            break;
        case 'negative':
            color = '#E87461'
            break;
        case 'neutral':
            color = '#7371FC'
            break;
        default:
            color = 'grey'
            break;
    }

    return color
}

const ArticleRowStyled = styled(TableRow)`

    transition: .2s ease-in-out;

    button {
        transition: .4s ease-in-out;
        @media(min-width: 1024px) {
            opacity: 0;
        }
    }
    &:hover {
        cursor: pointer;
        box-shadow: 0px 0px 14px 3px rgba(165, 148, 249, 0.4);

        button {
            @media(min-width: 1024px) {
                opacity: 1;
            }
        }
    }
`

const ArticleRow: React.FC<ArticleRowProps> = ({
    article,
    isArticlesUpdating,
    handleDisplayArticle,
    handleSetArticleStagedForDelete,
    handleToggleArticleFullyAnnotated
}) => {
    const { i18n } = useTranslation("editionPage");

    const { user: userState } = useAppSelector(state => state)


    return (
        <ArticleRowStyled
            onClick={() => {
                if(isArticlesUpdating) return 
                handleDisplayArticle(article);
            }}
        >
            <TableCell>
                <Checkbox
                    color="primary"
                    disabled={isArticlesUpdating || !userState.isAuthenticated}
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    onChange={(e) => {
                        e.stopPropagation();
                        if (!userState.isAuthenticated) return
                        handleToggleArticleFullyAnnotated(article);
                    }}
                    checked={article.fullyAnnotated}
                />
            </TableCell>
            <TableCell>
                <Typography variant="body2">
                    {article.heading.length <= 20 ? article.heading : article.heading.substring(0,15) + '...'}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography variant="body2">
                    {article.publication_date ? new Date(article.publication_date).toLocaleDateString(i18n.language) : `-`}
                </Typography>
            </TableCell>
            <TableCell
                style={{
                    paddingLeft: `1.2rem`
                }}
            >
                {
                    article.tone
                    ?
                    <ArticleTone
                        bgColor={articleToneColorSwitch(article.tone)}
                    />
                    :
                    <Typography 
                        variant="body2"
                        style={{
                            paddingLeft: `.7rem`
                        }}
                    >
                        -
                    </Typography>
                }
            </TableCell>
            <TableCell
                align="center" 
            >
                {
                    article.metaphors
                    ?
                    <Typography variant="body2">
                        {article.metaphors.length}
                    </Typography>
                    :
                    <Typography variant="body2">
                        -
                    </Typography>
                }
            </TableCell>
            <TableCell 
                align="left" 
            >
                {
                    userState.isAuthenticated
                    ?
                    <IconButton
                        color={`secondary`}
                        className={`editionCard__button`}
                        disabled={isArticlesUpdating}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleSetArticleStagedForDelete(article);
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                    :
                    null
                }
            </TableCell>
        </ArticleRowStyled>
    );
}

export default ArticleRow;