import express from 'express';
const router = express.Router();
import pool from '../../dbConnection.js';
import multer from 'multer';

/*var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, '/filepath');
	},

	filename: function (req, file, cb) {
		let filename = 'filenametogive';
		req.body.file = filename;

		cb(null, filename);
	},
});
const upload = multer({ storage: storage, limits: { fieldSize: 10 * 1024 * 1024 } });

const upload = multer({ dest: 'images/' });
router.post('/api/images', upload.single('image'), (req, res) => {
	// 4
	const imageName = req.file.filename;
	const description = req.body.description;

	// Save this data to a database probably

	console.log(req.file);
	console.log(description, imageName);
	res.send({ description, imageName });
});
*/
//https://morioh.com/p/d6bd1ff174c8

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
	/*console.log('kriterij');
	console.log(kriterij);
	console.log(niz);*/

	try {
		let response = await pool.query(`select * from Racuni where ${kriterij} = ?`, [niz]);

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
	/*console.log('kriterij');
	console.log(kriterij);
	console.log(niz);*/

	let sql = `select * from Narocila where ${kriterij} = '${niz}'`;
	//console.log(sql);
	//`select * from Narocila where ${kriterij} = ?`
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

router.post('/dodajIzdelek', upload.single('slikaProdukta'), async (req, res) => {
	const ime = req.body.ime;
	const kategorija = req.body.kategorija;
	const cena_za_kos = req.body.cena_za_kos;
	const kosov_na_voljo = req.body.kosov_na_voljo;
	const kratek_opis = req.body.kratek_opis;
	const informacije = req.body.informacije;
	const popust = req.body.popust;
	const slika = req.file; //.buffer.toString('base64');

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

export default router;
