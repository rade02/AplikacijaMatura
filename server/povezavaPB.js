import { createPool } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

/*
const pool = createPool({
    host:"bslcn3pylkyxv1docb7q-mysql.services.clever-cloud.com",
    port:"3306",
    user:"uciyy3tstbtbhub0",
    password:"dSQZtLkoszCQzEWq927c",  //password
    database:"bslcn3pylkyxv1docb7q",
    connectionLimit: 10,
})*/
const pool = createPool({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD, //password
	database: process.env.DB_NAME,
	connectionLimit: 10,
	dateStrings: true,
});

export default pool.promise();
