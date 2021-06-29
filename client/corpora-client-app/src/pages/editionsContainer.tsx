import React from 'react'
import { Route, Switch } from 'react-router';

// Pages
import EditionsMainPage from './editionsMain';
import EditionPage from './editionPage';

import { Edition } from '../api/dataModels';

import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../app/hooks';

const EditionsPagesContainer = () => {
    const { editions: editionsState } = useAppSelector(state => state)

    if (editionsState.isEditionsLoading) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <Switch>
          {
          editionsState.editions?.map(edition => (
            <Route
                key={edition._id}
                //path={`/editions/${edition.name.replace(/\s+/g, '').toLocaleLowerCase().trim()}`}
                path={`/editions/${edition._id}`}
            >
                <EditionPage 
                    edition={edition}
                />
            </Route>
          ))
          }
          <Route 
            exact 
            path="/editions"
          >
            <EditionsMainPage />
          </Route>
        </Switch>
    )
}

export default EditionsPagesContainer;

