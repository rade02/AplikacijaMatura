import express from 'express';
const router = express.Router();
import pool from '../../povezavaPB.js';

router.get('/', async (req, res) => {
	const uporabnisko_ime = req.query.uporabnisko_ime;
	const geslo = req.query.geslo;

	const hash = global.config.cyrb53Hash(geslo, global.config.seed + 53).toString();

	try {
		let odziv = await pool.query(`select geslo, omogocen from Uporabniki where binary uporabnisko_ime = ?`, [
			// binary omogoči case sensitive query ker primerja po bajtih
			uporabnisko_ime,
		]);

		if (odziv[0].length > 0 && hash === odziv[0][0].geslo) {
			res.status(200).send(hash);
		} else {
			res.status(200).send(false);
		}
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/uporabnik', async (req, res) => {
	const uporabnisko_ime = req.query.uporabnisko_ime;

	try {
		let tabelaPodatkovUporabnika = await pool.query(
			`select uporabnisko_ime, elektronski_naslov, ime, priimek, ulica_in_hisna_stevilka, kraj, postna_stevilka, podjetje from Stranke_in_zaposleni where uporabnisko_ime = ?`,
			[uporabnisko_ime]
		);
		tabelaPodatkovUporabnika = tabelaPodatkovUporabnika[0][0];
		res.status(200).send(tabelaPodatkovUporabnika);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/elektronski_naslov', async (req, res) => {
	const elektronski_naslov = req.query.elektronski_naslov;

	try {
		let tabelaPodatkovUporabnika = await pool.query(
			`select ID from Stranke_in_zaposleni where elektronski_naslov = ?`,
			[elektronski_naslov]
		);
		tabelaPodatkovUporabnika = tabelaPodatkovUporabnika[0][0];
		res.status(200).send(tabelaPodatkovUporabnika);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/posodobitev', async (req, res) => {
	const posodobljenUporabnik = req.body;
	try {
		await pool.query(
			`update Stranke_in_zaposleni set ime = ?, priimek = ?, ulica_in_hisna_stevilka = ?, kraj = ?, postna_stevilka = ?, telefonska_stevilka = ?, podjetje = ?
			 where uporabnisko_ime = ?;`,
			[
				posodobljenUporabnik.ime,
				posodobljenUporabnik.priimek,
				posodobljenUporabnik.ulica_in_hisna_stevilka,
				posodobljenUporabnik.kraj,
				posodobljenUporabnik.postna_stevilka,
				posodobljenUporabnik.telefonska_stevilka,
				posodobljenUporabnik.podjetje,
				posodobljenUporabnik.uporabnisko_ime,
			]
		);
		res.status(200).send('operacija uspešna');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/posodobitevGesla', async (req, res) => {
	const uporabnisko_ime = req.query.uporabnisko_ime;
	const geslo = req.query.geslo;

	const hash = global.config.cyrb53Hash(geslo, global.config.seed + 53).toString();
	console.log(hash);
	try {
		await pool.query(`update Uporabniki set geslo = ? where uporabnisko_ime = ?`, [hash, uporabnisko_ime]);
		res.status(200).send(hash);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/novUporabnik', async (req, res) => {
	const uporabnisko_ime = req.body.uporabnisko_ime;
	const geslo = global.config.cyrb53Hash(req.body.geslo, global.config.seed + 53);
	const elektronski_naslov = req.body.elektronski_naslov;
	const ime = req.body.ime;
	const priimek = req.body.priimek;
	const ulica_in_hisna_stevilka = req.body.ulica_in_hisna_stevilka;
	const kraj = req.body.kraj;
	const postna_stevilka = req.body.postna_stevilka;
	const telefonska_stevilka = req.body.telefonska_stevilka;
	const podjetje = req.body.podjetje;

	try {
		await pool.query(`insert into Uporabniki (uporabnisko_ime, geslo) values (?, ?)`, [
			uporabnisko_ime,
			geslo,
		]);
		await pool.query(
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
		res.status(200).send('operacija uspešna');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.delete('/izbrisi', async (req, res) => {
	const uporabnisko_ime = req.query.uporabnisko_ime;

	try {
		await pool.query(`delete from Uporabniki where uporabnisko_ime = ?`, [uporabnisko_ime]);

		res.status(200).send('operacija uspešna');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/vloga', async (req, res) => {
	const uporabnisko_ime = req.query.uporabnisko_ime;

	try {
		let odziv = await pool.query(`select vloga from Uporabniki where uporabnisko_ime = ?`, [
			uporabnisko_ime,
		]);

		res.status(200).send(odziv[0][0].vloga.toString());
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

export default router;
