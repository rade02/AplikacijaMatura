# Aplikacija matura

## Programska koda za aplikacijo pri predmetu računalništvo na splošni maturi

Uporabljena orodja:

-  HTML, CSS
-  JavaScript s knjižnicami:
   -  [React.js](https://react.dev/)
   -  [Express.js](https://expressjs.com/)
   -  [Axios](https://axios-http.com/)
-  okolje [Node.js](https://nodejs.org/en) (VS Code)
-  SUPB [MySQL](https://www.mysql.com/) (MySQL Workbench)

---

### <u>Ukazi za lokalni zagon aplikacije</u>

Zagon v razvijalskem načinu:

1. `\AplikacijaMatura\server>node index.js` za zagon strežnika
2. `\AplikacijaMatura\client>npm start` za zagon React aplikacije

Zagon produkcijske različice:

1. `\AplikacijaMatura\server>node index.js` za zagon strežnika
2. `\AplikacijaMatura\server>serve -s build -l 3010` za zagon React aplikacije

---

### <u>Struktura korenske mape</u>

<details><summary>Slika strukture</summary>

![Struktura korenske mape](/image/sample.png 'This is a sample image.')

</details>
<details><summary>Drevo strukture</summary>

```
Folder PATH listing
Volume serial number is 76B1-AA6C
C:.
|   .gitignore
|   drevo.txt
|   package-lock.json
|   package.json
|   README.md
|
+---.vscode
|       settings.json
|
+---client
|   |   .gitignore
|   |   drevoClient.txt
|   |   package-lock.json
|   |   package.json
|   |
|   +---build
|   |   |   asset-manifest.json
|   |   |   index.html
|   |   |   manifest.json
|   |   |
|   |   \---static
|   |       +---css
|   |       |       main.6b70e014.css
|   |       |       main.6b70e014.css.map
|   |       |
|   |       \---js
|   |               main.bea9bb94.js
|   |               main.bea9bb94.js.LICENSE.txt
|   |               main.bea9bb94.js.map
|   |
|   +---node_modules
|   |   | ...
|   |
|   +---public
|   |       index.html
|   |       manifest.json
|   |
|   \---src
|       |   App.css
|       |   App.js
|       |   config.js
|       |   index.js
|       |
|       +---assets
|       |       Logotip.png
|       |       PSlogotip.png
|       |       Uporabnik.png
|       |
|       +---contexts
|       |       NakupovalniKontekst.js
|       |       UporabniskiKontekst.js
|       |
|       \---pages
|           |   Domov.jsx
|           |   Error.jsx
|           |   LogotipC.jsx
|           |   NavigacijskaVrsticaC.jsx
|           |   NogaC.jsx
|           |   ONas.jsx
|           |
|           +---avtentikacija
|           |   |   Avtentikacija.css
|           |   |   Avtentikacija.jsx
|           |   |   IzbrisProfilaC.jsx
|           |   |   ObvestiloC.jsx
|           |   |   PodatkiUporabnikaC.jsx
|           |   |   PrijavaC.jsx
|           |   |   ProfilC.jsx
|           |   |   RegistracijaC.jsx
|           |   |   SpreminjanjeGeslaC.jsx
|           |   |   UrejanjeProfilaC.jsx
|           |   |
|           |   \---pregledi_in_dodajanja
|           |           DodajanjeIzdelkovC.jsx
|           |           DodajanjeUporabnikovC.jsx
|           |           PodrobnostiC.jsx
|           |           PregledC.jsx
|           |           PregledNarocilC.jsx
|           |           PregledPBC.jsx
|           |           PregledRacunovC.jsx
|           |           TabelskaVrsticaC.jsx
|           |
|           \---trgovina
|                   BlagajnaC.jsx
|                   InformacijeOProduktuC.jsx
|                   IzdelekVKosariciC.jsx
|                   KosaricaC.jsx
|                   NakupovanjeC.jsx
|                   NavigacijaTrgovineC.jsx
|                   PrikazProduktovC.jsx
|                   ProduktC.jsx
|                   Trgovina.css
|                   Trgovina.jsx
|                   VsebinaTrgovineC.jsx
|
+---docs
|       DiagramProgramaZaMaturo.drawio
|       DiagramProgramaZaMaturo.drawio.svg
|       drevoDocs.txt
|       MSračunalništvo.docx
|       MSračunalništvo.pdf
|       SQLstavkiZacetnaBaza.sql
|       SQLzaBazoSPodatki.sql
|
\---server
    |   .env
    |   config.js
    |   drevoServer.txt
    |   index.js
    |   package-lock.json
    |   package.json
    |   povezavaPB.js
    |
    +---build
    |   |   asset-manifest.json
    |   |   index.html
    |   |   manifest.json
    |   |
    |   \---static
    |       +---css
    |       |       main.0fa34192.css
    |       |       main.0fa34192.css.map
    |       |
    |       \---js
    |               main.95d331fc.js
    |               main.95d331fc.js.LICENSE.txt
    |               main.95d331fc.js.map
    |
    +---node_modules
    |   | ...
    |
    \---routes
        \---api
                administratorApi.js
                avtentikacijaApi.js
                produktiApi.js



```

</details>

### <u>Struktura mape client</u>

<details><summary>Slika strukture</summary>

![Struktura mape client](/image/sample.png 'This is a sample image.')

</details>
<details><summary>Drevo strukture</summary>

```

Folder PATH listing
Volume serial number is 76B1-AA6C
C:.
|   .gitignore
|   drevoClient.txt
|   package-lock.json
|   package.json
|
+---build
|   |   asset-manifest.json
|   |   index.html
|   |   manifest.json
|   |
|   \---static
|       +---css
|       |       main.6b70e014.css
|       |       main.6b70e014.css.map
|       |
|       \---js
|               main.bea9bb94.js
|               main.bea9bb94.js.LICENSE.txt
|               main.bea9bb94.js.map
|
+---node_modules
|   | ...
|
+---public
|       index.html
|       manifest.json
|
\---src
    |   App.css
    |   App.js
    |   config.js
    |   index.js
    |
    +---assets
    |       Logotip.png
    |       PSlogotip.png
    |       Uporabnik.png
    |
    +---contexts
    |       NakupovalniKontekst.js
    |       UporabniskiKontekst.js
    |
    \---pages
        |   Domov.jsx
        |   Error.jsx
        |   LogotipC.jsx
        |   NavigacijskaVrsticaC.jsx
        |   NogaC.jsx
        |   ONas.jsx
        |
        +---avtentikacija
        |   |   Avtentikacija.css
        |   |   Avtentikacija.jsx
        |   |   IzbrisProfilaC.jsx
        |   |   ObvestiloC.jsx
        |   |   PodatkiUporabnikaC.jsx
        |   |   PrijavaC.jsx
        |   |   ProfilC.jsx
        |   |   RegistracijaC.jsx
        |   |   SpreminjanjeGeslaC.jsx
        |   |   UrejanjeProfilaC.jsx
        |   |
        |   \---pregledi_in_dodajanja
        |           DodajanjeIzdelkovC.jsx
        |           DodajanjeUporabnikovC.jsx
        |           PodrobnostiC.jsx
        |           PregledC.jsx
        |           PregledNarocilC.jsx
        |           PregledPBC.jsx
        |           PregledRacunovC.jsx
        |           TabelskaVrsticaC.jsx
        |
        \---trgovina
                BlagajnaC.jsx
                InformacijeOProduktuC.jsx
                IzdelekVKosariciC.jsx
                KosaricaC.jsx
                NakupovanjeC.jsx
                NavigacijaTrgovineC.jsx
                PrikazProduktovC.jsx
                ProduktC.jsx
                Trgovina.css
                Trgovina.jsx
                VsebinaTrgovineC.jsx

```

</details>

### <u>Struktura mape docs</u>

<details><summary>Slika strukture</summary>

![Struktura korenske mape](/image/sample.png 'This is a sample image.')

</details>
<details><summary>Drevo strukture</summary>

```

Folder PATH listing
Volume serial number is 76B1-AA6C
C:.
    DiagramProgramaZaMaturo.drawio
    DiagramProgramaZaMaturo.drawio.svg
    drevoDocs.txt
    MSračunalništvo.docx
    MSračunalništvo.pdf
    SQLstavkiZacetnaBaza.sql
    SQLzaBazoSPodatki.sql

No subfolders exist


```

</details>

### <u>Struktura mape server</u>

<details><summary>Slika strukture</summary>

![Struktura mape server](/image/sample.png 'This is a sample image.')

</details>
<details><summary>Drevo strukture</summary>

```

Folder PATH listing
Volume serial number is 76B1-AA6C
C:.
|   .env
|   config.js
|   drevoServer.txt
|   index.js
|   package-lock.json
|   package.json
|   povezavaPB.js
|
+---build
|   |   asset-manifest.json
|   |   index.html
|   |   manifest.json
|   |
|   \---static
|       +---css
|       |       main.0fa34192.css
|       |       main.0fa34192.css.map
|       |
|       \---js
|               main.95d331fc.js
|               main.95d331fc.js.LICENSE.txt
|               main.95d331fc.js.map
|
+---node_modules
|   | ...
|
\---routes
    \---api
            administratorApi.js
            avtentikacijaApi.js
            produktiApi.js

```

</details>

---

> Šolski center Novo mesto, SEŠTG, **_april 2023_**

---

<details><summary>React default</summary>

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

</details>
