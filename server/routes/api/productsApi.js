import express from 'express';
const router = express.Router();
import pool from '../../dbConnection.js';

router.get('/', async (req, res) => {
	let fetchNumber = parseInt(req.query.number);
	let noDuplicates = req.query.noDups;

	if (noDuplicates !== null && noDuplicates !== undefined) {
		try {
			let newProducts = await pool.query(
				`select * from Izdelki where ID_izdelka not in ? order by rand() limit ?`,
				[[noDuplicates], fetchNumber]
			);
			res.status(200).send(newProducts[0]);
		} catch (onRejectedError) {
			console.log(onRejectedError);
			res.status(400).send(`error`);
		}
	} else {
		try {
			let newProducts = await pool.query(`select * from Izdelki order by rand() limit ?`, [fetchNumber]);
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
		res.status(200).send(availNumber);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/kategorije', async (req, res) => {
	try {
		let result = await pool.query(`select distinct kategorija from Izdelki`);
		res.status(200).send(result[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

router.get('/filtriranje', async (req, res) => {
	let fetchNumber = parseInt(req.query.number);
	let noDuplicates = req.query.noDups;
	let kategorijeF = req.query.kategorijeF;
	let cenaF = req.query.cenaF;
	let popustF = req.query.popustF;
	let sqlQ;

	console.log(cenaF);

	if (noDuplicates !== null && noDuplicates !== undefined) {
		sqlQ = `select * from Izdelki where (ID_izdelka not in (${noDuplicates}) `;
		if (kategorijeF.length > 0) {
			sqlQ = sqlQ.concat(
				`and Izdelki.kategorija in (${kategorijeF.map((k) => {
					return `'${k}'`;
				})}) `
			);
		}
		if (cenaF !== undefined && (cenaF.od !== undefined || cenaF.do !== undefined)) {
			sqlQ = sqlQ.concat('and Izdelki.cena_za_kos');
			if (cenaF.od !== undefined && cenaF.do !== undefined) {
				sqlQ = sqlQ.concat(` between ${cenaF.od} and ${cenaF.do}`);
			} else if (cenaF.od === undefined) {
				sqlQ = sqlQ.concat(` < ${cenaF.do} `);
			} else if (cenaF.do === undefined) {
				sqlQ = sqlQ.concat(` > ${cenaF.od} `);
			}
		}
		sqlQ = sqlQ.concat(`and Izdelki.popust >= ${popustF} ) order by rand() limit ${fetchNumber};`);
	} else {
		sqlQ = `select * from Izdelki where (`;
		if (kategorijeF.length > 0) {
			sqlQ = sqlQ.concat(`Izdelki.kategorija in (${kategorijeF}) and`);
		}
		if ((cenaF !== undefined && cenaF.od !== undefined) || cenaF.do !== undefined) {
			sqlQ = sqlQ.concat('and Izdelki.cena_za_kos');
			if (cenaF.od !== undefined && cenaF.do !== undefined) {
				sqlQ = sqlQ.concat(` between ${cenaF.od} and ${cenaF.do} `);
			} else if (cenaF.od === undefined) {
				sqlQ = sqlQ.concat(` < ${cenaF.do} `);
			} else if (cenaF.do === undefined) {
				sqlQ = sqlQ.concat(` > ${cenaF.od} `);
			}
		} else {
			sqlQ = sqlQ.concat('1 = 1');
		}
		sqlQ = sqlQ.concat(`and Izdelki.popust >= ${popustF} ) order by rand() limit ${fetchNumber};`);
	}
	console.log('sqlQ');
	console.log(sqlQ);

	// ce je rezultat prazen, damo sporočilo za te parametre ni izdelkov

	/*try {
		let newProducts = await pool.query(
			`select * from Izdelki where (ID_izdelka not in ? and Izdelki.kategorija = 'televizor' and (Izdelki.cena_za_kos between 100 and 5000) and Izdelki.popust < 15) order by rand() limit 5;`,
			[[noDuplicates], fetchNumber]
		);
		res.status(200).send(newProducts[0]);

		let n1ewProducts = await pool.query(`select * from Izdelki order by rand() limit ?`, [fetchNumber]);
		res.status(200).send(newProducts[0]);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}*/
});

// spremeni pri filtrih:
router.get('/stVsehProduktov', async (req, res) => {
	try {
		let number = await pool.query(`select count(*) from Izdelki`);
		res.status(200).send(number[0][0]['count(*)'].toString());
	} catch (onRejectedError) {
		console.log(onRejectedError);
		res.status(400).send(`error`);
	}
});

export default router;
