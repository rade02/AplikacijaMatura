import { CaretCircleLeft, CreditCard, Money, PaperPlaneRight, Truck } from 'phosphor-react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';
import { useContext, useEffect, useState } from 'react';
import PostaSlovenije from '../../assets/PSlogotip.png';
import axios from 'axios';

const Blagajna = ({ setPrikazi, sporociloOdstranjevanje, setSporociloOdstranjevanje }) => {
	const { uporabnik, jeAvtenticiran } = useContext(UporabniskiKontekst);
	const { kosarica, setKosarica } = useContext(NakupovalniKontekst);
	const [uporabniskiPodatki, setUporabniskiPodatki] = useState(null);
	const [skupajCena, setSkupajCena] = useState(0);
	const [cenaDostave, setCenaDostave] = useState(0);
	const [istiKupecInPrejemnik, setIstiKupecInPrejemnik] = useState(true);
	const [oddano, setOddano] = useState(false);
	const [kupec, setKupec] = useState(null);
	const [prejemnik, setPrejemnik] = useState(null);
	const [naslovDostava, setNaslovDostava] = useState(null);

	useEffect(() => {
		const cenaKosarice = () => {
			let skupaj = 0;

			for (let i = 0; i < kosarica.length; i++) {
				skupaj +=
					kosarica[i].cena_za_kos * kosarica[i].kolicina -
					kosarica[i].cena_za_kos * kosarica[i].kolicina * (kosarica[i].popust / 100.0);
			}
			if (cenaDostave > 0) {
				skupaj += cenaDostave;
			}
			return skupaj;
		};
		if (jeAvtenticiran) {
			const pridobiPodatkeUporabnika = async () => {
				try {
					const rezultat = await axios.get(
						`http://localhost:${global.config.port}/api/avtentikacija/uporabnik`,
						{
							params: { uporabnisko_ime: uporabnik.uporabnisko_ime },
						}
					);

					setUporabniskiPodatki(rezultat.data);

					if (kupec === null) {
						setKupec({
							...kupec,
							ime: rezultat.data.ime,
							priimek: rezultat.data.priimek,
							naslov:
								rezultat.data.ulica_in_hisna_stevilka +
								' ' +
								rezultat.data.postna_stevilka +
								' ' +
								rezultat.data.kraj,
						});
					}
					if (prejemnik === null) {
						setPrejemnik({
							...prejemnik,
							ime: rezultat.data.ime,
							priimek: rezultat.data.priimek,
							naslov:
								rezultat.data.ulica_in_hisna_stevilka +
								' ' +
								rezultat.data.postna_stevilka +
								' ' +
								rezultat.data.kraj,
						});
					}

					if (naslovDostava === null) {
						let n =
							rezultat.data.ulica_in_hisna_stevilka === null
								? ''
								: rezultat.data.ulica_in_hisna_stevilka + ' ';
						n += rezultat.data.postna_stevilka === null ? '' : rezultat.data.postna_stevilka + ' ';
						n += rezultat.data.kraj === null ? '' : rezultat.data.kraj;

						if (n !== null && n.length > 0) {
							setNaslovDostava(n);
						}
					}
				} catch (napaka) {
					console.log(napaka);
				}
			};

			pridobiPodatkeUporabnika();
		}
		setSkupajCena(cenaKosarice());
	}, [jeAvtenticiran, kosarica, cenaDostave]);

	const oddajaNarocila = async (e) => {
		let IDnarocila = null;
		try {
			let id = null;

			if (uporabniskiPodatki !== null && uporabniskiPodatki.uporabnisko_ime !== 'admin') {
				let odziv = await axios.get(
					`http://localhost:${global.config.port}/api/administrator/idUporabnika`,
					{
						params: {
							uporabnisko_ime: uporabniskiPodatki.uporabnisko_ime,
						},
					}
				);
				id = odziv.data;
			}
			const rezultat = await axios.get(
				`http://localhost:${global.config.port}/api/produkti/ustvariNarocilo`,
				{
					params: {
						ID_stranke: id,
						imeStranke: kupec.ime,
						priimekStranke: kupec.priimek,
						naslovDostave: naslovDostava,
						postnina: cenaDostave,
					},
				}
			);
			IDnarocila = rezultat.data;

			const preveriCeJeNaVoljo = async (produkt) => {
				try {
					let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/naVoljo`, {
						params: {
							ID_izdelka: produkt.ID_izdelka,
						},
					});
					console.log(odziv.data);
					if (odziv.data[0].kosov_na_voljo <= 0) {
						return false;
					} else {
						return true;
					}
				} catch (napaka) {
					console.log(napaka);
				}
			};

			for (let element of kosarica) {
				let jeNaVoljo = await preveriCeJeNaVoljo(element);
				console.log(jeNaVoljo);
				if (jeNaVoljo) {
					await axios.post(`http://localhost:${global.config.port}/api/produkti/dodajIzdelkeNarocilu`, {
						ID_narocila: IDnarocila,
						ID_izdelka: element.ID_izdelka,
						kolicina: element.kolicina,
						cena: (element.cena_za_kos * (1 - element.popust / 100.0)).toFixed(2),
					});
					// zmanjšanje zaloge
					await axios.post(`http://localhost:${global.config.port}/api/produkti/zmanjsajZalogo`, {
						kolicina_kupljeno: element.kolicina,
						ID_izdelka: element.ID_izdelka,
					});
					setOddano(true);
				} else {
					setSporociloOdstranjevanje(
						'Izdelek iz naročila je bil odstranjen, ker ga nimamo več na zalogi.'
					);
					setOddano(false);
				}
			}
		} catch (napaka) {
			setOddano(false);
			setSporociloOdstranjevanje('Potrditev naročila neuspešna (prišlo je do napake)');
			console.log(napaka);
		}
		kosarica.forEach((element) => {
			element.kolicina = 0;
		});
	};

	if (oddano) {
		if (uporabniskiPodatki === null) {
			return (
				<div className='narocilo'>
					<div className='oddanoNarocilo'>Naročilo je bilo oddano</div>
					<div>
						<button
							className='gumbNazaj'
							onClick={(e) => {
								e.preventDefault();
								setPrikazi('kosarica');
							}}>
							<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
							<div>V redu</div>
						</button>
					</div>
				</div>
			);
		}
		return (
			<div className='narocilo'>
				<div className='oddanoNarocilo'>
					Naročilo je bilo oddano, račun bo na voljo na vašem profilu po odpošiljanju
				</div>
				<div>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setPrikazi('kosarica');
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>V redu</div>
					</button>
				</div>
			</div>
		);
	}
	return (
		<div className='narocilo'>
			{sporociloOdstranjevanje === '' ? (
				<form
					onSubmit={(e) => {
						e.preventDefault();
						oddajaNarocila(e);
						setKosarica([]);
					}}>
					<div className='podatkiOKupcu'>
						<div className='divNaslovi'>Podatki o kupcu:</div>
						<div className='podatki'>
							<div>
								<div>Ime: </div>
								<input
									type='text'
									required
									defaultValue={uporabniskiPodatki !== null ? uporabniskiPodatki.ime : ''}
									onChange={(e) => {
										e.preventDefault();
										setKupec({ ...kupec, ime: e.target.value });
									}}></input>
							</div>
							<div>
								<div>Priimek: </div>
								<input
									type='text'
									required
									defaultValue={uporabniskiPodatki !== null ? uporabniskiPodatki.priimek : ''}
									onChange={(e) => {
										e.preventDefault();
										setKupec({ ...kupec, priimek: e.target.value });
									}}></input>
							</div>
							<div>
								<div>Naslov: </div>
								<input
									type='text'
									required
									defaultValue={uporabniskiPodatki !== null ? naslovDostava : ''}
									onChange={(e) => {
										e.preventDefault();
										setKupec({ ...kupec, naslov: e.target.value });
									}}></input>
							</div>
						</div>
						<button
							className='dodajPrejemnika'
							onClick={(e) => {
								e.preventDefault();
								if (!istiKupecInPrejemnik) {
									setPrejemnik(kupec);
								}
								setIstiKupecInPrejemnik(!istiKupecInPrejemnik);
							}}>
							{istiKupecInPrejemnik ? 'Dodaj' : 'Odstrani'} drugega prejemnika
						</button>
					</div>
					<br />
					{istiKupecInPrejemnik ? (
						<></>
					) : (
						<div className='podatkiOKupcu'>
							<div className='divNaslovi'>Podatki o prejemniku:</div>
							<div className='podatki'>
								<div>
									<div>Ime: </div>
									<input
										type='text'
										required
										defaultValue={uporabniskiPodatki !== null ? uporabniskiPodatki.ime : ''}
										onChange={(e) => {
											e.preventDefault();
											setPrejemnik({ ...prejemnik, ime: e.target.value });
										}}></input>
								</div>
								<div>
									<div>Priimek: </div>
									<input
										type='text'
										required
										defaultValue={uporabniskiPodatki !== null ? uporabniskiPodatki.priimek : ''}
										onChange={(e) => {
											e.preventDefault();
											setPrejemnik({ ...prejemnik, priimek: e.target.value });
										}}></input>
								</div>
								<div>
									<div>Naslov: </div>
									<input
										type='text'
										required
										defaultValue={uporabniskiPodatki !== null ? naslovDostava : ''}
										onChange={(e) => {
											e.preventDefault();
											setPrejemnik({ ...prejemnik, naslov: e.target.value });
										}}></input>
								</div>
							</div>
						</div>
					)}
					<div>
						<div className='metodaPlacila'>
							<div className='divNaslovi'>Naslov za dostavo:</div>
							<div className='podatki'>
								<div>
									<div style={{ width: '150px' }}>Naslov za dostavo:</div>
									{uporabniskiPodatki === null ? (
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
											defaultValue={uporabniskiPodatki.naslov}
											onChange={(e) => {
												e.preventDefault();
												setNaslovDostava(e.target.value);
											}}></input>
									)}
								</div>
							</div>
							<div className='nacinDostave'>
								<div>Način dostave:</div>
								<div>
									<div>
										<input
											type='radio'
											id='PS'
											onClick={(e) => {
												e.preventDefault();
												setCenaDostave(0);
											}}
											required
											checked={cenaDostave === 0}
											name='deliveryOption'
											value='PS'></input>
										<label>Pošta Slovenije</label>
										<img
											src={PostaSlovenije}
											alt=''
											style={{ marginRight: '5px', marginLeft: '5px' }}></img>
										<label>+ 0.00 €</label>
									</div>
									<div>
										<input
											type='radio'
											id='HP'
											onClick={(e) => {
												e.preventDefault();
												setCenaDostave(3);
											}}
											checked={cenaDostave === 3}
											required
											name='deliveryOption'
											value='Hitra posta'></input>
										<label>Hitra pošta</label>
										<Truck size={22} style={{ marginRight: '5px', marginLeft: '5px' }} />
										<label>+ 3.00 €</label>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='pregledKosarice'>
						<div className='divNaslovi'>Pregled košarice</div>

						<div className='kratekOpisProdukta'>
							<table>
								<tbody>
									<tr className='glavaTabele'>
										<td>Produkt</td>
										<td>Količina</td>
										<td>Cena/kos</td>
									</tr>
									{kosarica.map((produkt) => {
										return (
											<tr className='vsebinaTabele'>
												{' '}
												<td>
													{produkt.kratek_opis !== '' && produkt.kratek_opis !== null
														? `${produkt.ime}, ${produkt.kratek_opis}`
														: produkt.ime}
												</td>
												<td>{produkt.kolicina}</td>{' '}
												<td>
													{(
														produkt.cena_za_kos -
														produkt.cena_za_kos * (produkt.popust / 100.0)
													).toFixed(2)}{' '}
													€
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
						<div className='cenaSkupaj'>
							<div>Stroški dostave: {cenaDostave > 0 ? cenaDostave.toFixed(2) : 0.0} €</div>
							<div>
								Za plačilo:{' '}
								<big>
									<b>{skupajCena.toFixed(2)} €</b>
								</big>
							</div>
						</div>
					</div>
					<br />
					<div>
						<div className='metodaPlacila'>
							<div className='divNaslovi'>Način plačila:</div>
							{uporabniskiPodatki === null ? (
								<></>
							) : (
								<div className='naciniPlacila'>
									<input type='radio' required name='metodaPlacila' value='Z debetno kartico'></input>
									Z debetno kartico
									<CreditCard size={22} style={{ marginRight: '5px', marginLeft: '5px' }} />
								</div>
							)}
							<div className='naciniPlacila'>
								<input type='radio' required name='metodaPlacila' value='Po prevzemu'></input>
								Po prevzemu
								<Money size={22} style={{ marginRight: '5px', marginLeft: '5px' }} />
							</div>
						</div>
					</div>
					<br />

					<div className='nazajNaprej'>
						<button
							className='gumbNazaj'
							onClick={(e) => {
								e.preventDefault();
								setPrikazi('kosarica');
							}}>
							<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
							<div>Nazaj</div>
						</button>
						<button
							className={kosarica.length === 0 ? 'onemogocenGumb' : 'gumbNaprej'}
							type='submit'
							disabled={kosarica.length === 0 ? 'disabled' : ''}>
							<div>Oddaj naročilo</div>
							<PaperPlaneRight size={25} style={{ marginLeft: '5px' }} />
						</button>
					</div>
				</form>
			) : (
				<>
					<div>{sporociloOdstranjevanje}</div>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setPrikazi('kosarica');
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			)}
		</div>
	);
};

export default Blagajna;
