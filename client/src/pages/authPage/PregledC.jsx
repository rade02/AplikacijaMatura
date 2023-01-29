import axios from 'axios';
import { CircleWavyCheck, UserCircleMinus, XCircle, UserCirclePlus } from 'phosphor-react';
import { useRef, useState } from 'react';

const Pregled = ({ props }) => {
	//TODO: preveri ce je crka, mora biti stevilka pri inputu
	// TODO: isci po imenu
	const PORT = 3005; // !!!
	const [iskalniKriterij, setIskalniKriterij] = useState(null);
	const [iskalniNiz, setIskalniNiz] = useState(null);

	console.log(props.tabela);
	return (
		<>
			<h2>{props.naslov}</h2>
			<div>
				{props.tabela === null ? (
					<>Napaka</>
				) : (
					<>
						{props.opcije === null ? (
							<div>
								<label>Iskanje po:</label>
								<select
									onClick={(e) => {
										e.preventDefault();
										setIskalniKriterij(e.target.value);
									}}>
									<option value='ID'>ID-ju</option>
									<option value='ime'>imenu</option>
									<option value='priimek'>priimku</option>
									<option value='elektronski_naslov'>e-pošti</option>
								</select>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setIskalniNiz(e.target.value);
									}}
									placeholder='Vnesite iskalni niz'></input>
								<button
									onClick={async (e) => {
										e.preventDefault();
										try {
											let r = await axios.get(`http://localhost:${PORT}/api/admin/osebe`);
											props.setTabela(r.data);
										} catch (error) {
											console.log('Prišlo je do napake');
										}
									}}>
									Išči
								</button>
							</div>
						) : (
							<select
								className='izbirnoPolje'
								onClick={(e) => {
									e.preventDefault();
									props.setFilter(parseInt(e.target.value));
								}}>
								{props.opcije.map((o) => {
									return (
										<option key={o.vrednost} value={o.vrednost}>
											{o.ime}
										</option>
									);
								})}
								)
							</select>
						)}
						<table className='tabela'>
							<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
								{props.naslovnaVrstica.map((he) => {
									return <th key={he}>{he}</th>;
								})}
							</tr>
							{props.tabela.map((el) => {
								if (props.filter === -1) {
									if (props.naslov === 'Pregled oseb') {
										return (
											<tr>
												{Object.keys(el).map((k) => {
													if (
														k === 'ID' ||
														k === 'uporabnisko_ime' ||
														k === 'elektronski_naslov' ||
														k === 'ime' ||
														k === 'priimek'
													)
														return <td>{el[k]}</td>;
													return null;
												})}
											</tr>
										);
									} else {
										return (
											<tr
												key={el.uporabnisko_ime}
												className='vrstica'
												onClick={(e) => {
													e.preventDefault();
													props.setOseba(el);
													props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
													props.setStanjeAdmin(12);
													console.log('prikazi posebej stran o osebi');
												}}>
												<td>{el.uporabnisko_ime}</td>
												<td>{el.geslo}</td>
												<td
													style={{
														backgroundColor:
															el.vloga === 0
																? 'rgba(223, 223, 145, 0.468)'
																: el.vloga === 3
																? 'rgb(240, 222, 178)'
																: el.vloga === 1
																? 'rgb(198, 250, 189)'
																: 'rgb(205, 205, 205)',
													}}>
													<div>
														<input
															disabled={el.vloga === 0 ? 'disabled' : ''}
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
															}}
															onChange={async (e) => {
																e.preventDefault();
																e.stopPropagation();
																if (
																	e.target.value !== '' &&
																	typeof parseInt(e.target.value) === 'number'
																) {
																	try {
																		let res = await axios.post(
																			`http://localhost:${PORT}/api/admin/updtVloga`,
																			{
																				uporabnisko_ime: el.uporabnisko_ime,
																				vloga: e.target.value,
																			}
																		);
																		if (res.data === 'success') props.setTabela(null);
																	} catch (error) {
																		console.log(error);
																	}
																}
															}}
															type='text'
															defaultValue={el.vloga}
															maxLength='1'></input>
														<div>
															{el.vloga === 0
																? '(admin)'
																: el.vloga === 3
																? '(racunovodja)'
																: el.vloga === 1
																? '(zaposleni)'
																: '(stranka)'}
														</div>
													</div>
												</td>
												{el.omogocen === 1 ? (
													<>
														<td>
															<CircleWavyCheck size={22} />
															Omogočen
														</td>
														{el.vloga !== 0 ? (
															<td
																className='omogocanje'
																onClick={async (e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	try {
																		let res = await axios.post(
																			`http://localhost:${PORT}/api/admin/omogoci`,
																			{
																				uporabnisko_ime: el.uporabnisko_ime,
																				omogoci: !el.omogocen,
																			}
																		);
																		if (res.data === 'success') props.setTabela(null);
																	} catch (error) {
																		console.log(error);
																	}
																}}>
																<UserCircleMinus size={22} />
																Onemogoči
															</td>
														) : (
															<td style={{ textAlign: 'center' }}>/</td>
														)}
													</>
												) : el.omogocen === 0 ? (
													<>
														<td>
															<XCircle size={22} />
															Onemogočen
														</td>
														<td
															className='omogocanje'
															onClick={async (e) => {
																e.preventDefault();
																e.stopPropagation();
																try {
																	let res = await axios.post(
																		`http://localhost:${PORT}/api/admin/omogoci`,
																		{
																			uporabnisko_ime: el.uporabnisko_ime,
																			omogoci: !el.omogocen,
																		}
																	);
																	if (res.data === 'success') props.setTabela(null);
																} catch (error) {
																	console.log(error);
																}
															}}>
															<UserCirclePlus size={22} />
															Omogoči
														</td>
													</>
												) : (
													<></>
												)}
											</tr>
										);
									}
								} else {
									return (
										<tr>
											{Object.keys(el).map((k) => {
												console.log(`el[${k}]`);
												console.log(el[k]);
												return <td>{el[k]}</td>;
											})}
										</tr>
									);
									/*
									if (parseInt(el.vloga) === props.filter) {
										return (
											<tr
												key={el.uporabnisko_ime}
												className='vrstica'
												onClick={(e) => {
													e.preventDefault();
													props.setOseba(el);
													props.setStanjeAdmin(12);
													console.log('prikazi posebej stran o osebi');
												}}>
												<td>{el.uporabnisko_ime}</td>
												<td>{el.geslo}</td>
												<td
													style={{
														backgroundColor:
															el.vloga === 0
																? 'rgba(223, 223, 145, 0.468)'
																: el.vloga === 3
																? 'rgb(240, 222, 178)'
																: el.vloga === 1
																? 'rgb(198, 250, 189)'
																: 'rgb(205, 205, 205)',
													}}>
													<div>
														<input
															disabled={el.vloga === 0 ? 'disabled' : ''}
															onClick={(e) => {
																e.preventDefault();
																e.stopPropagation();
															}}
															onChange={async (e) => {
																e.preventDefault();
																e.stopPropagation();
																if (
																	e.target.value !== '' &&
																	typeof parseInt(e.target.value) === 'number'
																) {
																	try {
																		let res = await axios.post(
																			`http://localhost:${PORT}/api/admin/updtVloga`,
																			{
																				uporabnisko_ime: el.uporabnisko_ime,
																				vloga: e.target.value,
																			}
																		);
																		if (res.data === 'success') props.setTabela(null);
																	} catch (error) {
																		console.log(error);
																	}
																}
															}}
															type='text'
															defaultValue={el.vloga}
															maxLength='1'></input>

														{el.vloga === 0
															? '(admin)'
															: el.vloga === 3
															? '(racunovodja)'
															: el.vloga === 1
															? '(zaposleni)'
															: '(stranka)'}
													</div>
												</td>
												{el.omogocen === 1 ? (
													<>
														<td>
															<CircleWavyCheck size={22} />
															Omogočen
														</td>
														{el.vloga !== 0 ? (
															<td
																className='omogocanje'
																onClick={async (e) => {
																	e.preventDefault();
																	e.stopPropagation();
																	try {
																		let res = await axios.post(
																			`http://localhost:${PORT}/api/admin/omogoci`,
																			{
																				uporabnisko_ime: el.uporabnisko_ime,
																				omogoci: !el.omogocen,
																			}
																		);
																		if (res.data === 'success') props.setTabela(null);
																	} catch (error) {
																		console.log(error);
																	}
																}}>
																<UserCircleMinus size={22} />
																Onemogoči
															</td>
														) : (
															<td style={{ textAlign: 'center' }}>/</td>
														)}
													</>
												) : el.omogocen === 0 ? (
													<>
														<td>
															<XCircle size={22} />
															Onemogočen
														</td>
														<td
															className='omogocanje'
															onClick={async (e) => {
																e.preventDefault();
																e.stopPropagation();
																try {
																	let res = await axios.post(
																		`http://localhost:${PORT}/api/admin/omogoci`,
																		{
																			uporabnisko_ime: el.uporabnisko_ime,
																			omogoci: !el.omogocen,
																		}
																	);
																	if (res.data === 'success') props.setTabela(null);
																} catch (error) {
																	console.log(error);
																}
															}}>
															<UserCirclePlus size={22} />
															Omogoči
														</td>
													</>
												) : (
													<></>
												)}
											</tr>
										);
									} else {
										return <></>;
									}*/
								}
							})}
						</table>
						<button
							onClick={(e) => {
								e.preventDefault();
								props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
								props.setStanjeAdmin(0);
								props.setTabela(null);
								props.setFilter(-1);
							}}>
							Nazaj
						</button>
					</>
				)}
			</div>
		</>
	);
};

export default Pregled;
