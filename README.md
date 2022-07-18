# Metaphors Analysis Application

A MERN-stack application for comparative metaphors analysis of multilingual corpora, developed in the framework of the PhD research "Comparative study of the metaphors of AI technology in the Russian, Chinese, and American political media discourse". Can be used as a tool for further research in the same field, or adopted and utilised for any comparative research project that involves gathering and annotating large amounts of multilingual textual content.

[Deployed Application](https://ai-metaphors-analysis.zdcreatech.com/)

## Table of contents
1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Technology stack & Architecture](#tech-stack)
4. [Launch & Adaptation Guidelines](#guidelines)


<h2 name="overview">Overview</h3>

This application is designed to make the process of gathering and analyzing corpora from different sources more convenient and practical. The goal of the original study is to compare the characteristics of the metaphors and metaphorical models existing in the media discourse of the USA, Russia, and the PRC towards a large spectrum of technologies usually referred to as "Artificial Intelligence". Thus, a large amount of media texts had to be gathered and annotated in a consequent and uniform manner. A more detailed explanation of the research purpose and methodology can be found on the <a href="https://ai-metaphors-analysis.zdcreatech.com/en/about">"About"</a> page of the deployed application.

One of the problems frequently encountered when working with multilingual research is the annotation process. Traditional annotation tools are based on the assumption that words are tokenised in nature, separated in the text by punctuation (i.e., spaces). This might work well for particular languages (e.g. English, French, Russian, etc.); however, this approach proves to be useless when trying to work with a language with a drastically different approach to punctuation and written word separation (e.g. Chinese, Japanese). Therefore, the most logical solution was to implement a different tool.

<h2 name="features">Core Features</h3>

The application supports:
* Gathering corpora material from any devices: mobile, tablet, desktop;
* Annotation engine suitable to virtually any written language, including the ones that don't have "spaces";
* Analysis results visualization as sets aggregated data represented in auto-generated charts and graphics;
* Authentication and potent operations protection;


<h2 name="tech-stack">Technologies in use & Architecture</h3>

The application is based on the MERN stack: MongoDB, Express.js, React.js, Node.js. It consists of a server-side backend application, based on Express.js and written in JavaScript, and a client-side application based on React and written in TypeScript. 

__Server-side application__ is pretty standard in terms of API architecture: it exposes a number of public and protected endpoints, whose logic is put into corresponding controllers, and, if needed, moved into `/lib` utility methods. It uses a number of libraries that are commonly used with Express.js, including `cookie-parser`, `cors`, `helmet`, `jsonwebtoken`, `moment`, `morgan`. 

For describing and accessing database for CRUD operations, the `mongoose` ODM library is used. Primary data models are `Edition`, `Article`, `MetaphorCase`, and `MetaphorModel`. `Edition` represents a media outlet, that can have multiple `Article`s associated with it. `Article`, in its own turn, represents the "meat" of the corpora: a journalistic piece with the `header`, article `body` as stringified rich text, source `url`, and `publication_date` being the original, minimally affected factual data, gathered in the process of corpora accumulation, as well as a number of meta data, added by the researcher in the process of content and discourse analysis: publication's `tone`, whether or not the piece had been `fullyAnnotated`, and any relative `comment`s. Entities of `MetaphorCase` and `MetaphorGoal` are defined during the research process, and closely related, as each `MetaphorCase` needs a model, associated with it, corresponding `sourceArticleId` and `sourceEditionId`, `lang`uage, as well as its position in the article represented with `char_range`. 

Read operations are generally public, while create/update/delete ones are protected with a simple, yet effective JWT-based authentication/authorization model via HTTP-only cookies. The application also defines a `User` entity, associated with the users that can access potent features of the application. Registration process is omitted due the lack of necessity, however it can be introduced relatively easily, along with a more sophisticated role-based auth models.

A slightly more coplex approach has been used in the `/results` endpoint which is responsible for serving a large amounts of data that could be conviniently summorised and interpreted. It utilises MongoDB aggreagations, enhanced by the convenience of `mongoose` library. It allows calculating and gathering large amounts of data on the fly, and having the continuing research progress without any delay. 

Application also supports file uploads for adding more vivid and dynamic `Edition` data, so that each media outlet would have a distinct image, thus easing the navigation. 

__Client-side application__ in its own turn is based on React.js library and a number of libraries commonly used in combination with React.js, including `reduxjs/toolkit` for global state management, `react-router-dom` for client-side navigation, `react-i18next` for UI i18n, `react-helmet` for readable meta-titles. In order to speed up the development, MaterialUI library was used for most common components (modal overlays, buttons, tables, inputs) in combination with `styled-components` CSS-in-JS library. 

For displaying and editing articles' bodies, `trix` and `react-trix` libraries were used. Data visualization was based on `recharts` libraries that supports useful, relatively-easily customizable components that allow displaying data in presentable manner. 

From the architecture PoV, client-side application is quite standard. `/api` folder contains an instance of `axios` with configured interceptors and the methods for accessing the API via HTTP, mirroring the backend application structure. TypeScript types, based on `mongoose` data models, are also difened there. `/pages` folder contains Components that represent separate "pages". `/slices` define the way the global Redux storage is orginized. `/components` folder contains re-usable Components.

The whole application is presented as a monorepo, however with minimal effort, a full-fledged decoupling can be introduced, with the backend app deployed on a separate VPS instance, with the build version of the frontend application deployed on a CDN service or a static website hosting provider (e.g. Netlify, or Vercel).

<h2 name="guidelines">Launch & Adaptation overview</h3>

Application requires a working and launched version of a MongoDB database, either locally or in a cloud that can be "plugged in" by providing `MONGO_URI` environment variable. Current version relies on password-based authentication to the database connection, so `MONGO_USER` and `MONGO_PASS` should be provided, as well. In order for authentication service to work `JWT_SECRET` and `ADMIN_JWT_EXP_TIME` should be provided, as well.

In order to start, all what's required, is a entity of type `User` in the collection `users`, which can be created manually via MongoDB UI or CLI, or programmitically (minimalistic examples provided in the root `/examples` folder). 

Install the server-side dependencies:

```
npm install
```

Install client-side dependencies:

```
cd client/corpora-client-app

npm install
```

To start application in the development mode, run:

```
npm run dev
```

In order to run the application in production mode, first build the client-side application:

```
cd client/corpora-client-app

npm run build
```

and start the backend application from the root folder, which is configured to serve the client-side app along with the API:

```
npm run start
```

Current version of the application is composed as a monorepo, but it can be decoupled relatively easily. Application can be used in similar research, or, with tweaks to data models and namings, can be promptly adopted to a large amount of research that involve gathering and annotating large amounts of multilingual corpora. Forks and PRs to this repository are welcome!