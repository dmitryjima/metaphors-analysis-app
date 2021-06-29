import React from 'react'
import { Helmet } from 'react-helmet';


import { Route, Switch } from 'react-router';


import { Edition } from '../api/dataModels';

interface EditionPageProps {
    edition: Edition
}

const EditionPage: React.FC<EditionPageProps> = ({
    edition
}) => {

    return (
        <>
        <Helmet
            title={edition.name}
        />
        <div>
            {edition.name}
        </div>
        </>
    )
}

export default EditionPage;