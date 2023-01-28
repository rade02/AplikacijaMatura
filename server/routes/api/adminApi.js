import express from 'express';
const router = express.Router();
import pool from '../../dbConnection.js';

// TDOD: dodajanje zaposlenega 4
// TODO: pregled vseh uporabnikov 0
// TODO: pregled vseh zaposlenih 4 0
// TODO: pregled vseh strank 4 0
// TODO: pregled vseh izdelkov 4 0
// TODO: pregled vseh racunov (le racunovodji) 4 0
// TODO: polje za pisanje sql in btn ter polja za vnos preko vmesnika 0
// TODO: pregled vseh narocil (zraven le id-ji izdelkov) 4 0

router.get('/uporabniki', async (req, res) => {
	try {
		let response = await pool.query(`select * from Uporabniki`);

		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.post('/updtVloga', async (req, res) => {
	const uporabnisko_ime = req.body.uporabnisko_ime;
	const vloga = req.body.vloga;
	try {
		let response = await pool.query(`update Uporabniki set vloga = ? where uporabnisko_ime = ?`, [
			vloga,
			uporabnisko_ime,
		]);

		res.status(200).send('success');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/zaposleni', async (req, res) => {
	try {
		let response = await pool.query(`select * from Stranke_in_zaposleni where oddelek is not null`);
		console.log(response[0]);
		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

export default router;
