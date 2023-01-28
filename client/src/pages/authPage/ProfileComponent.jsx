import axios from 'axios';
import { Pencil, Password, FloppyDisk, ClockCounterClockwise, SignOut } from 'phosphor-react';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import NotificationCard from './NotificationCardComponent';
import UrediProfil from './UrediProfilC';

const Profile = () => {
	const PORT = 3005; // !!!
	const { user, setUser, setIsAuth } = useContext(UserContext);

	const [vloga, setVloga] = useState(null);
	const [msg, setMsg] = useState('');
	const [stanjeAdmin, setStanjeAdmin] = useState(0);
	const [uporabniki, setUporabniki] = useState(null);
	const [filterUporabniki, setFilterUporabniki] = useState(-1);
	// TODO: ime je link in lahko si ogledamo vse podatke ki so shranjeni v bazi o osebah
	const [zaposleni, setZaposleni] = useState(null);

	// TODO: na domaci strani naredi okno ki se pojavi ob izbrisu profila
	// TODO: PREVERI CE JE VNOS PRAVILEN (int, date ...)
	// TODO: ne dela ce refreshamo na profile page in gremo nazaj na prijavo (isAuth se ponastavi, ostalo pa ne)
	// TODO: ne dela ce refreshamo - prikaze napacne podatke
	// ce vnesemo nove podatke v prazno polje in nato pritisnemo Ponastavi, se ne izbriše vsebina
	useEffect(() => {
		const pridobiVlogo = async () => {
			try {
				let response = await axios.get(`http://localhost:${PORT}/api/login/vloga`, {
					params: {
						uporabnisko_ime: user.uporabnisko_ime,
					},
				});
				setVloga(parseInt(response.data));
			} catch (error) {
				console.log(error);
			}
		};
		pridobiVlogo();
	}, [user.uporabnisko_ime]);

	if (vloga === null) {
		// pridobivanje vloge profila
		return <>Nalaganje profila ...</>;
	} else if (parseInt(vloga) === 0) {
		// admin
		if (parseInt(stanjeAdmin) === 0) {
			return (
				<div>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(1);
						}}>
						Profil
					</button>
					<hr />
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(2);
						}}>
						Pregled uporabnikov
					</button>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(3);
						}}>
						Pregled zaposlenih
					</button>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(4);
						}}>
						Pregled strank
					</button>
					<hr />
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(5);
						}}>
						Pregled izdelkov
					</button>
					<hr />
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(6);
						}}>
						Pregled računov
					</button>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(7);
						}}>
						Pregled naročil
					</button>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(8);
						}}>
						Upravljanje s podatkovno bazo (geslo)
					</button>
					<hr />
					<button
						onClick={(e) => {
							e.preventDefault();
							setIsAuth(false);
						}}>
						Odjava <SignOut size={22} />
					</button>
				</div>
			);
		} else if (parseInt(stanjeAdmin) === 1) {
			// profil admin
			return (
				<>
					<NotificationCard />
					<UrediProfil vloga={vloga} setStanjeAdmin={setStanjeAdmin} />
				</>
			);
		} else if (parseInt(stanjeAdmin) === 2) {
			// pregled uporabnikov
			const pridobiInfoOUporabnikih = async () => {
				try {
					let r = await axios.get(`http://localhost:${PORT}/api/admin/uporabniki`);
					setUporabniki(r.data);
				} catch (error) {
					console.log('Prišlo je do napake');
				}
			};
			if (uporabniki === null) pridobiInfoOUporabnikih();
			return (
				<>
					<h2>Pregled uporabnikov</h2>
					<div>
						{uporabniki === null ? (
							<>Napaka</>
						) : (
							<>
								<select
									onClick={(e) => {
										e.preventDefault();
										console.log(e.target.value);
										setFilterUporabniki(parseInt(e.target.value));
									}}>
									<option key='-1' value='-1'>
										Vsi
									</option>
									<option key='0' value='0'>
										Administratorji
									</option>
									<option key='3' value='3'>
										Računovodje
									</option>
									<option key='1' value='1'>
										Zaposleni
									</option>
									<option key='2' value='2'>
										Stranke
									</option>
								</select>
								<div className='userLineHeader'>
									<div>Uporabniško ime</div>
									<div>Geslo</div>
									<div>Vloga</div>
								</div>
								{uporabniki.map((u) => {
									if (filterUporabniki === -1) {
										return (
											<div key={u.uporabnisko_ime}>
												<hr />
												<div className='userLine'>
													<div>{u.uporabnisko_ime}</div>
													<div>{u.geslo}</div>
													<div
														className={
															u.vloga === 0
																? 'admin'
																: u.vloga === 3
																? 'racunovodja'
																: u.vloga === 1
																? 'zaposleni'
																: 'stranka'
														}>
														<input
															disabled={u.vloga === 0 ? 'disabled' : ''}
															onChange={async (e) => {
																e.preventDefault();
																if (
																	e.target.value !== '' &&
																	typeof parseInt(e.target.value) === 'number'
																) {
																	try {
																		let res = await axios.post(
																			`http://localhost:${PORT}/api/admin/updtVloga`,
																			{
																				uporabnisko_ime: u.uporabnisko_ime,
																				vloga: e.target.value,
																			}
																		);
																		if (res.data === 'success') setUporabniki(null);
																	} catch (error) {
																		console.log(error);
																	}
																}
															}}
															type='text'
															defaultValue={u.vloga}
															maxLength='1'></input>
														<div>
															{u.vloga === 0
																? '(admin)'
																: u.vloga === 3
																? '(racunovodja)'
																: u.vloga === 1
																? '(zaposleni)'
																: '(stranka)'}
														</div>
													</div>
												</div>
											</div>
										);
									} else {
										if (parseInt(u.vloga) === filterUporabniki) {
											return (
												<>
													<hr />
													<div className='userLine'>
														<div>{u.uporabnisko_ime}</div>
														<div>{u.geslo}</div>
														<div
															className={
																u.vloga === 0
																	? 'admin'
																	: u.vloga === 3
																	? 'racunovodja'
																	: u.vloga === 1
																	? 'zaposleni'
																	: 'stranka'
															}>
															<input
																disabled={u.vloga === 0 ? 'disabled' : ''}
																onChange={async (e) => {
																	e.preventDefault();
																	if (
																		e.target.value !== '' &&
																		typeof parseInt(e.target.value) === 'number'
																	) {
																		try {
																			let res = await axios.post(
																				`http://localhost:${PORT}/api/admin/updtVloga`,
																				{
																					uporabnisko_ime: u.uporabnisko_ime,
																					vloga: e.target.value,
																				}
																			);
																			if (res.data === 'success') setUporabniki(null);
																		} catch (error) {
																			console.log(error);
																		}
																	}
																}}
																type='text'
																defaultValue={u.vloga}
																maxLength='1'></input>
															<div>
																{u.vloga === 0
																	? '(admin)'
																	: u.vloga === 3
																	? '(racunovodja)'
																	: u.vloga === 1
																	? '(zaposleni)'
																	: '(stranka)'}
															</div>
														</div>
													</div>
												</>
											);
										} else {
											return <></>;
										}
									}
								})}
								<hr />
								<button
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(0);
									}}>
									Nazaj
								</button>
							</>
						)}
					</div>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 3) {
			const pridobiInfoOZaposlenih = async () => {
				try {
					let r = await axios.get(`http://localhost:${PORT}/api/admin/zaposleni`);
					setZaposleni(r.data);
				} catch (error) {
					console.log('Prišlo je do napake');
				}
			};
			if (zaposleni === null) pridobiInfoOZaposlenih();
			return (
				<>
					<h2>Pregled zaposlenih</h2>
					<div>
						{zaposleni === null ? (
							<>Napaka</>
						) : (
							<>
								<select
									onClick={(e) => {
										e.preventDefault();
										console.log(e.target.value);
										setFilterUporabniki(parseInt(e.target.value));
									}}>
									<option key='-1' value='-1'>
										Vsi
									</option>
									<option key='0' value='0'>
										Administratorji
									</option>
									<option key='3' value='3'>
										Računovodje
									</option>
									<option key='1' value='1'>
										Zaposleni
									</option>
									<option key='2' value='2'>
										Stranke
									</option>
								</select>
								<div className='userLineHeader'>
									<div>ID</div>
									<div>Ime</div>
									<div>Priimek</div>
								</div>
								{zaposleni.map((u) => {
									if (filterUporabniki === -1) {
										return (
											<div key={u.uporabnisko_ime}>
												<hr />
												<div className='userLine'>
													<div>{u.uporabnisko_ime}</div>
													<div>{u.geslo}</div>
													<div
														className={
															u.vloga === 0
																? 'admin'
																: u.vloga === 3
																? 'racunovodja'
																: u.vloga === 1
																? 'zaposleni'
																: 'stranka'
														}>
														<input
															disabled={u.vloga === 0 ? 'disabled' : ''}
															onChange={async (e) => {
																e.preventDefault();
																if (
																	e.target.value !== '' &&
																	typeof parseInt(e.target.value) === 'number'
																) {
																	try {
																		let res = await axios.post(
																			`http://localhost:${PORT}/api/admin/updtVloga`,
																			{
																				uporabnisko_ime: u.uporabnisko_ime,
																				vloga: e.target.value,
																			}
																		);
																		if (res.data === 'success') setUporabniki(null);
																	} catch (error) {
																		console.log(error);
																	}
																}
															}}
															type='text'
															defaultValue={u.vloga}
															maxLength='1'></input>
														<div>
															{u.vloga === 0
																? '(admin)'
																: u.vloga === 3
																? '(racunovodja)'
																: u.vloga === 1
																? '(zaposleni)'
																: '(stranka)'}
														</div>
													</div>
												</div>
											</div>
										);
									} else {
										if (parseInt(u.vloga) === filterUporabniki) {
											return (
												<>
													<hr />
													<div className='userLine'>
														<div>{u.uporabnisko_ime}</div>
														<div>{u.geslo}</div>
														<div
															className={
																u.vloga === 0
																	? 'admin'
																	: u.vloga === 3
																	? 'racunovodja'
																	: u.vloga === 1
																	? 'zaposleni'
																	: 'stranka'
															}>
															<input
																disabled={u.vloga === 0 ? 'disabled' : ''}
																onChange={async (e) => {
																	e.preventDefault();
																	if (
																		e.target.value !== '' &&
																		typeof parseInt(e.target.value) === 'number'
																	) {
																		try {
																			let res = await axios.post(
																				`http://localhost:${PORT}/api/admin/updtVloga`,
																				{
																					uporabnisko_ime: u.uporabnisko_ime,
																					vloga: e.target.value,
																				}
																			);
																			if (res.data === 'success') setUporabniki(null);
																		} catch (error) {
																			console.log(error);
																		}
																	}
																}}
																type='text'
																defaultValue={u.vloga}
																maxLength='1'></input>
															<div>
																{u.vloga === 0
																	? '(admin)'
																	: u.vloga === 3
																	? '(racunovodja)'
																	: u.vloga === 1
																	? '(zaposleni)'
																	: '(stranka)'}
															</div>
														</div>
													</div>
												</>
											);
										} else {
											return <></>;
										}
									}
								})}
								<hr />
								<button
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(0);
									}}>
									Nazaj
								</button>
							</>
						)}
					</div>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 4) {
			return (
				<>
					<h2>Pregled strank</h2>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
						}}>
						Nazaj
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 5) {
			return (
				<>
					<h2>Pregled izdelkov</h2>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
						}}>
						Nazaj
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 6) {
			return (
				<>
					<h2>Pregled računov</h2>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
						}}>
						Nazaj
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 7) {
			return (
				<>
					<h2>Pregled naročil</h2>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
						}}>
						Nazaj
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 8) {
			return (
				<>
					<h2>Upravljanje s podatkovno bazo (geslo)</h2>
					<button
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
						}}>
						Nazaj
					</button>
				</>
			);
		}
	} else if (parseInt(vloga) === 2) {
		// stranka
		return (
			<>
				<NotificationCard />
				<UrediProfil uporabnisko_ime={user.uporabnisko_ime} vloga={vloga} />
			</>
		);
	} else if (parseInt(vloga) === 1) {
		<>Profil zaposlenega</>;
	} else if (parseInt(vloga) === 3) {
		<>Profil racunovodje</>;
	} else {
		// napacna vloga (profilu dodamo vlogo stranke)
		const posodobiVlogo = async () => {
			let res;
			try {
				res = await axios.post(`http://localhost:${PORT}/api/login/vloga`, {
					uporabnisko_ime: user.uporabnisko_ime,
				});
			} catch (error) {
				res.data = 'Prišlo je do napake';
			}
			setVloga(2);
			setMsg(res.data);
		};

		posodobiVlogo();

		return (
			<>
				<div>Napaka pri prijavi (napačna vloga uporabnika)</div>
				<div>{msg}</div>
			</>
		);
	}
};

export default Profile;
