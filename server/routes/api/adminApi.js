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

router.get('/osebe', async (req, res) => {
	const kriterij = req.query.iskalniKriterij;
	const niz = req.query.iskalniNiz;

	try {
		let response = await pool.query(`select * from Stranke_in_zaposleni where ${kriterij} = ?`, [niz]);

		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error ${onRejectedErrorsqlMessage}`);
	}
});

router.post('/omogoci', async (req, res) => {
	const uporabnisko_ime = req.body.uporabnisko_ime;
	const omogoci = req.body.omogoci;
	try {
		let response = await pool.query(`update Uporabniki set omogocen = ? where uporabnisko_ime = ?`, [
			omogoci,
			uporabnisko_ime,
		]);

		res.status(200).send('success');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

/*router.get('/vloge', async (req, res) => {

	try {
		let response = await pool.query(`select * from Stranke_in_zaposleni where ${kriterij} = ?`, [niz]);

		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error ${onRejectedErrorsqlMessage}`);
	}
});*/

router.post('/dodajUporabnika', async (req, res) => {
	const uporabnisko_ime = req.body.uporabnisko_ime;
	const geslo = req.body.geslo;
	const vloga = req.body.vloga;
	const omogocen = req.body.omogocen;
	const elektronski_naslov = req.body.elektronski_naslov;
	const ime = req.body.ime;
	const priimek = req.body.priimek;
	const ulica_in_hisna_stevilka = req.body.ulica_in_hisna_stevilka;
	const kraj = req.body.kraj;
	const postna_stevilka = req.body.postna_stevilka;
	const telefonska_stevilka = req.body.telefonska_stevilka;
	const podjetje = req.body.podjetje;
	const oddelek = req.body.oddelek;
	const placa = req.body.placa;

	try {
		let response = await pool.query(`insert into Uporabniki values (?,?,?,?)`, [
			uporabnisko_ime,
			geslo,
			vloga,
			omogocen,
		]);
		let response2 = await pool.query(
			`insert into Stranke_in_zaposleni values ('default',?,?,?,?,?,?,?,?,?,?,?)`,
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
				oddelek,
				placa,
			]
		);

		res.status(200).send('uspešna operacija');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

export default router;
