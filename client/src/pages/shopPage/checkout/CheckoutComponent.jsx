import { CaretCircleLeft, CaretCircleRight, CreditCard, Money, Package, Truck } from 'phosphor-react';
import { UserContext } from '../../../contexts/UserContext';
import { ShopContext } from '../../../contexts/ShopContext';
import { useContext, useEffect, useState } from 'react';
import PostaSlovenije from '../../../assets/PSlogo.png';
import axios from 'axios';

const Checkout = ({ setPrikazi }) => {
	const PORT = 3005; // !!!
	const { user, isAuth } = useContext(UserContext);
	const { state, setState, cart, setCart } = useContext(ShopContext);
	const [userData, setUserData] = useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	const [deliveryCost, setDeliveryCost] = useState(0);
	const [sameBuyerAndReceiver, setSameBuyerAndReceiver] = useState(true);

	useEffect(() => {
		const cartTotalPrice = () => {
			let total = 0;

			for (let i = 0; i < cart.length; i++) {
				total +=
					cart[i].cena_za_kos * cart[i].kolicina -
					cart[i].cena_za_kos * cart[i].kolicina * (cart[i].popust / 100.0);
			}
			if (deliveryCost > 0) {
				total += deliveryCost;
			}
			return total;
		};
		if (isAuth) {
			const fetchUserData = async () => {
				try {
					const result = await axios.get(`http://localhost:${PORT}/api/login/user`, {
						params: { username: user.username },
					});
					setUserData(result.data);
				} catch (error) {
					console.log(error);
				}
			};

			fetchUserData();
		}
		setTotalPrice(cartTotalPrice());
	}, [isAuth, user.username, cart, deliveryCost]);

	const handleSubmit = (e) => {
		console.log(e.target.deliveryOption.value);
		if (e.target.paymentMethod.value === 'Po prevzemu') {
			// gremo nazaj, pošljemo predračun, shranimo v bazo pod čakajoča naročila
		} else if (e.target.paymentMethod.value === 'Z debetno kartico') {
			// TODO: send user data
			setState({ ...state, props: {}, active: 'cardInput' });
		}
	};

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				handleSubmit(e);
			}}>
			<div>
				<div className='divTitles'>Podatki o kupcu:</div>
				<br />
				{userData === null ? (
					<div>
						<label>Ime: </label>
						<input required></input>
						<br />
						<label>Priimek: </label>
						<input required></input>
						<br />
						<label>Naslov: </label>
						<input required></input>
						<br />
					</div>
				) : (
					Object.keys(userData).map((key) => {
						if (key !== 'username') {
							return (
								<div key={userData[key]}>
									<label>{key}: </label>
									<input type='text' required defaultValue={userData[key]}></input>
									<br />
								</div>
							);
						}
						return <></>;
					})
				)}
			</div>
			<button
				onClick={(e) => {
					e.preventDefault();
					setSameBuyerAndReceiver(!sameBuyerAndReceiver);
				}}>
				{sameBuyerAndReceiver ? 'Dodaj' : 'Odstrani'} drugega prejemnika
			</button>
			<br />
			{sameBuyerAndReceiver ? (
				<></>
			) : (
				<div>
					<div className='divTitles'>Podatki o prejemniku:</div>
					<br />
					{userData === null ? (
						<div>
							<label>Ime: </label>
							<input required></input>
							<br />
							<label>Priimek: </label>
							<input required></input>
							<br />
							<label>Naslov: </label>
							<input required></input>
							<br />
						</div>
					) : (
						Object.keys(userData).map((key) => {
							if (key !== 'username') {
								return (
									<div key={userData[key]}>
										<label>{key}: </label>
										<input type='text' required defaultValue={userData[key]}></input>
										<br />
									</div>
								);
							}
							return <></>;
						})
					)}
				</div>
			)}
			<div>
				<div className='paymentMethod'>
					<div className='divTitles'>Naslov za dostavo:</div>
					<br />
					<label>Naslov za dostavo: (add to DB načine dostave)</label>
					<br />
					{userData === null ? (
						<input type='text' required></input>
					) : (
						<input type='text' required defaultValue={userData.naslov}></input>
					)}

					<div className='divTitles'>Način dostave:</div>
					<br />
					<input
						type='radio'
						id='PS'
						onClick={(e) => {
							e.preventDefault();
							setDeliveryCost(0);
						}}
						required
						checked={deliveryCost === 0}
						name='deliveryOption'
						value='PS'></input>
					<label>Pošta Slovenije</label>
					<img src={PostaSlovenije} alt='' style={{ marginRight: '5px', marginLeft: '5px' }}></img>
					<label>+ 0.00 €</label>
					<br />
					<input
						type='radio'
						id='HP'
						onClick={(e) => {
							e.preventDefault();
							setDeliveryCost(3);
						}}
						checked={deliveryCost === 3}
						required
						name='deliveryOption'
						value='Hitra posta'></input>
					<label>Hitra pošta</label>
					<Truck size={22} style={{ marginRight: '5px', marginLeft: '5px' }} />
					<label>+ 3.00 €</label>
				</div>
			</div>
			<br />
			<div className='cartOverview'>
				<div className='divTitles'>Pregled košarice</div>
				<br />
				<div className='smallProductDesc'>
					<div>
						{cart.map((product) => {
							return (
								<div>
									{product.ime}, {product.kratek_opis}
								</div>
							);
						})}
					</div>
					<div>
						{cart.map((product) => {
							return (
								<div className='quantityAndPrice'>
									<div>količina: {product.kolicina}</div>
									<div className='priceTag'>
										cena/kos:{' '}
										{(product.cena_za_kos - product.cena_za_kos * (product.popust / 100.0)).toFixed(
											2
										)}{' '}
										€
									</div>
								</div>
							);
						})}
					</div>
				</div>
				<div className='priceTotal'>
					<div>Stroški dostave: {deliveryCost > 0 ? deliveryCost.toFixed(2) : 0.0} €</div>
					<div>
						Za plačilo:{' '}
						<big>
							<b>{totalPrice.toFixed(2)} €</b>
						</big>
					</div>
				</div>
			</div>
			<br />
			<div>
				<div className='paymentMethod'>
					<div className='divTitles'>Način plačila:</div>
					<br />
					<input type='radio' required name='paymentMethod' value='Z debetno kartico'></input>
					<label>Z debetno kartico</label>
					<CreditCard size={22} style={{ marginRight: '5px', marginLeft: '5px' }} />
					<br />
					<input type='radio' required name='paymentMethod' value='Po prevzemu'></input>
					<label>Po prevzemu</label>
					<Money size={22} style={{ marginRight: '5px', marginLeft: '5px' }} />
				</div>
			</div>
			<br />

			<div className='buttonsDiv'>
				<button
					className='backButton'
					onClick={(e) => {
						e.preventDefault();
						setPrikazi('kosarica');
					}}>
					<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
					<div>Nazaj</div>
				</button>
				<button className='fwdButton' type='submit'>
					<div>Oddaj naročilo</div>
					<CaretCircleRight size={25} style={{ marginLeft: '5px' }} />
				</button>
			</div>
		</form>
	);
};

export default Checkout;
