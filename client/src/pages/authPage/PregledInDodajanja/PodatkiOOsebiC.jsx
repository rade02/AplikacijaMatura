import axios from 'axios';
import { CaretCircleLeft } from 'phosphor-react';
import { useRef, useState } from 'react';

const PodatkiOOsebi = ({ oseba, prejsnjeStanjeAdmin, setStanjeAdmin, tabela, setTabela }) => {
	const PORT = 3005; // !!!
	const [placa, setPlaca] = useState(oseba.placa);
	const [uporabniskoIme, setUporabniskoIme] = useState(null);
	const poljePlaca = useRef(null);
	const [izdelek, setIzdelek] = useState(oseba);
	const [opravljeno, setOpravljeno] = useState(null);
	const [napaka, setNapaka] = useState(null);

	if (oseba === null) {
		return (
			<div>
				<div>Prišlo je do napake pri prikazu osebe</div>
				<button
					className='backBtn'
					onClick={(e) => {
						e.preventDefault();
						setStanjeAdmin(prejsnjeStanjeAdmin);
					}}>
					<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
					<div>Nazaj</div>
				</button>
			</div>
		);
	}

	const handleChangePlaca = async () => {
		try {
			if (placa < 0 || isNaN(parseFloat(placa))) {
				setNapaka('Vneseni podatki niso skladni z definicijami polj');
				console.log('Napaka pri vnosu podatkov');
				console.log(placa);
			} else {
				const result = await axios.post(`http://localhost:${PORT}/api/admin/urediPlaco`, {
					novaPlaca: placa,
					uporabnisko_ime: uporabniskoIme,
				});
				setNapaka('Podatki spremenjeni');
			}
		} catch (onRejectedError) {
			console.log(onRejectedError);
		}
	};
	const handleChangeIzdelek = async () => {
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
				const result = await axios.post(`http://localhost:${PORT}/api/admin/urediIzdelek`, {
					izdelek: izdelek,
				});
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
	const handleChangeNarocilo = async () => {
		try {
			if (parseInt(opravljeno) !== 0 && parseInt(opravljeno) !== 1) {
				setNapaka('Vneseni podatki niso skladni z definicijami polj');
				console.log('Napaka pri vnosu podatkov');
				console.log(opravljeno);
			} else {
				const result = await axios.post(`http://localhost:${PORT}/api/admin/urediNarocilo`, {
					opravljeno: parseInt(opravljeno),
					ID_narocila: uporabniskoIme,
				});
				setNapaka('Podatki spremenjeni');
			}
		} catch (onRejectedError) {
			console.log(onRejectedError);
		}
	};

	return (
		<div>
			<div className='podrobniPodatki'>
				<table className='tabela'>
					<tbody>
						{Object.keys(oseba).map((pr) => {
							return (
								<tr>
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
												onClick={(e) => {
													e.preventDefault();
													if (!isNaN(placa)) {
														handleChangePlaca();
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
												onClick={(e) => {
													e.preventDefault();
													handleChangeIzdelek();
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
												onClick={(e) => {
													e.preventDefault();
													handleChangeIzdelek();
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
												onClick={(e) => {
													e.preventDefault();
													handleChangeIzdelek();
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
												onClick={(e) => {
													e.preventDefault();
													handleChangeIzdelek();
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
												onClick={(e) => {
													e.preventDefault();
													handleChangeIzdelek();
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
												onClick={(e) => {
													e.preventDefault();
													handleChangeIzdelek();
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
												onClick={(e) => {
													e.preventDefault();
													handleChangeIzdelek();
												}}>
												Potrdi
											</button>
										</td>
									) : pr === 'opravljeno' ? (
										<td>
											<input
												type='text'
												defaultValue={oseba[pr]}
												style={{ minWidth: '50px' }}
												onChange={(e) => {
													e.preventDefault();
													setOpravljeno(e.target.value);
													setUporabniskoIme(oseba.ID_narocila);
													setNapaka(null);
												}}></input>
											<button
												onClick={(e) => {
													e.preventDefault();
													handleChangeNarocilo();
												}}>
												Potrdi
											</button>
										</td>
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
													return <td key={key + '' + izdelek[key]}>{izdelek[key]} €</td>;
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
				className='backBtn'
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
