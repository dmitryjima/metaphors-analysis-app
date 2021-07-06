import React from 'react';
import { Link } from 'react-router-dom';

// Translations
import { useTranslation } from 'react-i18next';

// Redux state
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { _setSidebarOpen } from '../../slices/uiSlice';

// Stylings
import { Drawer, ListItem, ListItemIcon, ListItemText, makeStyles, SwipeableDrawer } from '@material-ui/core';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import HomeIcon from '@material-ui/icons/Home';
import ChromeReaderModeIcon from '@material-ui/icons/ChromeReaderMode';
import PieChartIcon from '@material-ui/icons/PieChart';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles({
    list: {
      '& > a': {
          textDecoration: 'none',
          color: 'inherit'
      }
    }
});

interface SidebarProps {
    availableLanguages: string[]
}

const SidebarMobile: React.FC<SidebarProps> = ({
    availableLanguages
}) => {
    const { t } = useTranslation("sidebar");

    const dispatch = useAppDispatch();
    const { ui: uiState, editions: editionsState } = useAppSelector(state => state)

    const classes = useStyles();

    return (
    <SwipeableDrawer
      anchor={`left`}
      open={uiState.isSidebarOpen}
      onClose={() => dispatch(_setSidebarOpen(false))}
      onOpen={() => dispatch(_setSidebarOpen(true))}
    >
        <List
            style={{
                minWidth: 250
            }}
            className={classes.list}
        >
            <h3
                style={{
                    paddingLeft: `1rem`
                }}
            >
                {t(`navigation`)}
            </h3>
            <Divider />
            <Link
                to={`/`}
            >
                <ListItem 
                    button
                    onClick={() => dispatch(_setSidebarOpen(false))}
                >

                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={t(`home`)} />
                </ListItem>
            </Link>
            <Link
                to={`/editions`}
            >
                <ListItem 
                    button
                    onClick={() => dispatch(_setSidebarOpen(false))}
                >

                        <ListItemIcon>
                            <ChromeReaderModeIcon />
                        </ListItemIcon>
                        <ListItemText primary={t(`editions`)} />
                </ListItem>
            </Link>
                {
                    availableLanguages && editionsState.editions.length > 0 && availableLanguages.map(lang => {
                        return (
                            <React.Fragment
                                key={lang}
                            >
                            <ListItem>
                                <ListItemText 
                                    style={{
                                        paddingLeft: '1rem'
                                    }}
                                    primary={t(`languages.${lang}`)} 
                                />
                            </ListItem>
                            {
                                editionsState.editions.filter(e => e.lang === lang).map(edition => (
                                    <Link
                                        key={edition._id}
                                        to={`/editions/${edition._id}`}
                                    >
                                        <ListItem 
                                            button
                                            onClick={() => dispatch(_setSidebarOpen(false))}
                                        >
                                                <ListItemIcon>
                                                    
                                                </ListItemIcon>
                                                <ListItemText primary={edition.name} />
                                        </ListItem>
                                    </Link>
                                ))
                            }
                            </React.Fragment>
                        )
                    })
                }
            <Link
                to={`/results`}
            >
                <ListItem 
                    button
                    onClick={() => dispatch(_setSidebarOpen(false))}
                >

                        <ListItemIcon>
                            <PieChartIcon />
                        </ListItemIcon>
                        <ListItemText primary={t(`results`)} />
                </ListItem>
            </Link>
            <Link
                to={`/about`}
            >
                <ListItem 
                    button
                    onClick={() => dispatch(_setSidebarOpen(false))}
                >

                        <ListItemIcon>
                            <InfoIcon />
                        </ListItemIcon>
                        <ListItemText primary={t(`about`)} />
                </ListItem>
            </Link>
        </List>
    </SwipeableDrawer>
    );
}

export default SidebarMobile;


export const SidebarDesktop: React.FC<SidebarProps> = ({
    availableLanguages
}) => {
    const { t, i18n, ready } = useTranslation("sidebar");

    const dispatch = useAppDispatch();
    const { ui: uiState, editions: editionsState } = useAppSelector(state => state)

    const classes = useStyles();

    return (
        <Drawer
            variant="permanent"
            anchor="left"
        >
            <List
                style={{
                    minWidth: 250
                }}
                className={classes.list}
            >
                <h3
                    style={{
                        paddingLeft: `1rem`
                    }}
                >
                    {t(`navigation`)}
                </h3>
                <Divider />
                <Link
                    to={`/`}
                >
                    <ListItem 
                        button
                    >

                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary={t(`home`)} />
                    </ListItem>
                </Link>
                <Link
                    to={`/editions`}
                >
                    <ListItem 
                        button
                    >

                            <ListItemIcon>
                                <ChromeReaderModeIcon />
                            </ListItemIcon>
                            <ListItemText primary={t(`editions`)} />
                    </ListItem>
                </Link>
                    {
                        availableLanguages && editionsState.editions.length > 0 && availableLanguages.map(lang => {
                            return (
                                <React.Fragment
                                    key={lang}
                                >
                                    <ListItem>
                                        <ListItemText 
                                            style={{
                                                paddingLeft: '1rem'
                                            }}
                                            primary={t(`languages.${lang}`)} 
                                        />
                                    </ListItem>
                                    {
                                        editionsState.editions.filter(e => e.lang === lang).map(edition => (
                                            <Link
                                                key={edition._id}
                                                to={`/editions/${edition._id}`}
                                            >
                                                <ListItem 
                                                    button
                                                >
                                                        <ListItemIcon>
                                                            
                                                        </ListItemIcon>
                                                        <ListItemText primary={edition.name} />
                                                </ListItem>
                                            </Link>
                                        ))
                                    }
                                </React.Fragment>
                            )
                        })
                    }
                <Link
                    to={`/results`}
                >
                    <ListItem 
                        button
                        onClick={() => dispatch(_setSidebarOpen(false))}
                    >

                            <ListItemIcon>
                                <PieChartIcon />
                            </ListItemIcon>
                            <ListItemText primary={t(`results`)} />
                    </ListItem>
                </Link>
                <Link
                    to={`/about`}
                >
                    <ListItem 
                        button
                        onClick={() => dispatch(_setSidebarOpen(false))}
                    >

                            <ListItemIcon>
                                <InfoIcon />
                            </ListItemIcon>
                            <ListItemText primary={t(`about`)} />
                    </ListItem>
                </Link>
            </List>
        </Drawer>
    );
}