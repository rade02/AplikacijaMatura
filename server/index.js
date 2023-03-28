import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import './config.js';
dotenv.config();

import produktiApiRoutes from './routes/api/produktiApi.js';
import avtentikacijaApiRoutes from './routes/api/avtentikacijaApi.js';
import administratorApiRoutes from './routes/api/administratorApi.js';

const app = express();
app.listen(process.env.PORT, () => {
	console.log(`Express server is running on port ${process.env.PORT}`);
});
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// products api routes
app.use('/api/produkti', produktiApiRoutes);
app.use('/api/avtentikacija', avtentikacijaApiRoutes);
app.use('/api/administrator', administratorApiRoutes);
