import React from 'react'
import { Route, Switch } from 'react-router';

// Pages
import EditionsMainPage from './editionsMain';
import EditionPage from './editionPage';

import { useAppSelector } from '../app/hooks';

interface EditionsPagesContainerProps {
  availableLanguages: string[]
}

const EditionsPagesContainer: React.FC<EditionsPagesContainerProps> = ({
  availableLanguages
}) => {
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
            <EditionsMainPage
              availableLanguages={availableLanguages}
            />
          </Route>
        </Switch>
    )
}

export default EditionsPagesContainer;

