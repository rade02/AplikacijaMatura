import axios from 'axios';
import { CaretCircleLeft, X } from 'phosphor-react';
import { useRef, useState, useEffect } from 'react';

const Podrobnosti = ({
	niIzbrisa,
	setDatoteka,
	naloziDatoteko,
	jeStranka,
	predmet,
	prejsnjeStanjeAdmin,
	setStanjeAdmin,
	tabela,
	setTabela,
	SQLstavek,
}) => {
	const [oddelek, setOddelek] = useState(predmet.oddelek);
	const poljeOddelek = useRef(null);
	const [placa, setPlaca] = useState(predmet.placa);
	const [uporabniskoIme, setUporabniskoIme] = useState(null);
	const poljePlaca = useRef(null);
	const [izdelek, setIzdelek] = useState(predmet);
	const [opravljeno, setOpravljeno] = useState(false);
	const [napaka, setNapaka] = useState(null);
	const [DB, setDB] = useState(null);

	useEffect(() => {
		if (predmet === null) {
			setDB(null);
			return (
				<div>
					<div>Prišlo je do napake pri prikazu podrobnosti</div>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(prejsnjeStanjeAdmin);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</div>
			);
		} else if (predmet.ID_izdelka !== null && predmet.ID_izdelka !== undefined) {
			setDB({ DB: 'Izdelki', IDtip: 'ID_izdelka' });
		} else if (predmet.ID_racuna !== null && predmet.ID_racuna !== undefined) {
			setDB({ DB: 'Racuni', IDtip: 'ID_racuna' });
		} else if (predmet.ID_narocila !== null && predmet.ID_narocila !== undefined) {
			setDB({ DB: 'Narocila', IDtip: 'ID_narocila' });
		}
	}, []);

	const izbris = async () => {
		if (DB !== null) {
			try {
				await axios.post(`http://localhost:${global.config.port}/api/administrator/izbrisiElement`, {
					DB: DB.DB,
					IDtip: DB.IDtip,
					ID: predmet[DB.IDtip],
				});
				setTabela(null);
			} catch (napaka) {
				console.log(napaka);
			}
		}
	};

	const spremeniOddelek = async () => {
		try {
			if (oddelek.length <= 100) {
				await axios.post(`http://localhost:${global.config.port}/api/administrator/urediOddelek`, {
					noviOddelek: oddelek,
					uporabnisko_ime: uporabniskoIme,
				});
				setNapaka('Podatki spremenjeni');
			} else {
				setNapaka('Vneseni podatki niso skladni z definicijami polj');
				console.log('Napaka pri vnosu podatkov');
			}
		} catch (napaka) {
			console.log(napaka);
		}
	};
	const spremeniPlaco = async () => {
		try {
			if (placa < 0 || isNaN(parseFloat(placa))) {
				setNapaka('Vneseni podatki niso skladni z definicijami polj');
				console.log('Napaka pri vnosu podatkov');
			} else {
				await axios.post(`http://localhost:${global.config.port}/api/administrator/urediPlaco`, {
					novaPlaca: placa,
					uporabnisko_ime: uporabniskoIme,
				});
				setNapaka('Podatki spremenjeni');
			}
		} catch (napaka) {
			console.log(napaka);
		}
	};
	const spremeniIzdelek = async () => {
		try {
			if (
				izdelek.ime !== null &&
				izdelek.ime.length <= 40 &&
				izdelek.kategorija !== null &&
				parseInt(izdelek.kategorija.length) <= 20 &&
				izdelek.cena_za_kos !== null &&
				!isNaN(parseFloat(izdelek.cena_za_kos)) &&
				izdelek.kosov_na_voljo !== null &&
				!isNaN(parseInt(izdelek.kosov_na_voljo)) &&
				(izdelek.kratek_opis === null || parseInt(izdelek.kratek_opis.length) <= 40) &&
				parseInt(izdelek.popust) >= 0 &&
				parseInt(izdelek.popust) <= 100 &&
				!isNaN(parseInt(izdelek.popust))
			) {
				await axios.post(`http://localhost:${global.config.port}/api/administrator/urediIzdelek`, {
					izdelek: izdelek,
				});
				setNapaka('Podatki spremenjeni');
			} else {
				setNapaka('Vneseni podatki niso skladni z definicijami polj');
				console.log('Napaka pri vnosu podatkov');
			}
		} catch (napaka) {
			console.log(napaka);
		}
	};
	const spremeniNarocilo = async () => {
		try {
			await axios.post(`http://localhost:${global.config.port}/api/administrator/urediNarocilo`, {
				ID_narocila: predmet.ID_narocila,
			});
			await axios.post(`http://localhost:${global.config.port}/api/administrator/izdajRacun`, {
				ID_narocila: predmet.ID_narocila,
				kupec: predmet.imeStranke + ' ' + predmet.priimekStranke,
				datumIzdaje: predmet.datum,
			});
			setNapaka('Podatki spremenjeni');
		} catch (napaka) {
			console.log(napaka);
		}
	};

	return (
		<div className='podrobnosti'>
			<button
				className='gumbNazaj'
				onClick={(e) => {
					e.preventDefault();
					console.log('prvi');
					setStanjeAdmin(prejsnjeStanjeAdmin);
					if (SQLstavek === null || SQLstavek === undefined) {
						setTabela(null);
					}
				}}>
				<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
				<div>Nazaj</div>
			</button>
			<div className='podrobniPodatki'>
				{(predmet.uporabnisko_ime === null || predmet.uporabnisko_ime === undefined) &&
				(predmet.ID === null || predmet.ID === undefined) &&
				niIzbrisa !== null &&
				!niIzbrisa &&
				!jeStranka ? (
					<button
						className='posiljanje'
						style={{ color: 'red', marginTop: '0px', background: 'white' }}
						onClick={(e) => {
							e.preventDefault();
							izbris();
							setTabela(null);
							setStanjeAdmin(prejsnjeStanjeAdmin);
						}}>
						<X size={25} style={{ marginRight: '5px' }} />
						<div>Izbriši iz PB</div>
					</button>
				) : (
					<></>
				)}

				<table className='tabela'>
					<tbody>
						{Object.keys(predmet).map((element) => {
							return (
								<tr key={element}>
									<td>{element}:</td>
									{element === 'vloga' ? (
										<td>
											{predmet[element] === 0
												? 'administrator'
												: predmet[element] === 1
												? 'zaposleni'
												: predmet[element] === 2
												? 'stranka'
												: predmet[element] === 3
												? 'računovodja'
												: 'nedoločeno'}
										</td>
									) : element === 'omogocen' ? (
										<td>{predmet[element] === 1 ? 'omogočen' : 'onemogočen'}</td>
									) : element === 'geslo' ? (
										<td>{predmet[element]}</td>
									) : element === 'placa' ? (
										<td>
											<input
												ref={poljePlaca}
												type='text'
												defaultValue={predmet[element] + ' €'}
												style={{ minWidth: '60px' }}
												onChange={(e) => {
													e.preventDefault();
													if (!isNaN(parseFloat(poljePlaca.current.value))) {
														setPlaca(parseFloat(poljePlaca.current.value));
														setUporabniskoIme(predmet.uporabnisko_ime);
														setNapaka(null);
													}
												}}></input>
											<button
												className='potrdi'
												onClick={(e) => {
													e.preventDefault();
													if (!isNaN(placa)) {
														spremeniPlaco();
													}
												}}>
												Potrdi
											</button>
										</td>
									) : element === 'oddelek' ? (
										<td>
											<input
												ref={poljeOddelek}
												type='text'
												defaultValue={predmet[element]}
												style={{ minWidth: '60px' }}
												onChange={(e) => {
													e.preventDefault();
													if (poljeOddelek.current.value.length <= 100) {
														setOddelek(poljeOddelek.current.value);
														setUporabniskoIme(predmet.uporabnisko_ime);
														setNapaka(null);
													}
												}}></input>
											<button
												className='potrdi'
												onClick={(e) => {
													e.preventDefault();

													spremeniOddelek();
												}}>
												Potrdi
											</button>
										</td>
									) : element === 'ime' &&
									  (predmet.uporabnisko_ime === null || predmet.uporabnisko_ime === undefined) ? (
										<td>
											<input
												type='text'
												defaultValue={predmet[element]}
												style={{ minWidth: '200px' }}
												onChange={(e) => {
													e.preventDefault();
													setIzdelek({ ...izdelek, ime: e.target.value });
													setNapaka(null);
												}}
												maxLength={40}></input>
											<button
												className='potrdi'
												onClick={(e) => {
													e.preventDefault();
													spremeniIzdelek();
												}}>
												Potrdi
											</button>
										</td>
									) : element === 'kategorija' ? (
										<td>
											<input
												type='text'
												defaultValue={predmet[element]}
												style={{ minWidth: '200px' }}
												onChange={(e) => {
													e.preventDefault();
													setIzdelek({ ...izdelek, kategorija: e.target.value });
													setNapaka(null);
												}}
												maxLength={20}></input>
											<button
												className='potrdi'
												onClick={(e) => {
													e.preventDefault();
													spremeniIzdelek();
												}}>
												Potrdi
											</button>
										</td>
									) : element === 'cena_za_kos' ? (
										<td>
											<input
												type='text'
												defaultValue={predmet[element] + ' €'}
												style={{ minWidth: '200px' }}
												onChange={(e) => {
													e.preventDefault();
													setIzdelek({ ...izdelek, cena_za_kos: parseFloat(e.target.value) });
													setNapaka(null);
												}}></input>
											<button
												className='potrdi'
												onClick={(e) => {
													e.preventDefault();
													spremeniIzdelek();
												}}>
												Potrdi
											</button>
										</td>
									) : element === 'kosov_na_voljo' ? (
										<td>
											<input
												type='text'
												defaultValue={predmet[element]}
												style={{ minWidth: '200px' }}
												onChange={(e) => {
													e.preventDefault();
													setIzdelek({ ...izdelek, kosov_na_voljo: e.target.value });
													setNapaka(null);
												}}></input>
											<button
												className='potrdi'
												onClick={(e) => {
													e.preventDefault();
													spremeniIzdelek();
												}}>
												Potrdi
											</button>
										</td>
									) : element === 'kratek_opis' ? (
										<td>
											<input
												type='text'
												defaultValue={predmet[element]}
												style={{ minWidth: '200px' }}
												onChange={(e) => {
													e.preventDefault();
													setIzdelek({ ...izdelek, kratek_opis: e.target.value });
													setNapaka(null);
												}}
												maxLength={40}></input>
											<button
												className='potrdi'
												onClick={(e) => {
													e.preventDefault();
													spremeniIzdelek();
												}}>
												Potrdi
											</button>
										</td>
									) : element === 'informacije' ? (
										<td>
											<textarea
												type='text'
												defaultValue={predmet[element]}
												style={{ minWidth: '200px' }}
												onChange={(e) => {
													e.preventDefault();
													setIzdelek({ ...izdelek, informacije: e.target.value });
													setNapaka(null);
												}}></textarea>
											<button
												className='potrdi'
												onClick={(e) => {
													e.preventDefault();
													spremeniIzdelek();
												}}>
												Potrdi
											</button>
										</td>
									) : element === 'popust' ? (
										<td>
											<input
												type='text'
												defaultValue={predmet[element] + ' %'}
												style={{ minWidth: '200px' }}
												onChange={(e) => {
													e.preventDefault();
													setIzdelek({ ...izdelek, popust: parseInt(e.target.value) });
													setNapaka(null);
												}}></input>
											<button
												className='potrdi'
												onClick={(e) => {
													e.preventDefault();
													spremeniIzdelek();
												}}>
												Potrdi
											</button>
										</td>
									) : element === 'slika' ? (
										predmet.slika === null ? (
											<td style={{ minWidth: '200px' }}>
												<label>V bazi ni naložene slike</label>
												<br />
												<input
													style={{ minWidth: '300px' }}
													type='file'
													encType='multipart/form-data'
													name='slika'
													accept='image/gif, image/jpeg, image/png'
													onChange={(e) => {
														setDatoteka(e.target.files[0]);
													}}
												/>
												<button
													className='potrdi'
													onClick={(e) => {
														e.preventDefault();
														try {
															naloziDatoteko();
															setNapaka('Podatki spremenjeni');
														} catch (napaka) {
															setNapaka(napaka);
														}
													}}>
													Naloži sliko
												</button>
											</td>
										) : (
											<td style={{ minWidth: '200px' }}>
												<img
													src={predmet.slika}
													className='velikaSlika'
													alt={`${predmet.slika !== null ? 'Nalaganje...' : ''}`}
												/>
												<br />
												<input
													style={{ minWidth: '300px' }}
													type='file'
													encType='multipart/form-data'
													name='slika'
													accept='image/gif, image/jpeg, image/png'
													onChange={(e) => {
														setDatoteka(e.target.files[0]);
													}}
												/>
												<button
													className='potrdi'
													onClick={async (e) => {
														e.preventDefault();
														try {
															naloziDatoteko();
															setNapaka('Podatki spremenjeni');
														} catch (napaka) {
															setNapaka(napaka);
														}
													}}>
													Naloži novo sliko
												</button>
											</td>
										)
									) : element === 'opravljeno' && !jeStranka ? (
										<td>
											{predmet[element] === 1 || opravljeno === true ? (
												<div>Opravljeno</div>
											) : (
												<button
													className='potrdi'
													disabled={
														predmet[element] === 1 || opravljeno === true ? 'disabled' : ''
													}
													onClick={(e) => {
														e.preventDefault();
														setOpravljeno(true);
														spremeniNarocilo();
													}}>
													Nastavi kot opravljeno
												</button>
											)}
										</td>
									) : element === 'postnina' || element === 'za_placilo' ? (
										<td>{predmet[element].toFixed(2)} €</td>
									) : (
										<td>{predmet[element]}</td>
									)}
								</tr>
							);
						})}
					</tbody>
				</table>
				{tabela !== undefined &&
				tabela !== null &&
				tabela.podatkiOIzdelkih !== null &&
				tabela.podatkiOIzdelkih !== undefined &&
				tabela.imenaIzdelkov !== null &&
				tabela.imenaIzdelkov !== undefined ? (
					<>
						<label className='naslov'>Izdelki pri naročilu:</label>
						<table className='tabela'>
							<tbody>
								<tr>
									<td>
										<b>Ime izdelka</b>
									</td>
									<td>
										<b>Količina</b>
									</td>
									<td>
										<b>Cena za kos</b>
									</td>
								</tr>
								{tabela.podatkiOIzdelkih.map((izdelek) => {
									return (
										<tr key={izdelek.ID_izdelka + '' + izdelek.ID_izdelka}>
											{Object.keys(izdelek).map((key) => {
												if (key === 'ID_izdelka') {
													let imeIzdelka = tabela.imenaIzdelkov.filter(
														(ime) => ime.ID_izdelka === izdelek[key]
													);
													return <td key={key + '' + izdelek[key]}>{imeIzdelka[0].ime}</td>;
												} else if (key === 'cena') {
													return (
														<td key={key + '' + izdelek[key]}>
															{(izdelek[key] / parseFloat(izdelek.kolicina)).toFixed(2)} €
														</td>
													);
												} else if (key !== 'ID_narocila') {
													return <td key={key + '' + izdelek[key]}>{izdelek[key]}</td>;
												} else return <></>;
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					</>
				) : (
					<></>
				)}
			</div>
			{napaka !== null ? <>{napaka}</> : <></>}
			<button
				className='gumbNazaj'
				onClick={(e) => {
					e.preventDefault();
					console.log('drugi');
					setStanjeAdmin(prejsnjeStanjeAdmin);
					setTabela(null);
				}}>
				<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
				<div>Nazaj</div>
			</button>
		</div>
	);
};

export default Podrobnosti;
