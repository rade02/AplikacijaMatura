import axios from 'axios';
import { CaretCircleLeft, X } from 'phosphor-react';
import { useRef, useState, useEffect } from 'react';

const PodatkiOOsebi = ({
	niIzbrisa,
	file,
	setFile,
	uploadFile,
	stranka,
	oseba,
	setOseba,
	prejsnjeStanjeAdmin,
	setStanjeAdmin,
	tabela,
	setTabela,
}) => {
	const [placa, setPlaca] = useState(oseba.placa);
	const [uporabniskoIme, setUporabniskoIme] = useState(null);
	const poljePlaca = useRef(null);
	const [izdelek, setIzdelek] = useState(oseba);
	const [opravljeno, setOpravljeno] = useState(false);
	const [napaka, setNapaka] = useState(null);
	const [DB, setDB] = useState(null);
	//console.log(oseba);
	useEffect(() => {
		//console.log(oseba);
		if (oseba === null) {
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
		} else if (oseba.ID_izdelka !== null && oseba.ID_izdelka !== undefined) {
			setDB({ DB: 'Izdelki', IDtip: 'ID_izdelka' });
		} else if (oseba.ID_racuna !== null && oseba.ID_racuna !== undefined) {
			setDB({ DB: 'Racuni', IDtip: 'ID_racuna' });
		} else if (oseba.ID_narocila !== null && oseba.ID_narocila !== undefined) {
			setDB({ DB: 'Narocila', IDtip: 'ID_narocila' });
		}
	}, []);
	//console.log(DB);

	const izbris = async () => {
		if (DB !== null) {
			console.log('brisem...');
			try {
				const result = await axios.post(
					`http://localhost:${global.config.port}/api/administrator/izbrisiElement`,
					{
						DB: DB.DB,
						IDtip: DB.IDtip,
						ID: oseba[DB.IDtip],
					}
				);
				setTabela(null);
			} catch (error) {
				console.log(error);
			}
		}
	};

	const spremeniPlaco = async () => {
		try {
			if (placa < 0 || isNaN(parseFloat(placa))) {
				setNapaka('Vneseni podatki niso skladni z definicijami polj');
				console.log('Napaka pri vnosu podatkov');
				console.log(placa);
			} else {
				const result = await axios.post(
					`http://localhost:${global.config.port}/api/administrator/urediPlaco`,
					{
						novaPlaca: placa,
						uporabnisko_ime: uporabniskoIme,
					}
				);
				setNapaka('Podatki spremenjeni');
			}
		} catch (onRejectedError) {
			console.log(onRejectedError);
		}
	};
	const spremeniIzdelek = async () => {
		try {
			if (
				izdelek.ime !== null &&
				izdelek.ime.length <= 40 &&
				izdelek.kategorija !== null &&
				izdelek.kategorija.length <= 20 &&
				izdelek.cena_za_kos !== null &&
				!isNaN(parseFloat(izdelek.cena_za_kos)) &&
				izdelek.kosov_na_voljo !== null &&
				!isNaN(parseInt(izdelek.kosov_na_voljo)) &&
				izdelek.kratek_opis.length <= 40 &&
				parseInt(izdelek.popust) >= 0 &&
				parseInt(izdelek.popust) <= 100 &&
				!isNaN(parseInt(izdelek.popust))
			) {
				const result = await axios.post(
					`http://localhost:${global.config.port}/api/administrator/urediIzdelek`,
					{
						izdelek: izdelek,
					}
				);
				setNapaka('Podatki spremenjeni');
			} else {
				setNapaka('Vneseni podatki niso skladni z definicijami polj');
				console.log('Napaka pri vnosu podatkov');
				console.log(izdelek);
			}
		} catch (error) {
			console.log(error);
		}
	};
	const spremeniNarocilo = async () => {
		try {
			const result = await axios.post(
				`http://localhost:${global.config.port}/api/administrator/urediNarocilo`,
				{
					ID_narocila: oseba.ID_narocila,
				}
			);
			const result2 = await axios.post(
				`http://localhost:${global.config.port}/api/administrator/izdajRacun`,
				{
					ID_narocila: oseba.ID_narocila,
					kupec: oseba.imeStranke + ' ' + oseba.priimekStranke,
					datumIzdaje: oseba.datum,
				}
			);
			// TODO: ustvari racun
			setNapaka('Podatki spremenjeni');
			//}
		} catch (onRejectedError) {
			console.log(onRejectedError);
		}
	};
	//console.log(oseba);
	//console.log(niIzbrisa);

	return (
		<div className='podrobnosti'>
			<button
				className='gumbNazaj'
				onClick={(e) => {
					e.preventDefault();
					setStanjeAdmin(prejsnjeStanjeAdmin);
					setTabela(null);
				}}>
				<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
				<div>Nazaj</div>
			</button>
			<div className='podrobniPodatki'>
				{(oseba.uporabnisko_ime === null || oseba.uporabnisko_ime === undefined) &&
				(oseba.ID === null || oseba.ID === undefined) &&
				niIzbrisa !== null &&
				!niIzbrisa ? (
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
						{Object.keys(oseba).map((pr) => {
							return (
								<tr key={pr}>
									<td>{pr}:</td>
									{pr === 'vloga' ? (
										<td>
											{oseba[pr] === 0
												? 'administrator'
												: oseba[pr] === 1
												? 'zaposleni'
												: oseba[pr] === 2
												? 'stranka'
												: oseba[pr] === 3
												? 'računovodja'
												: 'nedoločeno'}
										</td>
									) : pr === 'omogocen' ? (
										<td>{oseba[pr] === 1 ? 'omogočen' : 'onemogočen'}</td>
									) : pr === 'geslo' ? (
										<td>{oseba[pr]}</td>
									) : pr === 'placa' ? (
										<td>
											<input
												ref={poljePlaca}
												type='text'
												defaultValue={oseba[pr] + ' €'}
												style={{ minWidth: '60px' }}
												onChange={(e) => {
													e.preventDefault();
													if (!isNaN(parseFloat(poljePlaca.current.value))) {
														setPlaca(parseFloat(poljePlaca.current.value));
														setUporabniskoIme(oseba.uporabnisko_ime);
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
									) : pr === 'ime' ? (
										<td>
											<input
												type='text'
												defaultValue={oseba[pr]}
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
									) : pr === 'kategorija' ? (
										<td>
											<input
												type='text'
												defaultValue={oseba[pr]}
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
									) : pr === 'cena_za_kos' ? (
										<td>
											<input
												type='text'
												defaultValue={oseba[pr] + ' €'}
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
									) : pr === 'kosov_na_voljo' ? (
										<td>
											<input
												type='text'
												defaultValue={oseba[pr]}
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
									) : pr === 'kratek_opis' ? (
										<td>
											<input
												type='text'
												defaultValue={oseba[pr]}
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
									) : pr === 'informacije' ? (
										<td>
											<textarea
												type='text'
												defaultValue={oseba[pr]}
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
									) : pr === 'popust' ? (
										<td>
											<input
												type='text'
												defaultValue={oseba[pr] + ' %'}
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
									) : pr === 'slika' ? (
										oseba.slika === null ? (
											<td style={{ minWidth: '200px' }}>
												<label>V bazi ni naložene slike</label>
												<br />
												<input
													style={{ minWidth: '300px' }}
													type='file'
													encType='multipart/form-data'
													name='image'
													accept='image/gif, image/jpeg, image/png'
													onChange={(e) => {
														setFile(e.target.files[0]);
													}}
												/>
												<button
													className='potrdi'
													onClick={(e) => {
														e.preventDefault();
														try {
															uploadFile();
															setNapaka('Podatki spremenjeni');
														} catch (error) {
															setNapaka(error);
														}
													}}>
													Naloži sliko
												</button>
											</td>
										) : (
											<td style={{ minWidth: '200px' }}>
												<img
													src={oseba.slika}
													className='velikaSlika'
													alt={`${oseba.slika !== null ? 'Nalaganje...' : ''}`}
												/>
												<br />
												<input
													style={{ minWidth: '300px' }}
													type='file'
													encType='multipart/form-data'
													name='image'
													accept='image/gif, image/jpeg, image/png'
													onChange={(e) => {
														setFile(e.target.files[0]);
													}}
												/>
												<button
													className='potrdi'
													onClick={async (e) => {
														e.preventDefault();
														try {
															uploadFile();
															setNapaka('Podatki spremenjeni');
														} catch (error) {
															setNapaka(error);
														}
													}}>
													Naloži novo sliko
												</button>
											</td>
										)
									) : pr === 'opravljeno' && !stranka ? (
										<td>
											{oseba[pr] === 1 || opravljeno === true ? (
												<div>Opravljeno</div>
											) : (
												<button
													className='potrdi'
													disabled={oseba[pr] === 1 || opravljeno === true ? 'disabled' : ''}
													onClick={(e) => {
														e.preventDefault();
														setOpravljeno(true);
														spremeniNarocilo();
													}}>
													Nastavi kot opravljeno
												</button>
											)}
										</td>
									) : pr === 'postnina' || pr === 'za_placilo' ? (
										<td>{oseba[pr].toFixed(2)} €</td>
									) : (
										<td>{oseba[pr]}</td>
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
						<label>Izdelki pri naročilu:</label>
						<table>
							<tbody>
								<tr>
									<td>Ime izdelka</td>
									<td>Količina</td>
									<td>Cena za kos</td>
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
													console.log(izdelek);
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
					setStanjeAdmin(prejsnjeStanjeAdmin);
					setTabela(null);
				}}>
				<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
				<div>Nazaj</div>
			</button>
		</div>
	);
};
/*
{tabela !== undefined || null ? (
							tabela[0].podatkiOIzdelkih.map((izdelek) => {
								return (
									<tr key={izdelek.ID_izdelka + '' + izdelek.ID_izdelka}>
										{Object.keys(izdelek).map((key) => {
											console.log('izdelek[key]');
											console.log(izdelek[key]);
											if (key === 'ID_izdelka') {
												let imeIzdelka = tabela.imenaIzdelkov.filter(
													(ime) => ime.ID_izdelka === izdelek[key]
												);
												console.log('ime izdelka');
												console.log(imeIzdelka);
												return <td key={key + '' + izdelek[key]}>{imeIzdelka.ime}</td>;
											} else return <td key={key + '' + izdelek[key]}>{izdelek[key]}</td>;
										})}
									</tr>
								);
							})
						) : (
							<></>
						)}
*/

export default PodatkiOOsebi;
