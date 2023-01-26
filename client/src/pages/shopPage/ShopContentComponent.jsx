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
	const [displayedProducts, setDisplayedProductsProducts] = useState([]);
	const [noProducts, setNoProducts] = useState(true);
	const [error, setError] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState({}); // za prikaz na product info page ce pridemo iz product component
	//const [fetchNumber] = useState(6); mogoče potem opcija za koliko jih prikaze na stran

	const fetchProducts = async () => {
		try {
			let response = await axios.get(`http://localhost:${PORT}/api/products/`, {
				params: {
					number: 6,
					noDups: displayedProducts.map((a) => a.ID_izdelka),
				},
			});
			// dodamo vsakemu izdelku kolicino v kosarici
			response = response.data.map((product) => ({
				...product,
				kolicina: 0,
			}));
			setDisplayedProductsProducts([...displayedProducts, ...response]);
			setNoProducts(false);
		} catch (error) {
			console.log(error);
			setError(true);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	if (state.active === 'shopping') {
		return (
			<Shopping
				props={{
					displayedProducts: displayedProducts,
					noProducts: noProducts,
					error: error,
					fetchProducts: fetchProducts,
					selectedProduct: selectedProduct,
					setSelectedProduct: setSelectedProduct,
				}}
			/>
		);
	} else if (state.active === 'cart') {
		return <Cart selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />;
	} else if (state.active === 'checkout') {
		return <Checkout />;
	} else if (state.active === 'product') {
		return <ProductInfo selectedProduct={selectedProduct} setSelectedProduct={setSelectedProduct} />;
	} else if (state.active === 'cardInput') {
		return <CardInput />;
	} else {
		return <Error />;
	}
};

export default ShopContent;
