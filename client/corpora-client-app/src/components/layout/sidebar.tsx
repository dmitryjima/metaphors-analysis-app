import React from 'react';


// Translations
import { useTranslation } from 'react-i18next';

// Redux state
import { useAppDispatch, useAppSelector } from '../../app/hooks';

// Styled components
import styled from 'styled-components';


const SidebarStyled = styled.div`

`

const Sidebar = () => {
    const { t, i18n, ready } = useTranslation("sidebar");

    const dispatch = useAppDispatch();
    const state = useAppSelector(state => state)

    return (
        <SidebarStyled>
            <h1>
                {t(`links.about`)}
            </h1>
        </SidebarStyled>
    );
}

export default Sidebar;