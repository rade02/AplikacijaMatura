import express from 'express';
const router = express.Router();
import pool from '../../povezavaPB.js';

router.get('/uporabniki', async (req, res) => {
	try {
		let odziv = await pool.query(`select * from Uporabniki`);

		res.status(200).send(odziv[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/posodobiVlogo', async (req, res) => {
	const uporabnisko_ime = req.body.uporabnisko_ime;
	const vloga = req.body.vloga;

	try {
		await pool.query(`update Uporabniki set vloga = ? where uporabnisko_ime = ?`, [vloga, uporabnisko_ime]);

		res.status(200).send('uspešna operacija');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/omogoci', async (req, res) => {
	const uporabnisko_ime = req.body.uporabnisko_ime;
	const omogoci = req.body.omogoci;

	try {
		await pool.query(`update Uporabniki set omogocen = ? where uporabnisko_ime = ?`, [
			omogoci,
			uporabnisko_ime,
		]);

		res.status(200).send('uspešna operacija');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

// pregled
router.get('/osebe', async (req, res) => {
	const kriterij = req.query.iskalniKriterij;
	const niz = req.query.iskalniNiz;

	try {
		let odziv = await pool.query(`select * from Stranke_in_zaposleni where ${kriterij} = ?`, [niz]);

		res.status(200).send(odziv[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error ${napaka.sqlMessage}`);
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
	//console.log(sql);
	try {
		let odziv = await pool.query(sql, [niz]);

		res.status(200).send(odziv[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/izdelki', async (req, res) => {
	const kriterij = req.query.iskalniKriterij;
	const niz = req.query.iskalniNiz;

	try {
		let odziv = await pool.query(`select * from Izdelki where ${kriterij} = ?`, [niz]);

		res.status(200).send(odziv[0]);
	} catch (napaka) {
		console.log(napaka);
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

	try {
		let odziv = await pool.query(sql, [niz]);
		res.status(200).send(odziv[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/izdelkiPriNarocilu', async (req, res) => {
	const ID_narocila = req.query.ID_narocila;

	try {
		let odziv = await pool.query(`select * from Izdelki_pri_narocilu where ID_narocila = ?`, [ID_narocila]);

		if (odziv[0].length > 0) {
			let izdelki = [];
			for (let i = 0; i < odziv[0].length; i++) {
				izdelki[i] = odziv[0][i].ID_izdelka;
			}
			let odziv2 = await pool.query(`select ID_izdelka,ime from Izdelki where ID_izdelka in (?)`, [
				izdelki,
			]);

			res.status(200).send({ podatkiOIzdelkih: odziv[0], imenaIzdelkov: odziv2[0] });
		} else {
			res.status(200).send({ podatkiOIzdelkih: null, imenaIzdelkov: null });
		}
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/PBzacetna', async (req, res) => {
	try {
		let odziv = await pool.query(`show tables;`);

		res.status(200).send(odziv[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/PB', async (req, res) => {
	const poizvedba = req.query.poizvedba;

	try {
		let odziv = await pool.query(`${poizvedba}`);
		res.status(200).send({ data: odziv[0], keys: Object.keys(odziv[0][0]) });
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/idUporabnika', async (req, res) => {
	const uporabnisko_ime = req.query.uporabnisko_ime;

	try {
		let odziv = await pool.query(`select ID from Stranke_in_zaposleni where uporabnisko_ime = ?`, [
			uporabnisko_ime,
		]);
		res.status(200).send(odziv[0][0].ID.toString());
	} catch (napaka) {
		console.log(napaka);
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

	const hash = global.config.cyrb53Hash(geslo, global.config.seed + 53).toString();

	try {
		await pool.query(`insert into Uporabniki values (?,?,?,?)`, [uporabnisko_ime, hash, vloga, omogocen]);
		await pool.query(`insert into Stranke_in_zaposleni values (default,?,?,?,?,?,?,?,?,?,?,?)`, [
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
		]);

		res.status(200).send('uspešna operacija');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/dodajIzdelek', async (req, res) => {
	const ime = req.body.ime;
	const kategorija = req.body.kategorija;
	const cena_za_kos = parseFloat(req.body.cena_za_kos).toFixed(2);
	const kosov_na_voljo = parseInt(req.body.kosov_na_voljo);
	const kratek_opis = req.body.kratek_opis === 'null' ? null : req.body.kratek_opis;
	const informacije = req.body.informacije === 'null' ? null : req.body.informacije;
	const popust = parseInt(req.body.popust);

	let slika = null;
	//console.log(req.files);
	if (req.files !== null && req.files.slika !== null && req.files.slika.data !== null) {
		slika = req.files.slika.data;
	}
	//console.log(slika);

	try {
		await pool.query(`insert into Izdelki values (default,?,?,?,?,?,?,?,?)`, [
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
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

// urejanje
router.post('/urediPlaco', async (req, res) => {
	const novaPlaca = req.body.novaPlaca;
	const uporabnisko_ime = req.body.uporabnisko_ime;

	try {
		await pool.query(`update Stranke_in_zaposleni set placa = ? where uporabnisko_ime = ?;`, [
			novaPlaca,
			uporabnisko_ime,
		]);

		res.status(200).send('uspešna operacija');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});
router.post('/urediOddelek', async (req, res) => {
	const noviOddelek = req.body.noviOddelek;
	const uporabnisko_ime = req.body.uporabnisko_ime;

	try {
		await pool.query(`update Stranke_in_zaposleni set oddelek = ? where uporabnisko_ime = ?;`, [
			noviOddelek,
			uporabnisko_ime,
		]);

		res.status(200).send('uspešna operacija');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/urediIzdelek', async (req, res) => {
	const izdelek = req.body.izdelek;

	try {
		await pool.query(
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
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/urediNarocilo', async (req, res) => {
	const ID_narocila = req.body.ID_narocila;

	try {
		await pool.query(`update Narocila set opravljeno = true where ID_narocila = ?;`, [ID_narocila]);

		res.status(200).send('uspešna operacija');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/izdajRacun', async (req, res) => {
	const ID_narocila = req.body.ID_narocila;
	const kupec = req.body.kupec;
	const datumIzdaje = req.body.datumIzdaje;

	try {
		let odziv1 = await pool.query(`select * from Izdelki_pri_narocilu where ID_narocila = ?`, [ID_narocila]);
		let kosarica = odziv1[0];
		let skupnaCena = 0;
		kosarica.forEach((izdelek) => {
			skupnaCena += parseFloat(izdelek.kolicina) * parseFloat(izdelek.cena);
		});

		let odziv2 = await pool.query(`select postnina from Narocila where ID_narocila = ?`, [ID_narocila]);
		skupnaCena += odziv2[0][0].postnina;

		await pool.query(`insert into Racuni (ID_narocila, kupec, za_placilo, datumIzdaje) values (?,?,?,?);`, [
			ID_narocila,
			kupec,
			skupnaCena.toFixed(2),
			datumIzdaje,
		]);

		res.status(200).send('uspešna operacija');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/racuniUporabnika', async (req, res) => {
	const uporabnisko_ime = req.query.uporabnisko_ime;

	try {
		let odziv = await pool.query(
			`select * from Racuni where ID_narocila in 
			(select ID_narocila from Narocila where ID_stranke = 
			(select ID from Stranke_in_zaposleni where uporabnisko_ime = ?));`,
			[uporabnisko_ime]
		);

		res.status(200).send(odziv[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/pridobiSliko', async (req, res) => {
	try {
		if (req.query.ID_izdelka !== undefined && req.query.ID_izdelka !== null) {
			let odziv = await pool.query(`select slika from Izdelki where ID_izdelka = ?;`, [
				req.query.ID_izdelka,
			]);

			if (odziv[0][0].slika !== undefined) {
				res.status(200).send(odziv[0][0].slika);
			}
		} else {
			res.status(200).send('uspešna operacija');
		}
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/naloziSliko', async (req, res) => {
	const ID_izdelka = parseInt(req.body.ID_izdelka);
	let slika = null;
	if (req.files !== null && req.files.slika !== null && req.files.slika.data !== null) {
		slika = req.files.slika.data;
	}

	try {
		await pool.query(`update Izdelki set slika = (?) where ID_izdelka = ?`, [slika, ID_izdelka]);

		res.status(200).send('uspešna operacija');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/izbrisiElement', async (req, res) => {
	const DB = req.body.DB;
	const IDtip = req.body.IDtip;
	const ID = req.body.ID;

	try {
		let odziv1 = await pool.query(`delete from ${DB} where ${IDtip} = ?`, [ID]);

		res.status(200).send('uspešna operacija');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

export default router;
