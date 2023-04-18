import axios from 'axios';
import { CaretCircleLeft } from 'phosphor-react';
import { useState } from 'react';

const DodajanjeUporabnikov = ({ props }) => {
	const [vneseniPodatki, setVneseniPodatki] = useState({
		uporabnisko_ime: null,
		geslo: null,
		vloga: 2,
		omogocen: true,
		elektronski_naslov: null,
		ime: null,
		priimek: null,
		ulica_in_hisna_stevilka: null,
		kraj: null,
		postna_stevilka: null,
		telefonska_stevilka: null,
		podjetje: null,
		oddelek: null,
		placa: 0.0,
	});
	const [sporociloONapaki, setSporociloONapaki] = useState({
		uimeS: '',
		gesloS: '',
		enaslovS: '',
		postnaStS: '',
		placaS: '',
		dbS: '',
	});
	const [OKuporabniskoIme, setOKuporabniskoIme] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno, 3 - zasedeno
	const [OKgeslo, setOKgeslo] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno
	const [OKenaslov, setOKenaslov] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - ze uporabljeno, 3 - veljavno
	const [OKpostnaSt, setOKpostnaSt] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno
	const [OKplaca, setOKplaca] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno
	const [napakaPriVnosu, setNapakaPriVnosu] = useState(null);

	return (
		<div>
			<h2 className='naslov'>{props.naslov}</h2>
			<button
				className='gumbNazaj'
				onClick={(e) => {
					e.preventDefault();
					props.setStanjeAdmin(0);
				}}>
				<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
				<div>Nazaj</div>
			</button>
			<form
				className='obrazecZaVnos'
				onSubmit={async (e) => {
					e.preventDefault();
					const posodobiVlogo = async () => {
						try {
							await axios.post(
								`http://localhost:${global.config.port}/api/administrator/dodajUporabnika`,
								{
									uporabnisko_ime: vneseniPodatki.uporabnisko_ime,
									geslo: vneseniPodatki.geslo,
									vloga: vneseniPodatki.vloga,
									omogocen: vneseniPodatki.omogocen,
									elektronski_naslov: vneseniPodatki.elektronski_naslov,
									ime: vneseniPodatki.ime,
									priimek: vneseniPodatki.priimek,
									ulica_in_hisna_stevilka: vneseniPodatki.ulica_in_hisna_stevilka,
									kraj: vneseniPodatki.kraj,
									postna_stevilka: vneseniPodatki.postna_stevilka,
									telefonska_stevilka: vneseniPodatki.telefonska_stevilka,
									podjetje: vneseniPodatki.podjetje,
									oddelek: vneseniPodatki.oddelek,
									placa: vneseniPodatki.placa,
								}
							);
						} catch (napaka) {
							setSporociloONapaki({
								...sporociloONapaki,
								dbS: 'Napaka pri vnosu v bazo podatkov',
							});
							console.log('Prišlo je do napake: ' + napaka.toString());
						}
					};

					if (
						OKuporabniskoIme === 2 &&
						OKgeslo === 2 &&
						OKenaslov === 3 &&
						OKpostnaSt === 2 &&
						OKplaca !== 1
					) {
						alert('Vnesen uporabnik: ' + JSON.stringify(vneseniPodatki));
						posodobiVlogo();
						setVneseniPodatki({
							uporabnisko_ime: null,
							geslo: null,
							vloga: 2,
							omogocen: true,
							elektronski_naslov: null,
							ime: null,
							priimek: null,
							ulica_in_hisna_stevilka: null,
							kraj: null,
							postna_stevilka: null,
							telefonska_stevilka: null,
							podjetje: null,
							oddelek: null,
							placa: 0.0,
						});
						e.target.reset();
						setSporociloONapaki({ uimeS: '', gesloS: '', enaslovS: '', postnaSt: '', dbS: '' });
					} else {
						let opozorilo = '';
						if (OKuporabniskoIme !== 2) {
							opozorilo = 'Uporabniško ime ni veljavno';
						} else if (OKgeslo !== 2) {
							opozorilo = 'Geslo ni veljavno';
						} else if (OKenaslov !== 3) {
							opozorilo = 'Neveljaven elektronski naslov';
						} else if (OKpostnaSt !== 2) {
							opozorilo = 'Neveljavna poštna številka';
						}
						alert(`Registracija NEuspešna: \n${opozorilo}`);
					}
				}}>
				<table>
					<tbody>
						<tr>
							<td className='opisPodatka'>Uporabniško ime</td>
							<td className='podatek'>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										const preveriMoznostUporabniskegaImena = async () => {
											try {
												if (e.target.value === '') {
													setSporociloONapaki({
														...sporociloONapaki,
														uimeS: 'Vnesite uporabniško ime',
													});
													setOKuporabniskoIme(0);
												} else {
													let preveriUI = preveriUstreznostUporabniskegaImena(e.target.value);
													if (!preveriUI.ustrezno) {
														setSporociloONapaki({
															...sporociloONapaki,
															uimeS: preveriUI.sporocilo,
														});
														setOKuporabniskoIme(1);
													} else {
														const rezultat = await axios.get(
															`http://localhost:${global.config.port}/api/avtentikacija/uporabnik`,
															{
																params: { uporabnisko_ime: e.target.value },
															}
														);
														if (rezultat.data === '') {
															setSporociloONapaki({
																...sporociloONapaki,
																uimeS: '',
															});
															setOKuporabniskoIme(2);
														} else {
															setSporociloONapaki({
																...sporociloONapaki,
																uimeS: 'Uporabniško ime ni na voljo',
															});
															setOKuporabniskoIme(3);
														}
													}
													setNapakaPriVnosu(null);
												}
											} catch (napaka) {
												setNapakaPriVnosu(
													'Napaka pri povezovanju s podatkovno bazo, poskusite znova kasneje'
												);
												console.log(napaka);
											}
										};
										const preveriUstreznostUporabniskegaImena = (uime) => {
											let nedovoljeniZnaki = ['%', '"', "'"];
											let ustrezno = true;
											let sporocilo = '';

											for (let i = 0; i < nedovoljeniZnaki.length; i++) {
												if (uime.includes(nedovoljeniZnaki[i])) {
													ustrezno = false;
													sporocilo = 'Uporabljeni so bili nedovoljeni znaki (%, ", \')';
												}
											}
											if (uime.length < 4 || uime.length > 50) {
												ustrezno = false;
												sporocilo =
													uime.length < 4
														? 'Uporabniško ime je prekratko, vsebovati mora najmanj 4 znake'
														: 'Uporabniško ime je predolgo, vsebuje lahko največ 50 znakov';
											}
											return { ustrezno: ustrezno, sporocilo: sporocilo };
										};
										preveriMoznostUporabniskegaImena();
										setVneseniPodatki({ ...vneseniPodatki, uporabnisko_ime: e.target.value });
									}}
									className='tekstovnoPolje'></input>
								{sporociloONapaki.uimeS === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.uimeS}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Geslo</td>
							<td className='podatek'>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										const preveriUstreznostGesla = (geslo) => {
											if (e.target.value === '') {
												setOKgeslo(0);
												setSporociloONapaki({
													...sporociloONapaki,
													gesloS: 'Vnesite ustrezno geslo',
												});
											} else {
												let nedovoljeniZnaki = ['%', '"', "'"];
												let ustrezno = true;
												let sporocilo = '';

												for (let i = 0; i < nedovoljeniZnaki.length; i++) {
													if (geslo.includes(nedovoljeniZnaki[i])) {
														ustrezno = false;
														sporocilo = 'Uporabljeni so bili nedovoljeni znaki (%, ", \')';
														setSporociloONapaki({
															...sporociloONapaki,
															gesloS: sporocilo,
														});
														setOKgeslo(1);
													}
												}

												if (geslo.length < 6 || geslo.length > 50) {
													ustrezno = false;
													sporocilo =
														geslo.length < 6
															? 'Geslo je prekratko, vsebovati mora najmanj 6 znakov'
															: 'Geslo je predolgo, vsebuje lahko največ 50 znakov';
													setOKgeslo(1);
													setSporociloONapaki({
														...sporociloONapaki,
														gesloS: sporocilo,
													});
												} else if (!/\d/.test(geslo)) {
													ustrezno = false;
													sporocilo = 'Geslo mora vsebovati vsaj eno števko';
													setOKgeslo(1);
													setSporociloONapaki({
														...sporociloONapaki,
														gesloS: sporocilo,
													});
												} else if (ustrezno) {
													setOKgeslo(2);
													setSporociloONapaki({
														...sporociloONapaki,
														gesloS: '',
													});
												} else {
													setOKgeslo(1);
													setSporociloONapaki({
														...sporociloONapaki,
														gesloS: 'Neveljavno geslo',
													});
												}
											}
										};
										preveriUstreznostGesla(e.target.value);
										setVneseniPodatki({ ...vneseniPodatki, geslo: e.target.value });
									}}
									className='tekstovnoPolje'></input>
								{sporociloONapaki.gesloS === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.gesloS}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Vloga</td>
							<td className='podatek'>
								<input
									required
									type='radio'
									id='Radmin'
									name='vloga'
									onChange={(e) => {
										setVneseniPodatki({ ...vneseniPodatki, vloga: 0 });
									}}
									checked={vneseniPodatki.vloga === 0 ? 'checked' : ''}></input>
								<label>Admin</label>
								<br />
								<input
									required
									type='radio'
									id='Rzaposleni'
									name='vloga'
									onChange={(e) => {
										setVneseniPodatki({ ...vneseniPodatki, vloga: 1 });
									}}
									checked={vneseniPodatki.vloga === 1 ? 'checked' : ''}></input>
								<label>Zaposleni</label>
								<br />
								<input
									required
									type='radio'
									id='Rstranka'
									name='vloga'
									onChange={(e) => {
										setVneseniPodatki({ ...vneseniPodatki, vloga: 2 });
									}}
									checked={vneseniPodatki.vloga === 2 ? 'checked' : ''}></input>
								<label>Stranka</label>
								<br />
								<input
									required
									type='radio'
									id='Rracunovodja'
									name='vloga'
									onChange={(e) => {
										setVneseniPodatki({ ...vneseniPodatki, vloga: 3 });
									}}
									checked={vneseniPodatki.vloga === 3 ? 'checked' : ''}></input>
								<label>Računovodja</label>
								<br />
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Omogočen</td>
							<td className='podatek'>
								<input
									required
									type='radio'
									id='Romogocen'
									name='omogocen'
									onClick={(e) => {
										setVneseniPodatki({ ...vneseniPodatki, omogocen: true });
									}}
									checked={vneseniPodatki.omogocen ? 'checked' : ''}></input>
								<label>Da</label>
								<br />
								<input
									required
									type='radio'
									id='Ronemogocen'
									name='omogocen'
									onClick={(e) => {
										setVneseniPodatki({ ...vneseniPodatki, omogocen: false });
									}}
									checked={vneseniPodatki.omogocen ? '' : 'checked'}></input>
								<label>Ne</label>
								<br />
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Elektronski naslov</td>
							<td className='podatek'>
								<input
									required
									type='email'
									onChange={(e) => {
										e.preventDefault();
										const preveriMoznostEnaslova = async () => {
											try {
												if (e.target.value === '') {
													setOKenaslov(0);
													setSporociloONapaki({
														...sporociloONapaki,
														enaslovS: 'Vnesite veljaven elektronski naslov',
													});
												} else {
													let preveriEN = preveriUstreznostEnaslova(e.target.value);
													if (!preveriEN.ustrezno) {
														setOKenaslov(1);
														setSporociloONapaki({
															...sporociloONapaki,
															enaslovS: 'Vnesite veljaven elektronski naslov',
														});
													} else {
														const rezultat = await axios.get(
															`http://localhost:${global.config.port}/api/avtentikacija/elektronski_naslov`,
															{
																params: { elektronski_naslov: e.target.value },
															}
														);
														if (rezultat.data === '') {
															setOKenaslov(3);
															setSporociloONapaki({
																...sporociloONapaki,
																enaslovS: '',
															});
														} else {
															setOKenaslov(2);
															setSporociloONapaki({
																...sporociloONapaki,
																enaslovS: 'Ta elektronski naslov že ima uporabniški račun',
															});
														}
													}
												}
											} catch (napaka) {
												setNapakaPriVnosu('Napaka pri vnosu podatkov v podatkovno bazo');
												console.log(napaka);
											}
										};
										const preveriUstreznostEnaslova = (enaslov) => {
											let ustrezno = true;
											let sporocilo = '';
											if (!enaslov.includes('@')) {
												ustrezno = false;

												sporocilo = "E-naslov mora vsebovati znak '@'";
											} else {
												let index = enaslov.indexOf('@');
												if (enaslov[++index] === undefined || enaslov[++index] === '') {
													ustrezno = false;
													sporocilo = 'Vnesite veljaven e-naslov';
												}
											}
											return { ustrezno: ustrezno, sporocilo: sporocilo };
										};
										preveriMoznostEnaslova();
										setVneseniPodatki({ ...vneseniPodatki, elektronski_naslov: e.target.value });
									}}
									className='tekstovnoPolje'></input>
								{sporociloONapaki.enaslovS === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.enaslovS}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Ime</td>
							<td className='podatek'>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, ime: e.target.value });
									}}
									className='tekstovnoPolje'></input>
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Priimek</td>
							<td className='podatek'>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, priimek: e.target.value });
									}}
									className='tekstovnoPolje'></input>
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Ulica in hišna št.</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											ulica_in_hisna_stevilka: e.target.value,
										});
									}}
									className='tekstovnoPolje'></input>
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Kraj</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											kraj: e.target.value,
										});
									}}
									className='tekstovnoPolje'></input>
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Poštna št.</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										if (
											parseInt(e.target.value) < 10000 &&
											parseInt(e.target.value) > 0 &&
											e.target.value !== '' &&
											!isNaN(parseInt(e.target.value))
										) {
											setOKpostnaSt(2);
											setVneseniPodatki({
												...vneseniPodatki,
												postna_stevilka: e.target.value,
											});
											setSporociloONapaki({
												...sporociloONapaki,
												postnaStS: '',
											});
										} else if (parseInt(e.target.value) > 10000 || parseInt(e.target.value) < 0) {
											setOKpostnaSt(1);
											setSporociloONapaki({
												...sporociloONapaki,
												postnaStS: 'Vnesite veljavno Slovensko poštno številko (med 0 in 10000)',
											});
										} else if (e.target.value === '') {
											setOKpostnaSt(0);
											setSporociloONapaki({
												...sporociloONapaki,
												postnaStS: 'Vnesite poštno številko',
											});
										} else if (isNaN(parseInt(e.target.value))) {
											setOKpostnaSt(1);
											setSporociloONapaki({
												...sporociloONapaki,
												postnaStS: 'Vnesite veljavno Slovensko poštno ŠTEVILKO',
											});
										} else {
											setOKpostnaSt(1);
											setSporociloONapaki({
												...sporociloONapaki,
												postnaStS: 'Napaka pri vnosu',
											});
										}
									}}
									className='tekstovnoPolje'></input>
								{sporociloONapaki.postnaStS === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.postnaStS}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Telefonska št.</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											telefonska_stevilka: e.target.value,
										});
									}}
									className='tekstovnoPolje'
									placeholder='+386 ## ### ###'></input>
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Podjetje</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											podjetje: e.target.value,
										});
									}}
									className='tekstovnoPolje'></input>
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Oddelek</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											oddelek: e.target.value,
										});
									}}
									className='tekstovnoPolje'></input>
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Plača</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										if (parseInt(e.target.value) > 0 && !isNaN(parseFloat(e.target.value))) {
											setOKplaca(2);
											setVneseniPodatki({
												...vneseniPodatki,
												placa: e.target.value,
											});
											setSporociloONapaki({
												...sporociloONapaki,
												placaS: '',
											});
										} else if (parseInt(e.target.value) < 0) {
											setOKplaca(1);
											setSporociloONapaki({
												...sporociloONapaki,
												placaS: 'Plača ne more biti negativna',
											});
										} else if (isNaN(parseFloat(e.target.value))) {
											setOKplaca(1);
											setSporociloONapaki({
												...sporociloONapaki,
												placaS: 'Vnesite število',
											});
										} else {
											setOKplaca(1);
											setSporociloONapaki({
												...sporociloONapaki,
												placaS: 'Napačen vnos',
											});
										}
									}}
									className='tekstovnoPolje'
									placeholder='Decimalna pika'></input>
								{sporociloONapaki.placaS === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.placaS}</div>
								)}
							</td>
						</tr>
					</tbody>
				</table>
				<button type='submit' className='posiljanje'>
					Vnesi
				</button>
				{sporociloONapaki.dbS !== null ? <div>{sporociloONapaki.dbS}</div> : <></>}
				{napakaPriVnosu !== null ? <div style={{ color: 'red' }}>{napakaPriVnosu}</div> : <></>}
			</form>
		</div>
	);
};

export default DodajanjeUporabnikov;
