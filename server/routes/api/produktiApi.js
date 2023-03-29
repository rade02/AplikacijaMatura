import express from 'express';
const router = express.Router();
import pool from '../../povezavaPB.js';

router.get('/', async (req, res) => {
	let steviloIzdelkov = parseInt(req.query.steviloIzdelkov);
	let brezPodvajanja = req.query.brezPodvajanja;

	if (brezPodvajanja !== null && brezPodvajanja !== undefined) {
		try {
			let noviProdukti = await pool.query(
				`select * from Izdelki where ID_izdelka not in ? and Izdelki.kosov_na_voljo > 0 order by rand() limit ?`,
				[[brezPodvajanja], steviloIzdelkov]
			);
			res.status(200).send(noviProdukti[0]);
		} catch (napaka) {
			console.log(napaka);
			res.status(400).send(`error`);
		}
	} else {
		try {
			let noviProdukti = await pool.query(
				`select * from Izdelki where Izdelki.kosov_na_voljo > 0 order by rand() limit ?`,
				[steviloIzdelkov]
			);
			res.status(200).send(noviProdukti[0]);
		} catch (napaka) {
			console.log(napaka);
			res.status(400).send(`error`);
		}
	}
});

router.get('/naVoljo', async (req, res) => {
	let id = req.query.ID_izdelka;

	try {
		let steviloNaVoljo = await pool.query(`select (kosov_na_voljo) from Izdelki where ID_izdelka = ?`, [id]);
		res.status(200).send(steviloNaVoljo[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/kategorije', async (req, res) => {
	try {
		let rezultat = await pool.query(
			`select distinct kategorija from Izdelki where Izdelki.kosov_na_voljo > 0`
		);
		res.status(200).send(rezultat[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/filtriranje', async (req, res) => {
	let steviloIzdelkov = parseInt(req.query.steviloIzdelkov);
	let kategorijeF = req.query.kategorijeF;
	let cenaF = req.query.cenaF;
	let popustF = req.query.popustF;
	let brezPodvajanj = req.query.brezPodvajanj;
	let sqlQ = '';
	//console.log(steviloIzdelkov + ' ' + kategorijeF + ' ' + cenaF + ' ' + popustF + ' ' + brezPodvajanj);

	if (kategorijeF !== undefined && kategorijeF.length > 0) {
		sqlQ = sqlQ.concat(
			`Izdelki.kategorija in (${kategorijeF.map((k) => {
				return `'${k}'`;
			})}) and`
		);
	}

	if (cenaF !== undefined && (cenaF.od !== undefined || cenaF.do !== undefined)) {
		sqlQ = sqlQ.concat(' Izdelki.cena_za_kos * (1.0 - Izdelki.popust / 100.0)');
		if (cenaF.od !== undefined && cenaF.do !== undefined) {
			sqlQ = sqlQ.concat(` between ${cenaF.od} and ${cenaF.do} `);
		} else if (cenaF.od === undefined) {
			sqlQ = sqlQ.concat(` <= ${cenaF.do} `);
		} else if (cenaF.do === undefined) {
			sqlQ = sqlQ.concat(` >= ${cenaF.od} `);
		}
	} else {
		sqlQ = sqlQ.concat(' (1 = 1) ');
	}
	sqlQ = sqlQ.concat(
		`and Izdelki.popust >= ${popustF} and Izdelki.kosov_na_voljo > 0) order by rand() limit ${steviloIzdelkov};`
	);

	//console.log(sqlQ);
	try {
		let noviProdukti;
		if (brezPodvajanj !== null && brezPodvajanj !== undefined) {
			noviProdukti = await pool.query(`select * from Izdelki where (ID_izdelka not in ? and ${sqlQ}`, [
				[brezPodvajanj],
			]);
		} else {
			noviProdukti = await pool.query(`select * from Izdelki where (${sqlQ}`);
		}
		let steviloProduktov = await pool.query(`select count(*) from Izdelki where (${sqlQ}`);
		//console.log(steviloProduktov[0][0]['count(*)']);
		//console.log(noviProdukti[0]);
		res.status(200).send({
			produkti: noviProdukti[0],
			stProduktovKiUstrezajoFiltru: steviloProduktov[0][0]['count(*)'],
		});
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/stVsehProduktov', async (req, res) => {
	try {
		let stevilo = await pool.query(`select distinct count(*) from Izdelki where Izdelki.kosov_na_voljo > 0`);
		res.status(200).send(stevilo[0][0]['count(*)'].toString());
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/ustvariNarocilo', async (req, res) => {
	const ID_stranke = req.query.ID_stranke;
	const imeStranke = req.query.imeStranke;
	const priimekStranke = req.query.priimekStranke;
	const naslovDostave = req.query.naslovDostave;
	const postnina = req.query.postnina;

	try {
		// dodajanje naročila
		await pool.query(
			`insert into Narocila (datum, ID_stranke, opravljeno, imeStranke, priimekStranke, naslovDostave, postnina) values ((select current_date() as cd), ?, default, ?, ?, ?, ?);`,
			[ID_stranke, imeStranke, priimekStranke, naslovDostave, postnina]
		);
		// pridobivanje ID-ja zdajšnjega naročila
		let response22 = await pool.query(
			`select max(ID_narocila) as IDzadnjegaNarocila from Narocila where (ID_stranke = ? or (imeStranke = ? and priimekStranke = ?)) and naslovDostave = ?;`,
			[ID_stranke, imeStranke, priimekStranke, naslovDostave]
		);
		res.status(200).send(response22[0][0].IDzadnjegaNarocila.toString());
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/dodajIzdelkeNarocilu', async (req, res) => {
	const ID_narocila = req.body.ID_narocila;
	const ID_izdelka = req.body.ID_izdelka;
	const kolicina = req.body.kolicina;
	const cena = req.body.cena;

	try {
		await pool.query(`insert into Izdelki_pri_narocilu values (?,?,?,?);`, [
			ID_narocila,
			ID_izdelka,
			kolicina,
			cena,
		]);
		res.status(200).send('operacija uspešna');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.post('/zmanjsajZalogo', async (req, res) => {
	const kolicina_kupljeno = req.body.kolicina_kupljeno;
	const ID_izdelka = req.body.ID_izdelka;

	try {
		await pool.query(`update Izdelki set kosov_na_voljo = kosov_na_voljo - ? where ID_izdelka = ?`, [
			kolicina_kupljeno,
			ID_izdelka,
		]);
		res.status(200).send('operacija uspešna');
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/izdelki', async (req, res) => {
	const iskalniNiz = req.query.iskalniNiz;

	try {
		let rezultat = await pool.query(
			`select ime from Izdelki where ime like '%${iskalniNiz}%' and kosov_na_voljo > 0 order by ime desc limit 6;`
		);
		//console.log(rezultat[0]);
		res.status(200).send(rezultat[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

router.get('/iskaniIzdelek', async (req, res) => {
	const ime = req.query.ime;

	try {
		let rezultat = await pool.query(`select * from Izdelki where ime = ? and kosov_na_voljo > 0;`, [ime]);
		//console.log(rezultat[0]);
		res.status(200).send(rezultat[0]);
	} catch (napaka) {
		console.log(napaka);
		res.status(400).send(`error`);
	}
});

export default router;
