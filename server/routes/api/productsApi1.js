import express from 'express';
const router = express.Router();
import pool from '../../dbConnection.js';

// http://localhost:3005/api/products/...

router.get('/:no', async (req, res) => {
	//let n = 5;  // number of products to show
	let n = req.params.no;

	try {
		// how many products are there in the database
		let [gotCount] = await pool.query(`select count(*) from Izdelek`);
		let count = gotCount[0]['count(*)'];
		console.log('count: ' + count);

		// how many products to fetch to show on the website
		let nToFetch;
		if (typeof n === undefined) {
			nToFetch = Math.min(10, count);
		} else {
			nToFetch = Math.min(n, count);
		}
		console.log('nToFetch: ' + nToFetch);

		// get random products
		let array = await getRandoms(nToFetch);
		//console.log(array)
		let a = [];
		for (let i = 0; i < array.length; i++) {
			if (i < array.length - 1) {
				a.push(array[i].ID_izdelka);
			} else {
				a.push(array[i].ID_izdelka);
			}
		}

		//console.log('a: ' + a)

		// get the products from db
		const [products] = await pool.query('select * from Izdelek where ID_izdelka in ? limit ?', [
			[a],
			nToFetch,
		]);

		/*products.forEach(element => {
            console.log(JSON.stringify(element))
        })*/
		//return res(products);    // array of objects which are products
		console.log(products);
		res.status(200).send(products);
	} catch (onRejectedError) {
		console.log(onRejectedError);
	}
});

async function getRandoms(n) {
	let resultArr = [];

	try {
		//console.log('going for valid IDs')
		let object = await getValidIDs();
		//console.log(object[0])

		let array = [];

		object.forEach((element) => {
			//console.log(element.ime)
			array.push(element);
		});
		console.log(array);
		/*
        console.log('-----------------array-------------------')

        
        console.log(array.length)
        console.log(array[0])
        console.log(array[0].length)
        console.log(array[0].ime)

        console.log('-----------------array-------------------')
        */

		//console.log('went on to array manipultaion');

		// Fisher–Yates shuffle
		let maxI;
		let minI = 0;
		let r;

		for (let i = 0; i < n; i++) {
			maxI = array.length - 1;

			r = Math.floor(Math.random() * (maxI + 1)); // random indices: [0, maxI]

			resultArr.push(array[r]);

			let tmp = array[maxI];
			array[maxI] = array[r];
			array[r] = tmp;
			array.pop();

			/*// print
            console.log('----------rA:')
            for(let k = 0; k < resultArr.length; k++)
                console.log(resultArr[k].ime)
            console.log('\r\n')
            console.log('array:')
            for(let l = 0; l < array.length; l++)
                console.log(array[l].ime)
            console.log('\r\n')*/
		}
	} catch (error) {
		console.log(error);
	}

	//console.log('ended getting randoms')
	return resultArr; // array of n random objects
}
async function getValidIDs() {
	try {
		//console.log('awaiting valid IDs')
		let [res] = await pool.query(`select * from Izdelek where kosov_na_voljo > 0`);
		//console.log(res);
		return res;
	} catch (onRejectedError) {
		console.log('ERROR: ' + onRejectedError);
	} finally {
		//console.log('got valid IDs')
	}
}

export default router;
