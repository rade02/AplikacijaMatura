import { createPool } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = createPool({
	host: process.env.PB_HOST,
	port: process.env.PB_PORT,
	user: process.env.PB_UPORABNIK,
	password: process.env.PB_GESLO,
	database: process.env.PB_IME,
	connectionLimit: 10,
	dateStrings: true,
});

export default pool.promise();
