import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const router = express.Router();

import pool from './dbConnection.js';
import productsApiRoutes from './routes/api/productsApi.js';
import loginApiRoutes from './routes/api/loginApi.js';
import adminApiRoutes from './routes/api/adminApi.js';

const app = express();
app.listen(process.env.PORT, () => {
	console.log(`Express server is running on port ${process.env.PORT}`);
});
app.use(cors());
app.use(express.json());
app.use('/images', express.static('images'));

// products api routes
app.use('/api/products', productsApiRoutes);
app.use('/api/login', loginApiRoutes);
app.use('/api/admin', adminApiRoutes);
