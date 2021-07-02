import React, { useState } from 'react'
import Helmet from 'react-helmet'
import { NavLink } from 'react-router-dom'


import { useTranslation } from 'react-i18next'

import { useAppSelector } from '../app/hooks'
import styled from 'styled-components'
import EditionCard from '../components/editionsMain/editionCard'
import { IconButton } from '@material-ui/core'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteEditionModalDialog from '../components/editionsMain/deleteEditionModal'
import { Edition } from '../api/dataModels'
import AddEditionModalDialog from '../components/editionsMain/addNewEditionModal'
import UpdateEditionModalDialog from '../components/editionsMain/editEditionModal'

interface EditionsMainPageProps {
    availableLanguages: string[]
}

const EditionsCardsContainer = styled.div`

`

const EditionsMainPage: React.FC<EditionsMainPageProps> = ({
    availableLanguages
}) => {
    const { t, i18n, ready } = useTranslation("editionsMain");

    const { editions: editionsState, user: userState } = useAppSelector(state => state);

    // Add new edition state and handlers
    const [addEditionModalOpen, setAddEditionModalOpen] = useState(false);

    const handleSetAddEditionModalOpen = (isOpen: boolean) => {
        setAddEditionModalOpen(isOpen)
    }

    // Update edition state and handlers
    const [updateEditionModalOpen, setUpdateEditionModalOpen] = useState(false);
    const [editionToUpdate, setEditionToUpdate] = useState<Edition | null>(null)

    const handleSetUpdateEditionModalOpen = (isOpen: boolean) => {
        setUpdateEditionModalOpen(isOpen)
    }

    const handleSetEditionToUpdate = (edition: Edition | null) => {
        setEditionToUpdate(edition)
    }

    // Delete edition state and handlers
    const [deleteEditionModalOpen, setDeleteEditionModalOpen] = useState(false);
    const [editionToDelete, setEditionToDelete] = useState<Edition | null>(null)

    const handleSetDeleteEditionModalOpen = (isOpen: boolean) => {
        setDeleteEditionModalOpen(isOpen)
    }

    const handleSetEditionToDelete = (edition: Edition | null) => {
        setEditionToDelete(edition)
    }

    if (editionsState.isEditionsLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <>
        <Helmet
            title={t(`metatitle`)}
        /> 
        <h1
            style={{
                display: `flex`,
                alignItems: `center`
            }}
        >
            {t(`title`)}
            {
                userState.isAuthenticated
                ?
                <IconButton
                    onClick={() => handleSetAddEditionModalOpen(true)}
                >
                    <AddCircleOutlineIcon
                        color={`primary`}
                    />
                </IconButton>
                :
                null
            }
        </h1>
        <EditionsCardsContainer>
            {
                availableLanguages && availableLanguages.map(lang => (
                    <React.Fragment
                        key={lang}
                    >
                        <h2>
                            {t(`languages.${lang}`)}
                        </h2>
                        <div
                            style={{
                                display: `flex`,
                                flexWrap: `wrap`,
                                gap: `1.5rem`
                            }}
                        >
                            {
                                editionsState.editions.filter(e => e.lang === lang).map(edition => (
                                    <EditionCard
                                        key={edition._id}
                                        edition={edition}
                                        handleSetEditionToBeUpdated={(edition) => {
                                            handleSetEditionToUpdate(edition);
                                            handleSetUpdateEditionModalOpen(true);
                                        }}
                                        handleSetEditionToBeDeleted={(edition) => {
                                            handleSetEditionToDelete(edition);
                                            handleSetDeleteEditionModalOpen(true);
                                        }}
                                    />
                                ))
                            }
                        </div>
                    </React.Fragment>
                ))

            }
        </EditionsCardsContainer>
        <UpdateEditionModalDialog 
            isOpen={updateEditionModalOpen}
            handleClose={() => handleSetUpdateEditionModalOpen(false)}
            editionToUpdate={editionToUpdate}
            handleSetEditionToUpdate={handleSetEditionToUpdate}
        />
        <AddEditionModalDialog
            isOpen={addEditionModalOpen}
            handleClose={() => handleSetAddEditionModalOpen(false)}
        />
        <DeleteEditionModalDialog 
            isOpen={deleteEditionModalOpen}
            handleClose={() => handleSetDeleteEditionModalOpen(false)}
            editionToDelete={editionToDelete}
            handleClearEditionToDelete={() => handleSetEditionToDelete(null)}
        />
        </>
    )
}

export default EditionsMainPage;