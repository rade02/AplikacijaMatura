import express from 'express';
const router = express.Router();
import pool from '../../dbConnection.js';

router.get('/', async (req, res) => {
	const un = req.query.username;
	const pw = req.query.password;

	try {
		let dbPassword = await pool.query(`select geslo from Uporabniki where uporabnisko_ime = ?`, [un]);

		if (dbPassword[0].length > 0 && pw === dbPassword[0][0].geslo) {
			res.status(200).send(true);
		} else {
			res.status(200).send(false);
		}
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

// TODO: if error then do not insert

router.get('/user', async (req, res) => {
	const un = req.query.username;

	try {
		let userDataArray = await pool.query(
			`select uporabnisko_ime, elektronski_naslov, ime, priimek, ulica_in_hisna_stevilka, kraj, postna_stevilka, podjetje from Stranke_in_zaposleni where uporabnisko_ime = ?`,
			[un]
		);
		userDataArray = userDataArray[0][0];
		res.status(200).send(userDataArray);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/email', async (req, res) => {
	const em = req.query.email;

	try {
		let userDataArray = await pool.query(
			`select ID_stranke from Stranke_in_zaposleni where elektronski_naslov = ?`,
			[em]
		);
		userDataArray = userDataArray[0][0];
		res.status(200).send(userDataArray);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.post('/updt', async (req, res) => {
	const updatedUser = req.body;
	try {
		let response = await pool.query(
			`update Stranke_in_zaposleni set ime = ?, priimek = ?, ulica_in_hisna_stevilka = ?, kraj = ?, postna_stevilka = ?, telefonska_stevilka = ?, podjetje = ?
			 where uporabnisko_ime = ?;`,
			[
				updatedUser.ime,
				updatedUser.priimek,
				updatedUser.ulica_in_hisna_stevilka,
				updatedUser.kraj,
				updatedUser.postna_stevilka,
				updatedUser.telefonska_stevilka,
				updatedUser.podjetje,
				updatedUser.uporabnisko_ime,
			]
		);
		res.status(200).send('update successful');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.post('/pwdUpdt', async (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	try {
		let response = await pool.query(`update Uporabniki set geslo = ? where uporabnisko_ime = ?`, [
			password,
			username,
		]);
		res.status(200).send('update successful');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.post('/newUser', async (req, res) => {
	console.log(process.env.DB_name);
	const uporabnisko_ime = req.body.uporabnisko_ime;
	const geslo = req.body.geslo;
	const elektronski_naslov = req.body.elektronski_naslov;
	const ime = req.body.ime;
	const priimek = req.body.priimek;
	const ulica_in_hisna_stevilka = req.body.ulica_in_hisna_stevilka;
	const kraj = req.body.kraj;
	const postna_stevilka = req.body.postna_stevilka;
	const telefonska_stevilka = req.body.telefonska_stevilka;
	const podjetje = req.body.podjetje;
	try {
		let response = await pool.query(`insert into Uporabniki (uporabnisko_ime, geslo) values (?, ?)`, [
			uporabnisko_ime,
			geslo,
		]);
		let response2 = await pool.query(
			`insert into Stranke_in_zaposleni (uporabnisko_ime, elektronski_naslov, ime, priimek, ulica_in_hisna_stevilka, kraj, postna_stevilka, telefonska_stevilka, podjetje) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
			[
				uporabnisko_ime,
				elektronski_naslov,
				ime,
				priimek,
				ulica_in_hisna_stevilka,
				kraj,
				postna_stevilka,
				telefonska_stevilka,
				podjetje,
			]
		);
		res.status(200).send('insertion successful');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.delete('/del', async (req, res) => {
	const username = req.query.username;
	try {
		let response = await pool.query(`delete from Uporabniki where uporabnisko_ime = ?`, [username]);

		res.status(200).send('deletion successful');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/vloga', async (req, res) => {
	const username = req.query.uporabnisko_ime;
	try {
		let response = await pool.query(`select vloga from Uporabniki where uporabnisko_ime = ?`, [username]);

		res.status(200).send(response[0][0].vloga.toString());
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});
router.post('/vloga', async (req, res) => {
	const username = req.body.uporabnisko_ime;
	try {
		let response = await pool.query(`update Uporabniki set vloga = 2 where uporabnisko_ime = ?`, [username]);

		res.status(200).send('Ponovno poskusite s prijavo');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`server error`);
	}
});

export default router;
