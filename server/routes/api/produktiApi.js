import express from 'express';
const router = express.Router();
import pool from '../../dbConnection.js';

router.get('/', async (req, res) => {
	let fetchNumber = parseInt(req.query.number);
	let noDuplicates = req.query.noDups;

	if (noDuplicates !== null && noDuplicates !== undefined) {
		try {
			let newProducts = await pool.query(
				`select * from Izdelki where ID_izdelka not in ? and Izdelki.kosov_na_voljo > 0 order by rand() limit ?`,
				[[noDuplicates], fetchNumber]
			);
			res.status(200).send(newProducts[0]);
		} catch (onRejectedError) {
			console.log(onRejectedError);
			res.status(400).send(`error`);
		}
	} else {
		try {
			let newProducts = await pool.query(
				`select * from Izdelki where Izdelki.kosov_na_voljo > 0 order by rand() limit ?`,
				[fetchNumber]
			);
			res.status(200).send(newProducts[0]);
		} catch (onRejectedError) {
			console.log(onRejectedError);
			res.status(400).send(`error`);
		}
	}
});

router.get('/availability', async (req, res) => {
	let id = req.query.ID_izdelka;

	try {
		let availNumber = await pool.query(`select (kosov_na_voljo) from Izdelki where ID_izdelka = ?`, [id]);
		res.status(200).send(availNumber[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/kategorije', async (req, res) => {
	try {
		let result = await pool.query(
			`select distinct kategorija from Izdelki where Izdelki.kosov_na_voljo > 0`
		);
		res.status(200).send(result[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/filtriranje', async (req, res) => {
	let fetchNumber = parseInt(req.query.number);
	let kategorijeF = req.query.kategorijeF;
	let cenaF = req.query.cenaF;
	let popustF = req.query.popustF;
	let noDuplicates = req.query.noDups;
	let sqlQ = '';
	//'select * from Izdelki where (';
	//let sqlCount = 'select count(*) from Izdelki where ('

	if (kategorijeF !== undefined && kategorijeF.length > 0) {
		sqlQ = sqlQ.concat(
			`Izdelki.kategorija in (${kategorijeF.map((k) => {
				return `'${k}'`;
			})}) and`
		);
	}

	if (cenaF !== undefined && (cenaF.od !== undefined || cenaF.do !== undefined)) {
		sqlQ = sqlQ.concat(' Izdelki.cena_za_kos');
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
		`and Izdelki.popust >= ${popustF} and Izdelki.kosov_na_voljo > 0) order by rand() limit ${fetchNumber};`
	);

	//console.log(sqlQ);
	try {
		let newProducts;
		if (noDuplicates !== null && noDuplicates !== undefined) {
			newProducts = await pool.query(`select * from Izdelki where (ID_izdelka not in ? and ${sqlQ}`, [
				[noDuplicates],
			]);
		} else {
			newProducts = await pool.query(`select * from Izdelki where (${sqlQ}`);
		}
		let steviloProduktov = await pool.query(`select count(*) from Izdelki where (${sqlQ}`);
		//console.log(steviloProduktov[0][0]['count(*)']);
		res.status(200).send({
			produkti: newProducts[0],
			stProduktovKiUstrezajoFiltru: steviloProduktov[0][0]['count(*)'],
		});
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/stVsehProduktov', async (req, res) => {
	try {
		let number = await pool.query(`select distinct count(*) from Izdelki where Izdelki.kosov_na_voljo > 0`);
		res.status(200).send(number[0][0]['count(*)'].toString());
	} catch (onRejectedError) {
		console.log(onRejectedError);
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
		let response3 = await pool.query(
			`insert into Narocila (datum, ID_stranke, opravljeno, imeStranke, priimekStranke, naslovDostave, postnina) values ((select current_date() as cd), ?, default, ?, ?, ?, ?);`,
			[ID_stranke, imeStranke, priimekStranke, naslovDostave, postnina]
		);
		// pridobivanje ID-ja zdajšnjega naročila
		let response22 = await pool.query(
			`select max(ID_narocila) as IDzadnjegaNarocila from Narocila where (ID_stranke = ? or (imeStranke = ? and priimekStranke = ?)) and naslovDostave = ?;`,
			[ID_stranke, imeStranke, priimekStranke, naslovDostave]
		);
		res.status(200).send(response22[0][0].IDzadnjegaNarocila.toString());
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.post('/dodajIzdelkeNarocilu', async (req, res) => {
	const ID_narocila = req.body.ID_narocila;
	const ID_izdelka = req.body.ID_izdelka;
	const kolicina = req.body.kolicina;
	const cena = req.body.cena;

	try {
		let response = await pool.query(`insert into Izdelki_pri_narocilu values (?,?,?,?);`, [
			ID_narocila,
			ID_izdelka,
			kolicina,
			cena,
		]);
		res.status(200).send('update successful');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.post('/zmanjsajZalogo', async (req, res) => {
	const kolicina_kupljeno = req.body.kolicina_kupljeno;
	const ID_izdelka = req.body.ID_izdelka;

	try {
		let response = await pool.query(
			`update Izdelki set kosov_na_voljo = kosov_na_voljo - ? where ID_izdelka = ?`,
			[kolicina_kupljeno, ID_izdelka]
		);
		res.status(200).send('update successful');
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

export default router;
