# Metaphors Analysis client-side application 

This the front-end part of the Metaphors Analysis application, based on React and written in TypeScript. It is aimed at making the process of annotion and review of large amount of texts more convenient and fast. It fully supports mobile/tablet view, using both touch and mouse events during the annotation process, multilingual UI (En, Ru, Zh), authentication, and visual display of current results and statistics as adaptive charts and tables. 

<h2 name="launch">Launch</h3>
This application is based on React and `create-react-app` without any major differencies to the setup.

Install the dependencies with:

```
npm i
```

Run in development mode with:

```
npm run dev
```

Build a production version of the application with:
```
npm run build
```

This application was designed to run as part of the monorepo, with Node.js application serving the production build of the React application. However, by setting `BASE_URL` in the `.env` file, this can be easily overwritten, if you want to connect it to a different API.

