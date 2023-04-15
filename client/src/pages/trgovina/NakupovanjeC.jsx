import axios from 'axios';
import { ArrowCounterClockwise, Funnel, MagnifyingGlass } from 'phosphor-react';
import { useState, useEffect, useRef } from 'react';
import PrikazProduktov from './PrikazProduktovC';

const Nakupovanje = ({ props }) => {
	const [kategorijeNaVoljo, setKategorijenaVoljo] = useState([]);
	let [kategorijeF, setKategorijeF] = useState([]);
	let [cenaF, setCenaF] = useState({ od: undefined, do: undefined });
	let [popustF, setPopustF] = useState(0);
	const od = useRef('od');
	const Do = useRef('do');
	const [stVsehProduktov, setStVsehProduktov] = useState(null);
	const filtri = useRef(null);
	const [iskalniNiz, setIskalniNiz] = useState('');
	const [tabelaPredlogov, setTabelaPredlogov] = useState([]);
	const [iskaniIzdelek, setIskaniIzdelek] = useState('');
	const [posodobiIskalnik, setPosodobiIskalnik] = useState(false);
	const iskalnoPolje = useRef({});
	const [fokus1, setFokus1] = useState(false);

	const pridobiSteviloVsehProduktov = async () => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/stVsehProduktov`);
			setStVsehProduktov(odziv.data);
		} catch (napaka) {
			console.log(napaka);
		}
	};
	const pridobiKategorije = async () => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/kategorije`);

			setKategorijenaVoljo([...odziv.data]);
		} catch (napaka) {
			console.log(napaka);
		}
	};
	const filtriraj = async (dodatno, kategorije) => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/filtriranje`, {
				params: {
					steviloIzdelkov: 6,
					kategorijeF: kategorije,
					cenaF: cenaF,
					popustF: popustF,
					brezPodvajanj: props.prikazaniProdukti.map((a) => a.ID_izdelka),
				},
			});
			setStVsehProduktov(odziv.data.stProduktovKiUstrezajoFiltru);

			odziv.data.produkti.forEach(async (element) => {
				let rezultat = await axios.get(
					`http://localhost:${global.config.port}/api/administrator/pridobiSliko`,
					{
						method: 'get',
						responseType: 'blob',
						params: {
							ID_izdelka: element.ID_izdelka,
						},
					}
				);

				element.kolicina = 0;
				if (rezultat.data.size === 0) {
					element.slika = null;
				} else {
					element.slika = URL.createObjectURL(rezultat.data);
				}
			});

			if (dodatno === undefined || dodatno) {
				props.setPrikazaniProdukti([...props.prikazaniProdukti, ...odziv.data.produkti]);
			} else {
				props.setPrikazaniProdukti([...odziv.data.produkti]);
			}
		} catch (napaka) {
			console.log(napaka);
		}
	};
	const pridobiIzdelkePoIskalnemNizu = async () => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/izdelki`, {
				params: {
					iskalniNiz: iskalniNiz,
				},
			});
			setTabelaPredlogov(odziv.data);
		} catch (napaka) {
			console.log(napaka);
		}
	};
	const pridobiIzdelek = async () => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/iskaniIzdelek`, {
				params: {
					ime: iskaniIzdelek,
				},
			});

			if (
				odziv !== null &&
				odziv !== undefined &&
				odziv.data !== null &&
				odziv.data !== undefined &&
				odziv.data !== ''
			) {
				odziv.data.forEach(async (element) => {
					let rezultat = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/pridobiSliko`,
						{
							method: 'get',
							responseType: 'blob',
							params: {
								ID_izdelka: element.ID_izdelka,
							},
						}
					);
					element.kolicina = 0;
					if (rezultat.data.size === 0) {
						element.slika = null;
					} else {
						element.slika = URL.createObjectURL(rezultat.data);
					}
				});
				props.setPrikazaniProdukti([...odziv.data]);
				setStVsehProduktov(odziv.data.length);
			} else {
				setIskaniIzdelek('');
				setTabelaPredlogov([]);
				setIskalniNiz('');
			}
		} catch (napaka) {
			console.log(napaka);
		}
	};

	useEffect(() => {
		console.log('effecting');
		pridobiKategorije();
		pridobiSteviloVsehProduktov();
		//setKategorijeF(kategorijeNaVoljo);
	}, []);

	if (iskalniNiz !== '' && posodobiIskalnik) {
		pridobiIzdelkePoIskalnemNizu();
		setPosodobiIskalnik(false);
	}
	if (!fokus1) {
		if (iskalniNiz !== '') {
			setIskalniNiz('');
		}
		if (iskalnoPolje.current !== null && iskalnoPolje.current !== undefined && iskalnoPolje.current !== '') {
			iskalnoPolje.current.value = '';
		}
	}

	return (
		<div className='filtriInIzdelki'>
			<div
				className='filtri'
				onClick={(e) => {
					setFokus1(false);
				}}>
				<div style={{ fontSize: '24px', fontWeight: '650', maxWidth: '200px' }}>Filtriranje izdelkov</div>
				<form
					ref={filtri}
					onSubmit={(e) => {
						e.preventDefault();
						if (cenaF.od !== undefined) {
							od.current.value = cenaF.od;
						} else {
							od.current.value = '';
						}
						if (cenaF.do !== undefined) {
							Do.current.value = cenaF.do;
						} else {
							Do.current.value = '';
						}

						if (isNaN(parseFloat(cenaF.od)) || parseFloat(cenaF.od) < 0) {
							cenaF.od = undefined;
						}
						if (isNaN(parseFloat(cenaF.do)) || parseFloat(cenaF.do) < 0) {
							cenaF.do = undefined;
						}
						props.prikazaniProdukti = []; // nujno pred filtrireanjem, da ne vzame prejsnjih izdelkov kot podvojene
						filtriraj(false, kategorijeF);
						if (
							(kategorijeF === undefined || kategorijeF.length === 0) &&
							(cenaF === undefined || (cenaF.od === undefined && cenaF.do === undefined)) &&
							popustF === 0
						) {
							pridobiSteviloVsehProduktov();
						}
					}}>
					<div className='filter'>
						<div className='nasloviFiltrov'>Po kategoriji izdelka</div>
						{kategorijeNaVoljo.map((kategorija) => {
							return (
								<div className='potrditvenoPolje' key={kategorija.kategorija}>
									<input
										className='kvadrat'
										id={kategorija.kategorija}
										type='checkbox'
										value={kategorija.kategorija}
										onChange={(e) => {
											if (e.target.checked && !kategorijeF.includes(kategorija.kategorija)) {
												setKategorijeF([...kategorijeF, e.target.value]);
											} else {
												let indeks = kategorijeF.indexOf(kategorija.kategorija);
												if (indeks > -1) {
													kategorijeF.splice(indeks, 1);
												}
											}
										}}
									/>
									<label>{kategorija.kategorija}</label>
								</div>
							);
						})}
					</div>
					<div className='filter'>
						<div className='nasloviFiltrov'>Po ceni</div>
						<div className='potrditvenoPolje' style={{ flexDirection: 'row' }}>
							<div className='filtriranjePoCeni'>
								Od
								<input
									ref={od}
									type='text'
									className='poljeZaVnosCene'
									placeholder={cenaF.od === undefined ? '-' : undefined}
									onChange={(e) => {
										e.preventDefault();
										if (
											!isNaN(parseInt(e.target.value)) &&
											parseInt(e.target.value) > 0 &&
											(cenaF.do === undefined || parseInt(e.target.value) < parseInt(cenaF.do))
										) {
											setCenaF({ ...cenaF, od: e.target.value });
										} else {
											setCenaF({ ...cenaF, od: undefined });
										}
									}}></input>
								€
							</div>
							<div className='filtriranjePoCeni'>
								do
								<input
									ref={Do}
									type='text'
									className='poljeZaVnosCene'
									placeholder={cenaF.do === undefined ? '-' : undefined}
									onChange={(e) => {
										e.preventDefault();
										if (
											!isNaN(parseInt(e.target.value)) &&
											parseInt(e.target.value) > 0 &&
											(cenaF.od === undefined || parseInt(e.target.value) > parseInt(cenaF.od))
										) {
											setCenaF({ ...cenaF, do: e.target.value });
										} else {
											setCenaF({ ...cenaF, do: undefined });
										}
									}}></input>
								€
							</div>
						</div>
					</div>
					<div className='filter'>
						<div className='nasloviFiltrov'>Po popustu</div>
						<div className='potrditvenoPolje'>
							<input
								type='radio'
								value={0}
								name='popusti'
								defaultChecked
								onChange={(e) => {
									setPopustF(e.target.value);
								}}
							/>
							<label>z in brez popustov</label>
						</div>
						<div className='potrditvenoPolje'>
							<input
								type='radio'
								value={5}
								name='popusti'
								onChange={(e) => {
									setPopustF(e.target.value);
								}}
							/>
							<label>več kot 5 % popust</label>
						</div>
						<div className='potrditvenoPolje'>
							<input
								type='radio'
								value={10}
								name='popusti'
								onChange={(e) => {
									setPopustF(e.target.value);
								}}
							/>
							<label>več kot 10 % popust</label>
						</div>
					</div>
					<div className='filtriranje'>
						<button className='gumbFiltriranje' type='submit'>
							Filtriraj <Funnel size={22} style={{ marginLeft: '4px' }} />
						</button>
					</div>
				</form>
			</div>
			<div>
				<div
					className='iskanjeProduktov'
					style={{ zIndex: '999999999' }}
					onFocus={(e) => {
						e.stopPropagation();
						setFokus1(true);
					}}>
					<div style={{ fontSize: '24px', fontWeight: '650' }}>Iskanje izdelkov</div>
					<div
						className='iskanjeIzdelkov'
						onFocus={(e) => {
							setFokus1(true);
						}}>
						<div>
							<label className='oznaka'>Ime izdelka:</label>
						</div>

						<div className={iskalniNiz === '' ? '' : 'iskalnik'}>
							<input
								ref={iskalnoPolje}
								style={{ width: 'auto' }}
								className='tekstovnoPolje'
								placeholder='Vsi izdelki'
								onChange={(e) => {
									e.preventDefault();
									setIskalniNiz(e.target.value);
									setPosodobiIskalnik(true);
								}}
								onFocus={(e) => {
									setFokus1(true);
								}}></input>
							<div className={iskalniNiz === '' ? 'nevidniPredlogi' : 'vidniPredlogi'}>
								{tabelaPredlogov !== null && tabelaPredlogov.length > 0 && iskalniNiz !== '' ? (
									tabelaPredlogov.map((predlog) => {
										return (
											<div
												title={predlog.ime}
												key={predlog.ime}
												className='predlog'
												onClick={(e) => {
													e.preventDefault();
													e.stopPropagation();
													iskalnoPolje.current.focus();
													setFokus1(true);
													setIskaniIzdelek(predlog.ime);
													setIskalniNiz('');
													iskalnoPolje.current.value = predlog.ime;
												}}
												onFocus={(e) => {
													iskalnoPolje.current.focus();
													setFokus1(true);
												}}>
												{predlog.ime}
											</div>
										);
									})
								) : (
									<></>
								)}
							</div>
						</div>
						<div className='iskanje2'>
							<button
								disabled={props.prikazaniProdukti.length < 0 ? 'disabled' : ''}
								className='iskanje1'
								onClick={(e) => {
									e.preventDefault();

									filtri.current.reset();
									kategorijeF = [];
									cenaF = { od: undefined, do: undefined };
									popustF = 0;
									if (iskaniIzdelek === '' && iskalnoPolje.current.value === '') {
										props.prikazaniProdukti = [];
										filtriraj(false, kategorijeF);
									} else {
										pridobiIzdelek();
									}

									setIskaniIzdelek('');
									setPosodobiIskalnik(false);
									setTabelaPredlogov([]);
									setIskalniNiz('');
									iskalnoPolje.current.value = '';
								}}>
								{iskaniIzdelek === '' && iskalnoPolje.current.value === '' ? (
									<ArrowCounterClockwise size={22} weight='duotone' />
								) : (
									<MagnifyingGlass size={22} weight='duotone' />
								)}
							</button>
						</div>
					</div>
				</div>
				<PrikazProduktov
					setFokus1={setFokus1}
					props={props}
					filtriraj={filtriraj}
					stVsehProduktov={stVsehProduktov}
					kategorijeF={kategorijeF}
					filtri={filtri}
				/>
			</div>
		</div>
	);
};

export default Nakupovanje;
