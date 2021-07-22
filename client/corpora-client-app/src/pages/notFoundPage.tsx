import React from 'react'
import Helmet from 'react-helmet'
import { NavLink } from 'react-router-dom'


import { useTranslation } from 'react-i18next'


import { useAppSelector } from '../app/hooks'

const NotFoundPage = () => {
    const { t, i18n, ready } = useTranslation("editionsMain");

    const { editions: editionsState } = useAppSelector(state => state)

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
            title={`404`}
            htmlAttributes={{
                lang: i18n.language ? i18n.language : 'en'
            }}
        /> 
        <div>
            page not found
        </div>
        </>
    )
}

export default NotFoundPage;