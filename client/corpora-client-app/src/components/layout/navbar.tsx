import React from 'react';

// Translations
import { useTranslation } from 'react-i18next';

// Redux state
import { useAppDispatch, useAppSelector } from '../../app/hooks';

// Styled components
import styled from 'styled-components';

const NavbarStyled = styled.div`
    width: 100%;
    height: 60px;

    background-color: var(--medium-slate-blue);
`

const Navbar = () => {
    const { t, i18n, ready } = useTranslation("navbar");


    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state)

    return (
        <NavbarStyled>
        </NavbarStyled>
    );
}

export default Navbar;