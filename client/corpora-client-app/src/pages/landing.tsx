import React from 'react'
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import styled from 'styled-components';


const HeaderStyled = styled.header`
    position: relative;
    overflow-x: hidden;

    display: flex;
    justify-content: center;

    height: 300px;
    width: 340px;

    margin-left: auto;
    margin-right: auto;

    h1 {
        color: #ffffff;

        text-align: center;

        font-size: 1.2rem;
        width: 80%;

        text-shadow: 1px 1px 1px #524949;
    }

    svg {
        position: absolute;
        z-index: -1;

        transition: .2s ease-in;
    }

    #header__greenBlob {
        top: -55px;
        left: -25px;

        width: 350px;
    }

    #header__redBlob {
        top: 140px;
        left: 50px;

        width: 75px;
    }

    #header__blueBlob {
        top: -45px;
        right: -15px;

        width: 250px;
    }

    @media(min-width: 1024px) {
        height: 500px;
        width: 640px;

        
        padding: 2.5rem;
        padding-top: 6rem;

        h1 {
            color: #ffffff;

            text-align: center;

            font-size: 1.7rem;
            width: 80%;

            text-shadow: 1px 1px 1px #222121;
        }

        #header__greenBlob {
            top: -55px;
            left: -25px;

            width: 550px;
        }

        #header__redBlob {
            top: 250px;
            left: 50px;

            width: 125px;
        }

        #header__blueBlob {
            top: -65px;
            right: 0px;

            width: 460px;
        }

    }
`

const Header = () => {
    const { t, i18n } = useTranslation("landing");

    return (
        <HeaderStyled>
            <svg 
                id="header__greenBlob"
                viewBox="0 0 200 200" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    fill="#A1D2CE" 
                    d="M43.5,-52.6C53.8,-43.2,57.7,-27,61.8,-10C65.8,7,70,24.9,64.5,40C59.1,55.1,44,67.4,28.6,68.8C13.1,70.1,-2.7,60.6,-16.5,52.5C-30.2,44.3,-41.8,37.6,-54.5,26.3C-67.2,15,-81,-0.9,-81.9,-17.6C-82.7,-34.3,-70.5,-52,-54.7,-60.4C-38.9,-68.8,-19.5,-68,-1.4,-66.3C16.6,-64.6,33.2,-62,43.5,-52.6Z" 
                    transform="translate(100 100)" 
                />
            </svg>
            <svg 
                id="header__redBlob"
                viewBox="0 0 200 200" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    fill="#E87461" 
                    d="M50.9,-45.8C67,-34.9,81.6,-17.5,81.5,-0.1C81.3,17.2,66.5,34.4,50.4,50.2C34.4,66,17.2,80.3,-0.4,80.7C-17.9,81.1,-35.8,67.4,-51.2,51.6C-66.6,35.8,-79.3,17.9,-79.8,-0.5C-80.3,-18.9,-68.5,-37.8,-53.1,-48.6C-37.8,-59.5,-18.9,-62.3,-0.7,-61.6C17.5,-60.8,34.9,-56.6,50.9,-45.8Z" 
                    transform="translate(100 100)" 
                />
            </svg>
            <svg 
                id="header__blueBlob"
                viewBox="0 0 200 200" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path 
                    fill="#7371FC" 
                    d="M50.5,-55.6C64.9,-48.1,75.7,-31.7,77.9,-14.5C80.1,2.7,73.5,20.7,63.6,35.6C53.6,50.4,40.3,62.2,26.7,62.3C13.2,62.4,-0.6,50.9,-11.3,42.2C-22.1,33.5,-29.8,27.6,-42.3,18.4C-54.9,9.2,-72.2,-3.3,-69,-10.5C-65.7,-17.7,-42,-19.7,-27,-27.2C-12.1,-34.6,-6.1,-47.5,6,-54.7C18,-61.8,36.1,-63.1,50.5,-55.6Z" 
                    transform="translate(100 100)"
                />
            </svg>
            <h1
                style={{
                    paddingTop: i18n.language === 'zh' ? `4rem` : (i18n.language === 'ru' ? `1rem` : `2rem`)
                }}
            >
                {t(`headerTitle`)}
            </h1>
        </HeaderStyled>
    )
}

const PageBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    padding-bottom: 20vh;

    h2 {
        margin-top: 0;
        text-align: center;
    }

    p {
        text-align: justify;
        margin-top: 0;

        @media(min-width: 1024px) {
            width: 650px
        }
    }

    a {
        display: block;
        color: inherit;
    }
`

const LandingPage = () => {
    const { t, i18n } = useTranslation("landing");

    return (
        <>
            <Helmet
                title={t(`metatitle`)}
                htmlAttributes={{
                    lang: i18n.language ? i18n.language : 'en'
                }}
            /> 
            <PageBody>
                <Header/>
                <h2>
                    {t(`h2_welcome`)}
                </h2>
                <p>
                    {t(`para_1`)}
                </p>
                <p>
                    {t(`para_2`)}
                </p>
                <p>
                    {t(`para_3`)}
                </p>
                <p>
                    {t(`para_4`)}
                </p>
                <p>
                    {t(`para_5`)}
                </p>
                <Link
                    to="/editions"
                >
                    {t(`ctaBtn`)}
                </Link>
            </PageBody>
        </>
    )
}

export default LandingPage;