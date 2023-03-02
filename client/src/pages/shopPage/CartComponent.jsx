import axios from 'axios';
import { CaretCircleLeft, CaretCircleRight } from 'phosphor-react';
import { ShopContext } from '../../contexts/ShopContext';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import CartProduct from './cart/CartProductComponent';

const Cart = ({
	setPrikazi,
	izbranProdukt,
	setIzbranProdukt,
	izKosarice,
	setIzKosarice,
	setCenaKosarice,
	pridobiProdukte,
	prikazaniProdukti,
	setPrikazaniProdukti,
	removedMsg,
	setRemovedMsg,
}) => {
	const PORT = 3005; // !!!
	const { state, setState, cart, setCart } = useContext(ShopContext);

	let counter = useRef(0);

	useEffect(() => {
		setIzbranProdukt(null);
		counter.current = 0;
		preveriZalogoIzdelkov();
	}, []);

	const preveriZalogoIzdelkov = async () => {
		let vsota = 0;

		const f = async (product) => {
			try {
				let response = await axios.get(`http://localhost:${PORT}/api/products/availability`, {
					params: {
						ID_izdelka: product.ID_izdelka,
					},
				});
				// za odstranjevanje z "-" in preverjanje ce je produkt ze nekdo kupil in ga ni več
				if (product.kolicina <= 0) {
					setRemovedMsg('Izdelek ' + product.ime + ' je bil odstranjen.');
					return false;
				}
				if (response.data[0].kosov_na_voljo <= 0) {
					setRemovedMsg('Izdelek ' + product.ime + ' je bil odstranjen, ker ga nimamo več na zalogi.');
					return false;
				} else {
					return true;
				}
			} catch (error) {
				console.log(error);
			}
		};
		for (let product of cart) {
			counter.current = 0;
			vsota +=
				product.cena_za_kos *
				product.kolicina *
				-product.cena_za_kos *
				product.kolicina *
				(product.popust / 100.0);

			if (!(await f(product))) {
				setCart(cart.filter((p) => p.ID_izdelka !== product.ID_izdelka));
				setPrikazaniProdukti(prikazaniProdukti.filter((p) => p.ID_izdelka !== product.ID_izdelka));
			}
			setCenaKosarice(vsota);
		}
	};

	return (
		<div>
			<div>
				{cart.map((product) => {
					return (
						<CartProduct
							key={product.ID_izdelka}
							props={{
								preveriZalogoIzdelkov: preveriZalogoIzdelkov,
								izKosarice: izKosarice,
								setIzKosarice: setIzKosarice,
								izbranProdukt: izbranProdukt,
								setIzbranProdukt: setIzbranProdukt,
								setPrikazi: setPrikazi,
								product: product,
								counter: counter,
								setState: setState,
								setRemovedMsg: setRemovedMsg,
							}}
						/>
					);
				})}
			</div>
			<div>
				<div className='buttonsDiv'>
					<button
						className='backButton'
						onClick={(e) => {
							e.preventDefault();
							setPrikazi('nakupovanje');
							setIzKosarice(false);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
					<button
						className={cart.length <= 0 ? 'disabledBtn' : 'fwdButton'}
						disabled={cart.length <= 0 ? 'disabled' : ''}
						onClick={(e) => {
							e.preventDefault();
							preveriZalogoIzdelkov();
							if (cart.length > 0) {
								setPrikazi('blagajna');
								setRemovedMsg('');
							} else {
								setRemovedMsg('Vaša košarica je prazna.');
								/*setRemovedMsg(
									'Izdelek je bil odstranjen iz vaše košarice, ker ga nimamo več na zalogi.'
								);*/
							}
							//setState({ ...state, props: {}, active: 'checkout', fromCart: true });
						}}>
						<div>Na plačilo</div>
						<CaretCircleRight size={25} style={{ marginLeft: '5px' }} />
					</button>
				</div>
				<div>{removedMsg === '' ? 'no removedMsg' : removedMsg}</div>
			</div>
		</div>
	);
};

export default Cart;
