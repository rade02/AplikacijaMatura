import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import './config.js';
dotenv.config(); // Loads .env file contents into process.env.: https://www.dotenv.org/docs

import produktiApiRoutes from './routes/api/produktiApi.js';
import avtentikacijaApiRoutes from './routes/api/avtentikacijaApi.js';
import administratorApiRoutes from './routes/api/administratorApi.js';

// express: https://www.tutorialandexample.com/express-js-app-listen-function, https://reflectoring.io/express-middleware/
const app = express(); // ustvari express aplikacijo: https://expressjs.com/en/api.html
app.listen(process.env.PORT, () => {
	// za povezovanje in poslušanje povezave na določenem gostitelju in portu(vratih)
	console.log(`Express server is running on port ${process.env.PORT}`);
});
app.use(cors()); // da je naš strežnik dostopen na katerikoli domeni, ki zaprosijo za vir strežnika prek brskalnika: https://stackoverflow.com/questions/46024363/what-does-app-usecors-do
app.use(express.json()); // razčleni zahteve v formatu JSON, temelji na bodyParserju: https://expressjs.com/en/api.html
app.use(express.static('./public')); // za statično oddajanje (root mapa, od koder oddaja statična sredstva): https://expressjs.com/en/starter/static-files.html
// za naslednje link: https://stackoverflow.com/questions/55558402/what-is-the-meaning-of-bodyparser-urlencoded-extended-true-and-bodypar
app.use(bodyParser.json()); // npm modul za procesiranje podatkov, poslanih z HTTP request body: https://www.simplilearn.com/tutorials/nodejs-tutorial/body-parser-in-express-js
app.use(bodyParser.urlencoded({ extended: true })); // enako kot zgoraj, le da za URL kodirane zahteve, vsak tip vrednosti, ne le nizi

app.use(fileUpload()); // za nalaganje datotek (dostopne prek req.files.foo): https://dev.to/divuzki/express-js-file-uploading-using-express-fileupload-42bh
// izbrisi? :https://stackoverflow.com/questions/55692084/what-is-the-difference-between-nodes-bodyparser-and-expresss-urlencoded-middle
app.use(express.urlencoded({ extended: true }));

// products api routes
app.use('/api/produkti', produktiApiRoutes);
app.use('/api/avtentikacija', avtentikacijaApiRoutes);
app.use('/api/administrator', administratorApiRoutes);
