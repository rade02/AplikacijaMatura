import { CaretCircleLeft, CaretCircleRight, CreditCard, Money, Package, Truck } from 'phosphor-react';
import { UserContext } from '../../../contexts/UserContext';
import { ShopContext } from '../../../contexts/ShopContext';
import { useContext, useEffect, useState } from 'react';
import PostaSlovenije from '../../../assets/PSlogo.png';
import axios from 'axios';

const Checkout = ({ setPrikazi, removedMsg }) => {
	const PORT = 3005; // !!!
	const { user, isAuth } = useContext(UserContext);
	const { state, setState, cart, setCart } = useContext(ShopContext);
	const [userData, setUserData] = useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	const [deliveryCost, setDeliveryCost] = useState(0);
	const [sameBuyerAndReceiver, setSameBuyerAndReceiver] = useState(true);
	const [oddano, setOddano] = useState(false);

	const [kupec, setKupec] = useState(null);
	const [prejemnik, setPrejemnik] = useState(null);
	const [naslovDostava, setNaslovDostava] = useState(null);
	console.log('cart');
	console.log(cart);
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
						params: { username: user.uporabnisko_ime },
					});

					setUserData(result.data);

					if (kupec === null) {
						setKupec({
							...kupec,
							ime: result.data.ime,
							priimek: result.data.priimek,
							naslov:
								result.data.ulica_in_hisna_stevilka +
								' ' +
								result.data.postna_stevilka +
								' ' +
								result.data.kraj,
						});
					}
					if (prejemnik === null) {
						setPrejemnik({
							...prejemnik,
							ime: result.data.ime,
							priimek: result.data.priimek,
							naslov:
								result.data.ulica_in_hisna_stevilka +
								' ' +
								result.data.postna_stevilka +
								' ' +
								result.data.kraj,
						});
					}
					if (setNaslovDostava === null) {
						setNaslovDostava(
							result.data.ulica_in_hisna_stevilka +
								' ' +
								result.data.postna_stevilka +
								' ' +
								result.data.kraj
						);
					}
				} catch (error) {
					console.log(error);
				}
			};

			fetchUserData();
		}
		setTotalPrice(cartTotalPrice());
	}, [isAuth, cart, deliveryCost]);

	// PRIDOBI ID STRANKE (KUPCA) PRED USTVARJANJEM NAROCILA

	const handleSubmit = async (e) => {
		//console.log(e.target.deliveryOption.value);
		/*console.log('kupec--');
		console.log(kupec);
		console.log('prejemnik--');
		console.log(prejemnik);
		console.log('naslovDostava--');
		console.log(naslovDostava);*/
		let IDnarocila = null;
		try {
			let id = null;
			if (userData !== null) {
				let resp = await axios.get(`http://localhost:${PORT}/api/admin/idUporabnika`, {
					params: {
						uporabnisko_ime: userData.uporabnisko_ime,
					},
				});
				id = resp.data;
			}

			const result = await axios.get(`http://localhost:${PORT}/api/products/ustvariNarocilo`, {
				params: {
					ID_stranke: id,
					imeStranke: kupec.ime,
					priimekStranke: kupec.priimek,
					naslovDostave: naslovDostava,
				},
			});
			IDnarocila = result.data;
			for (let element of cart) {
				const result1 = await axios.post(`http://localhost:${PORT}/api/products/dodajIzdelkeNarocilu`, {
					ID_narocila: IDnarocila,
					ID_izdelka: element.ID_izdelka,
					kolicina: element.kolicina,
					cena: totalPrice,
				});
			}
		} catch (onRejectedError) {
			console.log(onRejectedError);
		}

		/*if (e.target.paymentMethod.value === 'Po prevzemu') {
			// gremo nazaj, pošljemo predračun, shranimo v bazo pod čakajoča naročila
			//narocilo in izdelki pri narocilu
			
			
		} else if (e.target.paymentMethod.value === 'Z debetno kartico') {
			// TODO: send user data
			setState({ ...state, props: {}, active: 'cardInput' });
		}*/
	};
	/*try {
		const result = await axios.post(`http://localhost:${PORT}/api/login/updt`, updatedUser);
		setUser(updatedUser);
		setEdit(false);
		//console.log(result.data);
	} catch (onRejectedError) {
		console.log(onRejectedError);
		setError(true);
	}*/

	/*Object.keys(userData).map((key) => {
if (key === 'ime' || key === 'priimek') {
							return (
								<div key={userData[key]}>
									<label>{key}: </label>
									<input type='text' required defaultValue={userData[key]}></input>
									<br />
								</div>
							);
						}
						else if()
						return <></>;
	*/

	if (oddano) {
		if (userData === null) {
			return (
				<>
					<div>Naročilo je bilo oddano</div>;
					<div>
						<button
							className='backButton'
							onClick={(e) => {
								e.preventDefault();
								setPrikazi('kosarica');
							}}>
							<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
							<div>V redu</div>
						</button>
					</div>
				</>
			);
		}
		return (
			<>
				<div>Naročilo je bilo oddano, račun bo na voljo na vašem profilu po odpošiljanju</div>
				<div>
					<button
						className='backButton'
						onClick={(e) => {
							e.preventDefault();
							setPrikazi('kosarica');
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>V redu</div>
					</button>
				</div>
			</>
		);
	}
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				console.log('kupec');
				console.log(kupec);
				console.log('prejemnik');
				console.log(prejemnik);

				handleSubmit(e);
			}}>
			<div>
				<div>{removedMsg === '' ? 'no removedMsg' : removedMsg}</div>
				<div className='divTitles'>Podatki o kupcu:</div>
				<br />
				{userData === null ? (
					<div>
						<label>Ime: </label>
						<input
							type='text'
							required
							onChange={(e) => {
								e.preventDefault();
								setKupec({ ...kupec, ime: e.target.value });
							}}></input>
						<br />
						<label>Priimek: </label>
						<input
							type='text'
							required
							onChange={(e) => {
								e.preventDefault();
								setKupec({ ...kupec, priimek: e.target.value });
							}}></input>
						<br />
						<label>Naslov: </label>
						<input
							type='text'
							required
							onChange={(e) => {
								e.preventDefault();
								setKupec({ ...kupec, naslov: e.target.value });
							}}></input>
						<br />
					</div>
				) : (
					<>
						<div>
							<label>Ime: </label>
							<input
								type='text'
								required
								defaultValue={userData.ime}
								onChange={(e) => {
									e.preventDefault();
									setKupec({ ...kupec, ime: e.target.value });
								}}></input>
							<br />
						</div>
						<div>
							<label>Priimek: </label>
							<input
								type='text'
								required
								defaultValue={userData.priimek}
								onChange={(e) => {
									e.preventDefault();
									setKupec({ ...kupec, priimek: e.target.value });
								}}></input>
							<br />
						</div>
						<div>
							<label>Naslov: </label>
							<input
								type='text'
								required
								defaultValue={
									userData.ulica_in_hisna_stevilka +
									' ' +
									userData.postna_stevilka +
									' ' +
									userData.kraj
								}
								onChange={(e) => {
									e.preventDefault();
									setKupec({ ...kupec, naslov: e.target.value });
								}}></input>
							<br />
						</div>
					</>
				)}
			</div>
			<button
				onClick={(e) => {
					e.preventDefault();
					if (!sameBuyerAndReceiver) {
						setPrejemnik(kupec);
					}
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
							<input
								type='text'
								required
								onChange={(e) => {
									e.preventDefault();
									setPrejemnik({ ...prejemnik, ime: e.target.value });
								}}></input>
							<br />
							<label>Priimek: </label>
							<input
								type='text'
								required
								onChange={(e) => {
									e.preventDefault();
									setPrejemnik({ ...prejemnik, priimek: e.target.value });
								}}></input>
							<br />
							<label>Naslov: </label>
							<input
								type='text'
								required
								onChange={(e) => {
									e.preventDefault();
									setPrejemnik({ ...prejemnik, naslov: e.target.value });
								}}></input>
							<br />
						</div>
					) : (
						<>
							<div>
								<label>Ime: </label>
								<input
									type='text'
									required
									defaultValue={userData.ime}
									onChange={(e) => {
										e.preventDefault();
										setPrejemnik({ ...prejemnik, ime: e.target.value });
									}}></input>
								<br />
							</div>
							<div>
								<label>Priimek: </label>
								<input
									type='text'
									required
									defaultValue={userData.priimek}
									onChange={(e) => {
										e.preventDefault();
										setPrejemnik({ ...prejemnik, priimek: e.target.value });
									}}></input>
								<br />
							</div>
							<div>
								<label>Naslov: </label>
								<input
									type='text'
									required
									defaultValue={
										userData.ulica_in_hisna_stevilka +
										' ' +
										userData.postna_stevilka +
										' ' +
										userData.kraj
									}
									onChange={(e) => {
										e.preventDefault();
										setPrejemnik({ ...prejemnik, naslov: e.target.value });
									}}></input>
								<br />
							</div>
						</>
					)}
				</div>
			)}
			<div>
				<div className='paymentMethod'>
					<div className='divTitles'>Naslov za dostavo:</div>
					<br />
					<label>Naslov za dostavo:</label>
					<br />
					{userData === null ? (
						<input
							type='text'
							required
							defaultValue={naslovDostava}
							onChange={(e) => {
								e.preventDefault();
								setNaslovDostava(e.target.value);
							}}></input>
					) : (
						<input
							type='text'
							required
							defaultValue={userData.naslov}
							onChange={(e) => {
								e.preventDefault();
								setNaslovDostava(e.target.value);
							}}></input>
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
					{userData === null ? (
						<></>
					) : (
						<>
							<input type='radio' required name='paymentMethod' value='Z debetno kartico'></input>
							<label>Z debetno kartico</label>
							<CreditCard size={22} style={{ marginRight: '5px', marginLeft: '5px' }} />
							<br />
						</>
					)}
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
				<button
					className='fwdButton'
					type='submit'
					disabled={cart.length === 0 ? 'disabled' : ''}
					onClick={(e) => {
						e.preventDefault();
						setOddano(true);
						setCart([]);
					}}>
					<div>Oddaj naročilo</div>
					<CaretCircleRight size={25} style={{ marginLeft: '5px' }} />
				</button>
			</div>
		</form>
	);
};

export default Checkout;
