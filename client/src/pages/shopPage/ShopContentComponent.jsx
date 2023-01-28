import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../contexts/ShopContext';
import Shopping from './ShoppingComponent';
import Cart from './CartComponent';
import Checkout from './checkout/CheckoutComponent';
import Error from '../errorPage/ErrorPage';
import ProductInfo from './shopping/ProductInfoComponent';
import CardInput from './checkout/CardInputComponent';

const ShopContent = () => {
	const { state } = useContext(ShopContext);

	const PORT = 3005; // !!!
	const [prikazi, setPrikazi] = useState('nakupovanje');
	const [prikazaniProdukti, setPrikazaniProdukti] = useState([]);
	const [niProduktov, setNiProduktov] = useState(true);
	const [napaka, setNapaka] = useState(false);
	const [izbranProdukt, setIzbranProdukt] = useState({}); // za prikaz na product info page ce pridemo iz product component
	//const [fetchNumber] = useState(6); mogoče potem opcija za koliko jih prikaze na stran

	const pridobiProdukte = async () => {
		try {
			let response = await axios.get(`http://localhost:${PORT}/api/products/`, {
				params: {
					number: 6,
					noDups: prikazaniProdukti.map((a) => a.ID_izdelka),
				},
			});
			// dodamo vsakemu izdelku kolicino v kosarici
			response = response.data.map((product) => ({
				...product,
				kolicina: 0,
			}));
			setPrikazaniProdukti([...prikazaniProdukti, ...response]);
			setNiProduktov(false);
		} catch (error) {
			console.log(error);
			setNapaka(true);
		}
	};

	useEffect(() => {
		pridobiProdukte();
	}, []);

	console.log('izbranProdukt @ Content');
	console.log(izbranProdukt);
	if (prikazi === 'nakupovanje') {
		return (
			<Shopping
				props={{
					setPrikazi: setPrikazi,
					prikazaniProdukti: prikazaniProdukti,
					niProduktov: niProduktov,
					napaka: napaka,
					pridobiProdukte: pridobiProdukte,
					izbranProdukt: izbranProdukt,
					setIzbranProdukt: setIzbranProdukt,
				}}
			/>
		);
	} else if (prikazi === 'kosarica') {
		return (
			<Cart izbranProdukt={izbranProdukt} setIzbranProdukt={setIzbranProdukt} setPrikazi={setPrikazi} />
		);
	} else if (prikazi === 'blagajna') {
		return <Checkout setPrikazi={setPrikazi} />;
	} else if (prikazi === 'produkt') {
		return (
			<ProductInfo
				izbranProdukt={izbranProdukt}
				setIzbranProdukt={setIzbranProdukt}
				setPrikazi={setPrikazi}
			/>
		);
	} else if (prikazi === 'vnosKartice') {
		return <CardInput setPrikazi={setPrikazi} />;
	} else {
		return <Error />;
	}
};

export default ShopContent;
