import { CaretCircleLeft, CaretCircleRight, CreditCard, Money, Package, Truck } from 'phosphor-react';
import { UporabniskiKontekst } from '../../../contexts/UporabniskiKontekst';
import { NakupovalniKontekst } from '../../../contexts/NakupovalniKontekst';
import { useContext, useEffect, useState } from 'react';
import PostaSlovenije from '../../../assets/PSlogo.png';
import axios from 'axios';

const Checkout = ({ setPrikazi, removedMsg, setRemovedMsg, pridobiProdukte }) => {
	const PORT = 3005; // !!!
	const { user, isAuth } = useContext(UporabniskiKontekst);
	const { kosarica, setKosarica } = useContext(NakupovalniKontekst);
	const [userData, setUserData] = useState(null);
	const [totalPrice, setTotalPrice] = useState(0);
	const [deliveryCost, setDeliveryCost] = useState(0);
	const [sameBuyerAndReceiver, setSameBuyerAndReceiver] = useState(true);
	const [oddano, setOddano] = useState(false);

	const [kupec, setKupec] = useState(null);
	const [prejemnik, setPrejemnik] = useState(null);
	const [naslovDostava, setNaslovDostava] = useState(null);

	useEffect(() => {
		const cartTotalPrice = () => {
			let total = 0;

			for (let i = 0; i < kosarica.length; i++) {
				total +=
					kosarica[i].cena_za_kos * kosarica[i].kolicina -
					kosarica[i].cena_za_kos * kosarica[i].kolicina * (kosarica[i].popust / 100.0);
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
					console.log('result.data');
					console.log(result.data);
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
					console.log(naslovDostava);
					if (naslovDostava === null) {
						let n =
							result.data.ulica_in_hisna_stevilka === null
								? ''
								: result.data.ulica_in_hisna_stevilka + ' ';
						n += result.data.postna_stevilka === null ? '' : result.data.postna_stevilka + ' ';
						n += result.data.kraj === null ? '' : result.data.kraj;
						console.log(n);
						if (n !== null && n.length > 0) {
							setNaslovDostava(n);
						}
					}
				} catch (error) {
					console.log(error);
				}
			};

			fetchUserData();
		}
		setTotalPrice(cartTotalPrice());
	}, [isAuth, kosarica, deliveryCost]);

	const handleSubmit = async (e) => {
		let IDnarocila = null;
		try {
			let id = null;
			console.log(userData);
			console.log('deliveryCost');
			console.log(deliveryCost);
			if (userData !== null && userData.uporabnisko_ime !== 'admin') {
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
					postnina: deliveryCost,
				},
			});
			IDnarocila = result.data;

			for (let element of kosarica) {
				const result1 = await axios.post(`http://localhost:${PORT}/api/products/dodajIzdelkeNarocilu`, {
					ID_narocila: IDnarocila,
					ID_izdelka: element.ID_izdelka,
					kolicina: element.kolicina,
					cena: (element.cena_za_kos * (1 - element.popust / 100.0)).toFixed(2),
				});
				// zmanjšanje zaloge
				const result12 = await axios.post(`http://localhost:${PORT}/api/products/zmanjsajZalogo`, {
					kolicina_kupljeno: element.kolicina,
					ID_izdelka: element.ID_izdelka,
				});
			}
		} catch (onRejectedError) {
			setOddano(false);
			setRemovedMsg('Potrditev naročila neuspešna (prišlo je do napake)');
			console.log(onRejectedError);
		}
		kosarica.forEach((element) => {
			element.kolicina = 0;
		});

		/*if (e.target.paymentMethod.value === 'Po prevzemu') {
			// gremo nazaj, pošljemo predračun, shranimo v bazo pod čakajoča naročila
			//narocilo in izdelki pri narocilu
			
			
		} else if (e.target.paymentMethod.value === 'Z debetno kartico') {
			// TODO: send user data
			setState({ ...state, props: {}, active: 'cardInput' });
		}*/
	};

	if (oddano) {
		if (userData === null) {
			return (
				<>
					<div>Naročilo je bilo oddano</div>
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
				handleSubmit(e);
				console.log(kupec);
				//console.log('cart');
				//console.log(cart);
				setOddano(true);

				setKosarica([]);
				/*console.log('kupec');
				console.log(kupec);
				console.log('prejemnik');
				console.log(prejemnik);*/
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
								defaultValue={naslovDostava}
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
				type='submit'
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
									defaultValue={naslovDostava}
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
					<table>
						<tbody>
							{kosarica.map((product) => {
								return (
									<tr>
										<td>
											{product.kratek_opis !== '' && product.kratek_opis !== null
												? `${product.ime}, ${product.kratek_opis}`
												: product.ime}
										</td>
										<td>kol: {product.kolicina}</td>{' '}
										<td>
											cena/kos:{' '}
											{(
												product.cena_za_kos -
												product.cena_za_kos * (product.popust / 100.0)
											).toFixed(2)}{' '}
											€
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
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
				<button className='fwdButton' type='submit' disabled={kosarica.length === 0 ? 'disabled' : ''}>
					<div>Oddaj naročilo</div>
					<CaretCircleRight size={25} style={{ marginLeft: '5px' }} />
				</button>
			</div>
		</form>
	);
};

export default Checkout;
