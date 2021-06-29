import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';


const NavbarStyled = styled.div`
    width: 100%;
    height: 60px;

    background-color: var(--medium-slate-blue);
`

const Navbar = () => {
    const { t, i18n, ready } = useTranslation("navbar");

    const dispatch = useDispatch();
    const state = useSelector(state => state);

    return (
        <NavbarStyled>
        </NavbarStyled>
    );
}

export default Navbar;