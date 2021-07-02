import React from 'react';


// Redux state
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { _setLoginModalShown, _setLogoutModalShown, _setSidebarOpen } from '../../slices/uiSlice';

// Styled components
import styled from 'styled-components';
import { IconButton } from '@material-ui/core';
import { AccountCircle, ExitToApp } from '@material-ui/icons';
import MenuIcon from '@material-ui/icons/Menu';

// Components
import ChangeLanguageMenu from './changeLanguageMenu';

// Utils
import useWindowSize from '../../utils/useWindowResize';

const NavbarStyled = styled.div`
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 100%;
    height: 60px;

    background-color: var(--medium-slate-blue);

    @media(min-width: 1025px) {
        justify-content: flex-end;
    }
`

const Navbar = () => {
    const dispatch = useAppDispatch();
    const { user: userState } = useAppSelector(state => state)

    const { width, height } = useWindowSize()

    return (
        <NavbarStyled>
        {
            width < 1024
            ?
            <IconButton
                onClick={() => {
                    dispatch(_setSidebarOpen(true))
                }}
            >
                <MenuIcon
                    style={{
                        color: 'white'
                    }}
                />
            </IconButton>
            :
            null
        }
        <div
            style={{
                display: 'flex',
                alignItems: 'center'
            }}
        >
                <ChangeLanguageMenu />
            {
                userState.isAuthenticated
                ?
                <IconButton
                    onClick={() => {
                        dispatch(_setLogoutModalShown(true))
                    }}
                >
                    <ExitToApp
                        style={{
                            color: 'white'
                        }}
                    />
                </IconButton>
            :
            <IconButton
                    onClick={() => {
                        dispatch(_setLoginModalShown(true))
                    }}
            >
                <AccountCircle
                        style={{
                            color: 'white'
                        }}
                />
            </IconButton>
            }

        </div>
        </NavbarStyled>
    );
}

export default Navbar;