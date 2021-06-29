import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';


const SidebarStyled = styled.div`

`

const Sidebar = () => {
    const { t, i18n, ready } = useTranslation("sidebar");

    const dispatch = useDispatch();
    const state = useSelector(state => state);

    return (
        <SidebarStyled>
            <h1>
                {t(`links.about`)}
            </h1>
        </SidebarStyled>
    );
}

export default Sidebar;