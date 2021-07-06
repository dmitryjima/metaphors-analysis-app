import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet';

import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../app/hooks';
import { createNewArticle, deleteArticle, fetchArticlesByEditionId, updateArticleToggleAnnotated } from '../api/endpoints/articles';
import { Article, Edition } from '../api/dataModels';

// Styling
import styled from 'styled-components';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { CircularProgress, IconButton, InputLabel, LinearProgress, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TableSortLabel, Typography } from '@material-ui/core';

// Components
import ArticleRow from '../components/editionPage/articleRow';
import AddNewArticleDialog from '../components/editionPage/addNewArticleDialog';
import DeleteArticleModalDialog from '../components/editionPage/deleteArticleModal';
import DisplayArticleDialog from '../components/editionPage/displayArticleDialog';

// Utils
import useWindowSize from '../utils/useWindowResize';

interface EditionPageProps {
  edition: Edition
}

const EditionPageHeading = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .editionPageHeading__img {
    display: block;
    
    width: auto;
    height: 24px;

    object-fit: contain;
  }

  h1 {
    margin-left: 1rem;
    margin-right: 1rem;
  }

`

const EditionPageTableContainer = styled.div`
  overflow-y: auto;
`


const EditionPage: React.FC<EditionPageProps> = ({
  edition
}) => {
  // Global state & translations
  const { t, i18n } = useTranslation("editionPage");
  const { user: userState } = useAppSelector(state => state);
  
  // Window width
  const { width } = useWindowSize();

  // Articles state and handlers
  const [articles, setArticles] = useState<Array<Article>>([] as Article[]);
  const [isArticlesLoading, setIsArticlesLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  // Filtered articles
  const [articlesFiltered, setArticlesFiltered] = useState<Array<Article>>([] as Article[]);
  const [annotationFilter, setAnnotationFilter] = useState<string | undefined>(``);
  
  // Sorted articles
  const [articlesSorted, setArticlesSorted] = useState<Array<Article>>([] as Article[]);
  const [order, setOrder] = React.useState({
    dir: 'asc' as any,
    orderBy: '' as keyof Article
  });

  const changeOrder = (orderBy: keyof Article) => {
    let dir
    if (!order.dir) {
      dir = 'asc'
    } else {
      if (orderBy === order.orderBy) {
        dir = order.dir === 'asc' ? 'desc' : 'asc'
      } else {
        dir = 'asc'
      }
    }

    setOrder({
      dir,
      orderBy
    })
  }

  // Add new article dialog
  const [addNewArticleDialogOpen, setAddNewArticleDialogOpen] = useState(false);
  const [isAddArticleLoading, setIsAddArticleLoading] = useState(false);

  const handleToggleNewArticleDialogOpen = (value: boolean) => {
    setAddNewArticleDialogOpen(value)
  }



  // Display article dialog
  const [displayArticleDialogOpen, setDisplayArticleDialogOpen] = useState(false);
  const [currentlyDisplayedArticle, setCurrentlyDisplayedArticle] = useState<Article>({} as Article)
  const [isArticlesUpdating, setIsArticlesUpdating] = useState(false);


  const handleDisplayArticle = (article: Article) => {
    setDisplayArticleDialogOpen(true);
    setCurrentlyDisplayedArticle(article)
  }

  const updateCurrentlyDisplayedArticle = (article: Article) => {
    if (currentlyDisplayedArticle) {
      setCurrentlyDisplayedArticle({...article});
    }
  }

  // Delete article modal
  const [deleteArticleDialogOpen, setDeleteArticleDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article>({} as Article)

  const handleSetArticleStagedForDelete = (article: Article) => {
    setDeleteArticleDialogOpen(true);
    setArticleToDelete(article)
  }

  // CRUD operations handlers
  const handleAddNewArticle = async (article: Article, closeDialogCallback?: Function) => {
    try {
      setIsAddArticleLoading(true);
      
      const newArticle = await createNewArticle(article);

      setArticles(articles => [...articles, newArticle]);

      closeDialogCallback && closeDialogCallback();

      setIsAddArticleLoading(false);
    } catch (err) {
      setIsAddArticleLoading(false);
      console.log(err);
    }
  }


  const updateArticleInState = (article: Article) => {
    try {
      let workingArray = [...articles];

      let oldIndex = workingArray.findIndex(a => a._id === article._id);

      workingArray[oldIndex] = {...article}

      console.log(workingArray[oldIndex])

      setArticles(articles => [...workingArray]);
    } catch (err) {
      console.log(err);
    }
  }

  const handleToggleArticleFullyAnnotated = async (article: Article) => {
    try {
      setIsArticlesUpdating(true);
      
      let updatedArticle = await updateArticleToggleAnnotated(article._id!!);

      updateArticleInState(updatedArticle);

      setIsArticlesUpdating(false);
    } catch (err) {
      console.log(err);
      setIsArticlesUpdating(false);
    }
  }

  const handleDeleteArticle = async (
    article: Article,
    handleCloseCallback?: Function,
    handleClearArticleToDeleteCallback?: Function
  ) => {
    try {
      setIsArticlesUpdating(true);
      
      let deletedArticle = await deleteArticle(article._id!!);

      setArticles(articles => [...articles.filter(a => a._id !== deletedArticle._id)]);

      handleCloseCallback && handleCloseCallback();
      handleClearArticleToDeleteCallback && handleClearArticleToDeleteCallback();

      setIsArticlesUpdating(false);
    } catch (err) {
      console.log(err);
      setIsArticlesUpdating(false);
    }
  }

  // Fetch articles
  useEffect(() => {
    async function fetchArticlesForEdition() {
      try {
        setIsArticlesLoading(true);

        const articlesResponse = await fetchArticlesByEditionId(edition._id!!);

        console.log(articlesResponse);

        setArticles(articles => [...articlesResponse])

        setIsArticlesLoading(false);
      } catch (err) {
        setIsArticlesLoading(false);
        console.log(err);
      }
    }

    fetchArticlesForEdition();
  }, []);

  // Apply filters
  useEffect(() => {
    let workingArray = [...articles];

    if (annotationFilter && annotationFilter === 'annotated') {
      workingArray = workingArray.filter(a => a.fullyAnnotated)
    } else if (annotationFilter && annotationFilter === 'notAnnotated') {
      workingArray = workingArray.filter(a => !a.fullyAnnotated)
    }

    setArticlesFiltered(articlesFiltered => [...workingArray]);

  }, [articles, annotationFilter]);

  // Apply sort
  useEffect(() => {
    let workingArray = [...articlesFiltered];

    let orderBy = order.orderBy

    if (orderBy) {

      if (order.dir === 'asc') {
        
        workingArray = workingArray.sort((a: Article, b: Article) => {
          // @ts-ignore: Object is possibly 'null'
          if (a[orderBy] < b[orderBy])
            return -1;
          // @ts-ignore: Object is possibly 'null'
          if (a[orderBy] > b[orderBy])
            return 1;
          return 0
        })
      } else {
        workingArray = workingArray.sort((a: Article, b: Article) => {
          // @ts-ignore: Object is possibly 'null'
          if (a[orderBy] > b[orderBy])
            return -1;
          // @ts-ignore: Object is possibly 'null'
          if (a[orderBy] < b[orderBy])
            return 1;
          return 0
        })
      }
    } 

    setArticlesSorted(articlesSorted => [...workingArray]);

  }, [articlesFiltered, order]);


  return (
    <>
      <Helmet
        title={`${edition.name} | ${t(`metatitle`)}`}
      />
      {
        isArticlesUpdating
        ?
        <LinearProgress />
        :
        <div style={{height: `4px`}}/>
      }
      <EditionPageHeading
        style={{
          display: `flex`,
          alignItems: `center`
        }}
      >
        {
          edition.pictureURL
            ?
            <img
              className={`editionPageHeading__img`}
              src={edition.pictureURL}
              alt={``}
            />
            :
            null
        }
        <h1>
          {edition.name}
        </h1>
        {
          userState.isAuthenticated
          ?
          <IconButton
            onClick={() => handleToggleNewArticleDialogOpen(true)}
          >
            <AddCircleOutlineIcon
              color={`primary`}
            />
          </IconButton>
          :
          null
        }
      </EditionPageHeading>
      <EditionPageTableContainer>
        <TableContainer style={{overflowX: "initial"}}>
          <Table  
            stickyHeader
          >
            <TableHead >
              <TableRow>
                {/* Sort by annotation status */}
                <TableCell 
                  style={{
                    width: '160px', 
                    paddingLeft: `.5rem`, 
                    paddingBottom: `1rem`
                  }} 
                  padding="checkbox"
                  align="left"
                >
                  <InputLabel shrink id="selectAnnotationStatusMenu">
                    {t(`tableRow.tableHead.annotationStatus`)}
                  </InputLabel>
                  <Select
                    labelId="selectAnnotationStatusMenu"
                    style={{
                      width: `140px`
                    }}
                    value={annotationFilter}
                    onChange={(e: React.ChangeEvent<{ value: unknown }>) => {
                      setAnnotationFilter(e.target.value as string)
                    }}
                    displayEmpty
                  >
                    <MenuItem value={``}>
                      {t(`tableRow.tableHead.annotationStatus__all`)}
                    </MenuItem>
                    <MenuItem value={`annotated`}>
                      {t(`tableRow.tableHead.annotationStatus__annotated`)}
                    </MenuItem>
                    <MenuItem value={`notAnnotated`}>
                      {t(`tableRow.tableHead.annotationStatus__notAnnotated`)}
                    </MenuItem>
                  </Select>
                </TableCell>
                {/* Heading */}
                <TableCell style={{width: '25%', minWidth: `8rem`}} align="left">
                  <Typography variant="subtitle1">
                    {t(`tableRow.tableHead.heading`)}
                  </Typography>
                </TableCell>
                {/* Sort by date */}
                <TableCell style={{width: '20%', minWidth: '210px',}} align="left">
                  <TableSortLabel
                    active={order.orderBy === 'publication_date'}
                    direction={order.orderBy === 'publication_date' ? order.dir : 'asc'}
                    onClick={() => changeOrder('publication_date')}
                  >
                    <Typography variant="subtitle1">
                      {t(`tableRow.tableHead.publication_date`)}
                    </Typography>
                  </TableSortLabel>
                </TableCell>

                {/* Tone */}
                <TableCell style={{width: '15%'}} align="left">
                    <Typography variant="subtitle1">
                      {t(`tableRow.tableHead.tone`)}
                    </Typography>
                </TableCell>

                {/* Sort by number of metaphors */}
                <TableCell style={{width: '15%', paddingLeft: `2.5rem`, minWidth: `8rem`}} align="center">
                  <TableSortLabel
                    active={order.orderBy === 'metaphors'}
                    direction={order.orderBy === 'metaphors' ? order.dir : 'asc'}
                    onClick={() => changeOrder('metaphors')}
                  >
                    <Typography variant="subtitle1">
                      {t(`tableRow.tableHead.metaphors`)}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                {/* Placeholder */}
                <TableCell
                  style={{width: '10%'}}
                />
              </TableRow>
            </TableHead>
            <TableBody >
              {
                !isArticlesLoading
                ?
                (
                articlesSorted && articlesSorted.length > 0
                ?
                articlesSorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(article => (
                  <ArticleRow
                    key={article._id}
                    article={article}
                    isArticlesUpdating={isArticlesUpdating}
                    handleDisplayArticle={handleDisplayArticle}
                    handleSetArticleStagedForDelete={handleSetArticleStagedForDelete}
                    handleToggleArticleFullyAnnotated={handleToggleArticleFullyAnnotated}
                  />
                ))
                :
                <TableRow>
                  <TableCell align="left" colSpan={6}>
                    {t(`noArticlesMsg`)}
                  </TableCell>
                </TableRow>
                )
                :
                <CircularProgress/>
              }
            </TableBody>
          </Table>
        </TableContainer>
        <div style={{marginTop: 'auto'}}>
          <TablePagination
            lang={i18n.language}
            labelRowsPerPage={width < 1024 ? '' : t(`rowsPerPage`)}
            rowsPerPageOptions={[5, 10, 20, 30, 50, 100, 150]}
            component="div"
            count={articles.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={(e, newPage) => {
              setPage(newPage)
            }}
            onChangeRowsPerPage={e => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0)
            }}
          />
        </div>
      </EditionPageTableContainer>
      {/* Dialogs & Modals */}
      <AddNewArticleDialog
        edition={edition}
        isOpen={addNewArticleDialogOpen}
        handleClose={() => handleToggleNewArticleDialogOpen(false)}
        isAddArticleLoading={isAddArticleLoading}
        handleAddNewArticle={handleAddNewArticle}
      />
      <DisplayArticleDialog
        article={currentlyDisplayedArticle}
        isOpen={displayArticleDialogOpen}
        handleClose={() => {
          setDisplayArticleDialogOpen(false);
          setCurrentlyDisplayedArticle({} as Article)
        }}
        isArticlesUpdatingLoading={isArticlesUpdating}
        handleSetArticlesUpdatingLoading={(value: boolean) => setIsArticlesUpdating(value)}
        handleUpdateArticleInState={updateArticleInState}
        updateCurrentlyDisplayedArticle={updateCurrentlyDisplayedArticle}
      />
      <DeleteArticleModalDialog 
        isOpen={deleteArticleDialogOpen}
        removeArticleLoading={isArticlesUpdating}
        handleClose={() => setDeleteArticleDialogOpen(false)}
        articleToDelete={articleToDelete}
        handleClearArticleToDelete={() => setArticleToDelete({} as Article)}
        handleDeleteArticle={handleDeleteArticle}
      />
    </>
  )
}

export default EditionPage;