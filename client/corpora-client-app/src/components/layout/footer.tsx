import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';


const FooterStyled = styled.div`
    width: 100%;
    min-height: 150px;

    background-color: var(--y-in-mn-blue);
    color: #FFF;

    display: flex;
    flex-direction: column;
    justify-content: center;

    div {
        text-align: center;
    }

    .footer__msg {
        font-size: .7rem;

        padding: 1rem;
    }

    .footer__author {
        padding-bottom: 2rem;
    }

    @media(min-width: 1025px) {
        padding-left: 250px;

        .footer__msg {
            font-size: .8rem;
        }
    }
`

const Footer = () => {
    const { t } = useTranslation("footer");

    return (
        <FooterStyled>
            <div
                className="footer__msg"
            >
                {t(`footerMessage`)}
            </div>
            <div
                className="footer__author"
            >
                {t(`authorYear`)}
            </div>
        </FooterStyled>
    );
}

export default Footer;