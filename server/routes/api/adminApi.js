import express from 'express';
const router = express.Router();
import pool from '../../dbConnection.js';
import multer from 'multer';

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

// pregled
router.get('/osebe', async (req, res) => {
	const kriterij = req.query.iskalniKriterij;
	const niz = req.query.iskalniNiz;

	try {
		let response = await pool.query(`select * from Stranke_in_zaposleni where ${kriterij} = ?`, [niz]);

		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error ${onRejectedError.sqlMessage}`);
	}
});

router.get('/racuni', async (req, res) => {
	const kriterij = req.query.iskalniKriterij;
	const niz = req.query.iskalniNiz;
	const razvrscanje_po = req.query.razvrscanje_po;
	const razvrscanje_razvrsti = req.query.razvrscanje_razvrsti;
	let sql;
	if (razvrscanje_po === undefined || razvrscanje_po === null) {
		sql = `select * from Racuni where ${kriterij} = '${niz}'`;
	} else {
		sql = `select * from Racuni where ${kriterij} = '${niz}' order by ${razvrscanje_po} ${razvrscanje_razvrsti}`;
	}
	console.log(sql);
	try {
		let response = await pool.query(sql, [niz]);

		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/izdelki', async (req, res) => {
	const kriterij = req.query.iskalniKriterij;
	const niz = req.query.iskalniNiz;

	try {
		let response = await pool.query(`select * from Izdelki where ${kriterij} = ?`, [niz]);

		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/narocila', async (req, res) => {
	const kriterij = req.query.iskalniKriterij;
	const niz = req.query.iskalniNiz;
	const razvrscanje_po = req.query.razvrscanje_po;
	const razvrscanje_razvrsti = req.query.razvrscanje_razvrsti;
	let sql;

	if (razvrscanje_po === undefined || razvrscanje_po === null) {
		sql = `select * from Narocila where ${kriterij} = '${niz}'`;
	} else {
		sql = `select * from Narocila where ${kriterij} = '${niz}' order by ${razvrscanje_po} ${razvrscanje_razvrsti}`;
	}
	//console.log(sql);
	try {
		let response = await pool.query(sql, [niz]);
		//console.log(response[0]);
		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/izdelkiPriNarocilu', async (req, res) => {
	const ID_narocila = req.query.ID_narocila;

	try {
		let response = await pool.query(`select * from Izdelki_pri_narocilu where ID_narocila = ?`, [
			ID_narocila,
		]);
		//console.log(response[0]);

		if (response[0].length > 0) {
			let izdelki = [];
			for (let i = 0; i < response[0].length; i++) {
				izdelki[i] = response[0][i].ID_izdelka;
			}
			let response2 = await pool.query(`select ID_izdelka,ime from Izdelki where ID_izdelka in (?)`, [
				izdelki,
			]);
			//console.log(response2[0]);

			res.status(200).send({ podatkiOIzdelkih: response[0], imenaIzdelkov: response2[0] });
		} else {
			res.status(200).send({ podatkiOIzdelkih: null, imenaIzdelkov: null });
		}
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/PBzacetna', async (req, res) => {
	try {
		let response = await pool.query(`show tables;`);

		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/PB', async (req, res) => {
	const poizvedba = req.query.poizvedba;

	try {
		let response = await pool.query(`${poizvedba}`);
		//console.log(Object.keys(response[0][0]));
		res.status(200).send({ data: response[0], keys: Object.keys(response[0][0]) });
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/idUporabnika', async (req, res) => {
	const uporabnisko_ime = req.query.uporabnisko_ime;

	try {
		let response = await pool.query(`select ID from Stranke_in_zaposleni where uporabnisko_ime = ?`, [
			uporabnisko_ime,
		]);
		res.status(200).send(response[0][0].ID.toString());
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

// dodajanje
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
			`insert into Stranke_in_zaposleni values (default,?,?,?,?,?,?,?,?,?,?,?)`,
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

router.post('/dodajIzdelek', async (req, res) => {
	const ime = req.body.ime;
	const kategorija = req.body.kategorija;
	const cena_za_kos = parseFloat(req.body.cena_za_kos);
	const kosov_na_voljo = parseInt(req.body.kosov_na_voljo);
	const kratek_opis = req.body.kratek_opis === 'null' ? null : req.body.kratek_opis;
	const informacije = req.body.informacije === 'null' ? null : req.body.informacije;
	const popust = parseInt(req.body.popust);
	//console.log(req.files);
	const slika = req.files.slika.data === 'null' ? null : req.files.slika.data;

	try {
		let response = await pool.query(`insert into Izdelki values (default,?,?,?,?,?,?,?,?)`, [
			ime,
			kategorija,
			cena_za_kos,
			kosov_na_voljo,
			kratek_opis,
			informacije,
			popust,
			slika,
		]);

		res.status(200).send('uspešna operacija');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

// urejanje
router.post('/urediPlaco', async (req, res) => {
	const novaPlaca = req.body.novaPlaca;
	const uporabnisko_ime = req.body.uporabnisko_ime;

	try {
		let response = await pool.query(`update Stranke_in_zaposleni set placa = ? where uporabnisko_ime = ?;`, [
			novaPlaca,
			uporabnisko_ime,
		]);

		res.status(200).send('uspešna operacija');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.post('/urediIzdelek', async (req, res) => {
	const izdelek = req.body.izdelek;

	try {
		let response = await pool.query(
			`update Izdelki set ime = ?, kategorija = ?, cena_za_kos = ?, kosov_na_voljo = ?, kratek_opis = ?, informacije = ?, popust = ? where ID_izdelka = ?;`,
			[
				izdelek.ime,
				izdelek.kategorija,
				izdelek.cena_za_kos,
				izdelek.kosov_na_voljo,
				izdelek.kratek_opis,
				izdelek.informacije,
				izdelek.popust,
				izdelek.ID_izdelka,
			]
		);

		res.status(200).send('uspešna operacija');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.post('/urediNarocilo', async (req, res) => {
	const ID_narocila = req.body.ID_narocila;

	try {
		let response = await pool.query(`update Narocila set opravljeno = true where ID_narocila = ?;`, [
			ID_narocila,
		]);

		res.status(200).send('uspešna operacija');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.post('/izdajRacun', async (req, res) => {
	const ID_narocila = req.body.ID_narocila;
	const kupec = req.body.kupec;
	const placano = req.body.placano;

	try {
		let response1 = await pool.query(`select * from Izdelki_pri_narocilu where ID_narocila = ?`, [
			ID_narocila,
		]);
		let kosarica = response1[0];
		let skupnaCena = 0;
		kosarica.forEach((izdelek) => {
			skupnaCena += parseFloat(izdelek.kolicina) * parseFloat(izdelek.cena);
		});

		let response = await pool.query(
			`insert into Racuni (ID_narocila, kupec, za_placilo, placano) values (?,?,?,?);`,
			[ID_narocila, kupec, skupnaCena.toFixed(2), placano]
		);

		res.status(200).send('uspešna operacija');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/racuniUporabnika', async (req, res) => {
	const uporabnisko_ime = req.query.uporabnisko_ime;

	try {
		let response = await pool.query(
			`select * from Racuni where ID_narocila in 
			(select ID_narocila from Narocila where ID_stranke = 
			(select ID from Stranke_in_zaposleni where uporabnisko_ime = ?));`,
			[uporabnisko_ime]
		);
		console.log(response[0]);
		res.status(200).send(response[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/pridobiSliko', async (req, res) => {
	console.log('pridobivanje slike...');
	try {
		let response = await pool.query(`select slika from Izdelki where ID_izdelka = 37;`);
		console.log(response[0][0].slika);

		res.status(200).send(response[0][0].slika);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

export default router;
