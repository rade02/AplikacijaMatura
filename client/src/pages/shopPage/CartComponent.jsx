import axios from 'axios';
import { CaretCircleLeft, CaretCircleRight } from 'phosphor-react';
import { ShopContext } from '../../contexts/ShopContext';
import { useContext, useEffect, useRef, useState } from 'react';
import CartProduct from './cart/CartProductComponent';

const Cart = ({ setShow, selectedProduct, setSelectedProduct, setPrikazi }) => {
	const PORT = 3005; // !!!
	const { state, setState, cart, setCart } = useContext(ShopContext);
	const [removedMsg, setRemovedMsg] = useState('');
	let counter = useRef(0);

	// PREVERI ZA VSAK IZDELEK V CARTU, ČE JE SPLOH ŠE KAKŠEN NA VOLJO, ČE NI, GA ODSTRANIMO IN NAPIŠEMO DA NI VEČ
	/*useEffect(() => {
		const checkAvailability = async (id) => {
			try {
				let response = await axios.get(`http://localhost:${PORT}/api/products/availability`, {
					params: {
						ID_izdelka: id,
					},
				});
				response = response.data.map((product) => ({
					...product,
					kolicina: 0,
				}));
			} catch (error) {
				console.log(error);
			}
		};
		cart.forEach((product) => {
			checkAvailability();
		});
	});*/

	useEffect(() => {
		cart.forEach((product) => {
			counter.current = 0;
			if (product.kolicina <= 0) {
				setCart(cart.filter((p) => p.ID_izdelka !== product.ID_izdelka));
			}
			//console.log(product.kolicina);
		});
	});

	return (
		<div>
			<div>
				{cart.map((product) => {
					return (
						<CartProduct
							key={product.ID_izdelka}
							props={{
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
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
					<button
						className={cart.length <= 0 ? 'disabledBtn' : 'fwdButton'}
						disabled={cart.length <= 0 ? 'disabled' : ''}
						onClick={(e) => {
							e.preventDefault();
							setPrikazi('blagajna');
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
