import React from 'react'
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const PageBody = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    padding-bottom: 20vh;

    h1 {

        @media(min-width: 1024px) {
            width: 650px
        }
    }

    p {
        text-align: justify;
        margin-top: 0;

        @media(min-width: 1024px) {
            width: 650px
        }
    }

    div {
        text-align: justify;
        margin-top: 0;
        margin-bottom: .5rem;

        @media(min-width: 1024px) {
            width: 650px
        }
    }

    a {
        color: inherit;
    }
`

const AboutPage = () => {
    const { t, i18n } = useTranslation("about");

    return (
        <>
            <Helmet
                title={t(`metatitle`)}
                htmlAttributes={{
                    lang: i18n.language ? i18n.language : 'en'
                }}
            /> 
            <PageBody>
                <h1>
                    {t(`heading`)}
                </h1>
                <div
                    dangerouslySetInnerHTML={{
                        __html: t(`para_1`)
                    }}
                />
                <div
                    dangerouslySetInnerHTML={{
                        __html: t(`para_2`)
                    }}
                />
                <div
                    dangerouslySetInnerHTML={{
                        __html: t(`para_3`)
                    }}
                />
                <div
                    dangerouslySetInnerHTML={{
                        __html: t(`para_4`)
                    }}
                />
                <div
                    dangerouslySetInnerHTML={{
                        __html: t(`para_5`)
                    }}
                />
            </PageBody>
        </>
    )
}

export default AboutPage;