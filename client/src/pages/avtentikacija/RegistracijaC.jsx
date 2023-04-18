import axios from 'axios';
import { CheckCircle, XCircle } from 'phosphor-react';
import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const Registracija = () => {
	const { setUporabnik, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const navigate = useNavigate();
	const [vneseniPodatki, setVneseniPodatki] = useState({
		uporabnisko_ime: null,
		geslo: null,
		elektronski_naslov: null,
		ime: null,
		priimek: null,
		ulica_in_hisna_stevilka: null,
		kraj: null,
		postna_stevilka: null,
		telefonska_stevilka: null,
		podjetje: null,
	});
	const [ponovenVnos, setPonovenVnos] = useState(false);
	const [OKuporabniskoIme, setOKuporabniskoIme] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno, 3 - zasedeno
	const [OKgeslo, setOKgeslo] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno
	const [OKponovljenoGeslo, setOKponovljenoGeslo] = useState(4); // 0 - ni se vnosa, 1 - se ne ujema z geslom, 2 - veljavno
	const [OKeposta, setOKeposta] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - ze uporabljeno, 3 - veljavno
	const [OKpostnaSt, setOKpostnaSt] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno
	const [sporociloNapaka, setSporociloNapaka] = useState({
		UIsporocilo: '',
		Gsporocilo: '',
		SGsporocilo: '',
		ENsporocilo: '',
		PSsporocilo: '',
	});
	const gesloRef = useRef(null);
	const obrazec = useRef(null);

	const poslji = async (e) => {
		try {
			if (vneseniPodatki !== null) {
				Object.keys(vneseniPodatki).map((key) => {
					if (vneseniPodatki[key] === null) {
						setPonovenVnos(true);
					}
					return vneseniPodatki;
				});
			}

			if (ponovenVnos || OKuporabniskoIme !== 2 || OKgeslo !== 2 || OKeposta !== 3 || OKpostnaSt !== 0) {
				let opozorilo = '';
				if (ponovenVnos) {
					opozorilo = 'Ponovno vnesite potrebne podatke';
				} else if (OKuporabniskoIme !== 2) {
					opozorilo = 'Uporabniško ime ni veljavno';
				} else if (OKgeslo !== 2) {
					opozorilo = 'Geslo ni veljavno';
				} else if (OKeposta !== 3) {
					opozorilo = 'Neveljaven elektronski naslov';
				} else if (OKpostnaSt === 1) {
					opozorilo = 'Neveljavna poštna številka';
				}
				alert(`Registracija NEuspešna: \n${opozorilo}`);
			} else {
				let odziv = await axios.post(
					`http://localhost:${global.config.port}/api/avtentikacija/novUporabnik`,
					{
						uporabnisko_ime: vneseniPodatki.uporabnisko_ime,
						geslo: vneseniPodatki.geslo,
						elektronski_naslov: vneseniPodatki.elektronski_naslov,
						ime: vneseniPodatki.ime,
						priimek: vneseniPodatki.priimek,
						ulica_in_hisna_stevilka: vneseniPodatki.ulica_in_hisna_stevilka,
						kraj: vneseniPodatki.kraj,
						postna_stevilka: vneseniPodatki.postna_stevilka,
						podjetje: vneseniPodatki.podjetje,
					}
				);

				if (odziv.data === 'vnos uspešen') {
					setJeAvtenticiran(true);
					setUporabnik(vneseniPodatki);
				}
				alert('Registracija uspešna'); // + JSON.stringify(vneseniPodatki));
				obrazec.current.reset();

				setVneseniPodatki({
					uporabnisko_ime: null,
					geslo: null,
					elektronski_naslov: null,
					ime: null,
					priimek: null,
					ulica_in_hisna_stevilka: null,
					kraj: null,
					postna_stevilka: null,
					telefonska_stevilka: null,
					podjetje: null,
				});
				setPonovenVnos(false);
				setOKuporabniskoIme(0);
				setOKgeslo(0);
				setOKponovljenoGeslo(4);
				setOKeposta(0);
				setOKpostnaSt(0);
				setSporociloNapaka({
					UIsporocilo: '',
					Gsporocilo: '',
					SGsporocilo: '',
					ENsporocilo: '',
					PSsporocilo: '',
				});
			}
		} catch (napaka) {
			setPonovenVnos(true);
			setSporociloNapaka({
				...sporociloNapaka,
				sporociloNapaka: `${napaka.code} (${napaka.response.status})`,
			});
			console.log(napaka);
		}
	};

	// preverjanje UI
	const preveriUporabniskoIme = async (uporabniskoIme) => {
		try {
			if (uporabniskoIme === '') setOKuporabniskoIme(0);
			else {
				let pregledanoUI = preveriUstreznostUI(uporabniskoIme);
				if (!pregledanoUI.jeUstrezno) {
					setOKuporabniskoIme(1);
					setSporociloNapaka({ ...sporociloNapaka, UIsporocilo: pregledanoUI.sporociloNapaka });
				} else {
					const preverjenoUI = await axios.get(
						`http://localhost:${global.config.port}/api/avtentikacija/uporabnik`,
						{
							params: { uporabnisko_ime: uporabniskoIme },
						}
					);
					if (preverjenoUI.data !== '') {
						setOKuporabniskoIme(3);
					} else {
						setOKuporabniskoIme(2);
					}
				}
			}
		} catch (napaka) {
			setOKuporabniskoIme(2);
			setPonovenVnos(true);
			setSporociloNapaka({
				...sporociloNapaka,
				sporociloNapaka: `${napaka.code} (${napaka.response.status})`,
			});
			console.log(napaka);
		}
	};
	const preveriUstreznostUI = (uporabniskoIme) => {
		let nedovoljeniZnaki = ['%', '"', "'"];
		let ustrezno = true;
		let sporociloNapaka = '';

		for (let i = 0; i < nedovoljeniZnaki.length; i++) {
			if (uporabniskoIme.includes(nedovoljeniZnaki[i])) {
				ustrezno = false;
				sporociloNapaka = 'Uporabljeni so bili nedovoljeni znaki (%, ", \')';
			}
		}
		if (uporabniskoIme.length < 4 || uporabniskoIme.length > 50) {
			ustrezno = false;
			sporociloNapaka =
				uporabniskoIme.length < 4
					? 'Uporabniško ime je prekratko, vsebovati mora najmanj 4 znake'
					: 'Uporabniško ime je predolgo, vsebuje lahko največ 50 znakov';
		}
		return { jeUstrezno: ustrezno, sporociloNapaka: sporociloNapaka };
	};

	// preverjanje gesla
	const preveriUstreznostGesla = (geslo) => {
		if (geslo === '') {
			setOKgeslo(0);
		} else {
			let nedovoljeniZnaki = ['%', '"', "'"];
			let ustrezno = true;
			let sporocilo = '';

			for (let i = 0; i < nedovoljeniZnaki.length; i++) {
				if (geslo.includes(nedovoljeniZnaki[i])) {
					ustrezno = false;
					sporocilo = 'Uporabljeni so bili nedovoljeni znaki (%, ", \')';
				}
			}
			if (geslo.length < 6 || geslo.length > 50) {
				ustrezno = false;
				sporocilo =
					geslo.length < 6
						? 'Geslo je prekratko, vsebovati mora najmanj 6 znakov'
						: 'Geslo je predolgo, vsebuje lahko največ 50 znakov';
				setOKgeslo(1);
				setPonovenVnos(true);
			} else if (!/\d/.test(geslo)) {
				ustrezno = false;
				sporocilo = 'Geslo mora vsebovati vsaj eno števko';
				setOKgeslo(1);
				setPonovenVnos(true);
			} else if (ustrezno) {
				setOKgeslo(2);
				setPonovenVnos(false);
			} else {
				setOKgeslo(1);
				setPonovenVnos(true);
			}
			setSporociloNapaka({ ...sporociloNapaka, Gsporocilo: sporocilo });

			if (OKgeslo !== 2)
				setSporociloNapaka({ ...sporociloNapaka, Gsporocilo: sporocilo, SGsporocilo: 'Ponovite geslo' });
		}
	};

	// preverjanje elektronske pošte
	const preveriElektronskoPošto = async (eposta) => {
		setSporociloNapaka({ ...sporociloNapaka, ENsporocilo: '' });
		try {
			if (eposta === '') setOKeposta(0);
			else {
				let pregledanaEP = preveriUstreznostEP(eposta);
				if (!pregledanaEP.jeUstrezna) {
					setOKeposta(1);
					setSporociloNapaka({ ...sporociloNapaka, ENsporocilo: pregledanaEP.sporocilo });
				} else {
					const preverjenaEP = await axios.get(
						`http://localhost:${global.config.port}/api/avtentikacija/elektronski_naslov`,
						{
							params: { elektronski_naslov: eposta },
						}
					);
					if (preverjenaEP.data !== '') {
						setOKeposta(2);
					} else {
						setOKeposta(3);
					}
				}
			}
		} catch (napaka) {
			setOKuporabniskoIme(3);
			setPonovenVnos(true);
			setSporociloNapaka({
				...sporociloNapaka,
				sporociloNapaka: `${napaka.code} (${napaka.response.status})`,
			});
			console.log(napaka);
		}
	};
	const preveriUstreznostEP = (eposta) => {
		let ustrezno = true;
		let sporociloNapaka = '';
		if (!eposta.includes('@')) {
			ustrezno = false;
			setOKeposta(1);
			sporociloNapaka = "E-naslov mora vsebovati znak '@'";
		} else {
			let index = eposta.indexOf('@');
			if (eposta[++index] === undefined || eposta[++index] === '') {
				ustrezno = false;
				setOKeposta(1);
				sporociloNapaka = 'Vnesite veljaven e-naslov';
			}
		}
		return { jeUstrezna: ustrezno, sporocilo: sporociloNapaka };
	};

	return (
		<div className='registracija kartice'>
			<h2>Registracija</h2>
			<form
				ref={obrazec}
				onSubmit={(e) => {
					e.preventDefault();
					poslji(e);
				}}>
				<div>
					<p>Pozdravljeni, registrirajte se in pridobite možnost hitrejšega spletnega naročanja.</p>
				</div>

				<label>Že imate račun? </label>
				<button
					className='gumb1'
					onClick={(e) => {
						e.preventDefault();
						navigate('/avtentikacija', { state: { prikazAvtentikacija: 'prijava' } });
					}}>
					Prijava
				</button>

				<div className='vnosnaPolja'>
					<div>
						<label>Uporabniško ime:</label>
						<input
							type='text'
							required
							onChange={(e) => {
								e.preventDefault();
								setVneseniPodatki({ ...vneseniPodatki, uporabnisko_ime: e.target.value });
								setPonovenVnos(false);
								preveriUporabniskoIme(e.target.value);
							}}
							maxLength={150}></input>
						<br />
						{OKuporabniskoIme === 0 ? (
							<></>
						) : OKuporabniskoIme === 1 ? (
							<div className='odzivi'>
								<XCircle size={22} className='odzivi' /> Neveljavno uporabniško ime <br />(
								{sporociloNapaka.UIsporocilo})
							</div>
						) : OKuporabniskoIme === 2 ? (
							<div className='odzivi'>
								<CheckCircle size={22} className='odzivi' />
								Veljavno uporabniško ime
							</div>
						) : (
							<div className='odzivi'>
								<XCircle size={22} className='odzivi' />
								Uporabniško ime zasedeno
							</div>
						)}
						<p></p>
					</div>
					<div>
						<label>Geslo:</label>
						<input
							type='password'
							ref={gesloRef}
							required
							onChange={(e) => {
								e.preventDefault();
								setVneseniPodatki({ ...vneseniPodatki, geslo: e.target.value });
								setPonovenVnos(false);
								preveriUstreznostGesla(e.target.value);
								setOKponovljenoGeslo(OKponovljenoGeslo);
							}}
							maxLength={150}></input>
						<br />
						{OKgeslo === 2 ? (
							<div className='odzivi'>
								<CheckCircle size={22} className='odzivi' />
								Veljavno geslo
							</div>
						) : OKgeslo === 1 ? (
							<div className='odzivi'>
								<XCircle size={22} className='odzivi' /> Neveljavno geslo{' '}
								{sporociloNapaka.Gsporocilo !== '' ? `(${sporociloNapaka.Gsporocilo})` : null}
								<br />
							</div>
						) : (
							<></>
						)}
					</div>

					<div>
						<label>Ponovite geslo:</label>
						<input
							type='password'
							required
							disabled={!(OKgeslo === 2)}
							onChange={(e) => {
								e.preventDefault();
								if (e.target.value === '') {
									setSporociloNapaka({ ...sporociloNapaka, SGsporocilo: 'Ponovno vnesite geslo' });
									setPonovenVnos(true);
									setOKponovljenoGeslo(0);
								} else if (gesloRef.current.value === e.target.value) {
									setVneseniPodatki({ ...vneseniPodatki, geslo: e.target.value });
									setSporociloNapaka({ ...sporociloNapaka, SGsporocilo: 'Gesli se ujemata' });
									setPonovenVnos(false);
									setOKponovljenoGeslo(2);
								} else if (e.target.value !== '') {
									setVneseniPodatki({ ...vneseniPodatki, geslo: null });
									setSporociloNapaka({ ...sporociloNapaka, SGsporocilo: 'Gesli se ne ujemata' });
									setPonovenVnos(true);
									setOKponovljenoGeslo(1);
								}
								setOKgeslo(OKgeslo);
							}}
							maxLength={150}></input>
						<br />
						{OKponovljenoGeslo === 2 ? (
							<div className='odzivi'>
								<CheckCircle size={22} className='odzivi' />
								{sporociloNapaka.SGsporocilo}
							</div>
						) : OKponovljenoGeslo === 1 ? (
							<div className='odzivi'>
								<XCircle size={22} className='odzivi' /> {sporociloNapaka.SGsporocilo}
								<br />
							</div>
						) : sporociloNapaka !== null &&
						  sporociloNapaka.SGsporocilo !== null &&
						  OKponovljenoGeslo === 0 ? (
							<div className='odzivi'>
								<XCircle size={22} className='odzivi' />
								{sporociloNapaka.SGsporocilo}
								<br />
							</div>
						) : (
							<></>
						)}
						<p></p>
					</div>
					<div>
						<label>E-naslov:</label>
						<input
							type='email'
							required
							onChange={(e) => {
								e.preventDefault();
								setVneseniPodatki({ ...vneseniPodatki, elektronski_naslov: e.target.value });
								setPonovenVnos(false);
								preveriElektronskoPošto(e.target.value);
								setOKponovljenoGeslo(OKponovljenoGeslo);
							}}
							maxLength={160}></input>
						<br />
						{OKeposta === 3 ? (
							<div className='odzivi'>
								<CheckCircle size={22} className='odzivi' />
								Veljaven e-naslov
							</div>
						) : OKeposta === 0 ? (
							<></>
						) : OKeposta === 1 ? (
							<div className='odzivi'>
								<XCircle size={22} className='odzivi' /> Vnesite veljaven e-naslov{' '}
								{sporociloNapaka.ENsporocilo !== '' ? `(${sporociloNapaka.ENsporocilo})` : null}
								<br />
							</div>
						) : (
							<div className='odzivi'>
								<XCircle size={22} className='odzivi' /> Ta e-naslov je že zaseden{' '}
								{sporociloNapaka.ENsporocilo !== '' ? `(${sporociloNapaka.ENsporocilo})` : null}
								<br />
							</div>
						)}
						<p></p>
					</div>

					<div>
						<label>Ime:</label>
						<input
							type='text'
							required
							onChange={(e) => {
								e.preventDefault();
								setVneseniPodatki({ ...vneseniPodatki, ime: e.target.value });
								setPonovenVnos(false);
							}}
							maxLength={120}></input>
						<br />
					</div>
					<div>
						<label>Priimek:</label>
						<input
							type='text'
							required
							onChange={(e) => {
								e.preventDefault();
								setVneseniPodatki({ ...vneseniPodatki, priimek: e.target.value });
								setPonovenVnos(false);
							}}
							maxLength={130}></input>
						<br />
						<p></p>
					</div>
					<div>
						<label>Ulica in hišna št.:</label>
						<input
							type='text'
							onChange={(e) => {
								e.preventDefault();
								setVneseniPodatki({ ...vneseniPodatki, ulica_in_hisna_stevilka: e.target.value });
								setPonovenVnos(false);
							}}
							maxLength={160}
							placeholder='Ulica ##'></input>
						<br />
						<p></p>
					</div>
					<div>
						<label>Poštna št. in kraj:</label>
						<input
							type='text'
							onChange={(e) => {
								e.preventDefault();
								if (
									!isNaN(parseInt(e.target.value)) &&
									parseInt(e.target.value) > 0 &&
									parseInt(e.target.value) < 10000
								) {
									setVneseniPodatki({ ...vneseniPodatki, postna_stevilka: e.target.value });
									setPonovenVnos(false);
								} else if (e.target.value === '') {
									setVneseniPodatki({ ...vneseniPodatki, postna_stevilka: null });
									setSporociloNapaka({ ...sporociloNapaka, PSsporocilo: '' });
									setPonovenVnos(false);
									setOKpostnaSt(0);
								} else if (isNaN(parseInt(e.target.value))) {
									setVneseniPodatki({ ...vneseniPodatki, postna_stevilka: null });
									setSporociloNapaka({
										...sporociloNapaka,
										PSsporocilo: 'Poštna številka mora biti število',
									});
									setPonovenVnos(true);
									setOKpostnaSt(1);
								} else if (parseInt(e.target.value) < 0) {
									setVneseniPodatki({ ...vneseniPodatki, postna_stevilka: null });
									setSporociloNapaka({
										...sporociloNapaka,
										PSsporocilo: 'Poštna številka mora biti število, večje od 0',
									});
									setPonovenVnos(true);
									setOKpostnaSt(1);
								} else if (parseInt(e.target.value) >= 10000) {
									setVneseniPodatki({ ...vneseniPodatki, postna_stevilka: null });
									setSporociloNapaka({
										...sporociloNapaka,
										PSsporocilo: 'Slovenska poštna številka mora biti število, manjše od 10000',
									});
									setPonovenVnos(true);
									setOKpostnaSt(1);
								} else {
									setVneseniPodatki({ ...vneseniPodatki, postna_stevilka: null });
									setSporociloNapaka({ ...sporociloNapaka, PSsporocilo: 'Napaka pri vnosu' });
									setPonovenVnos(true);
									setOKpostnaSt(1);
								}
							}}
							maxLength={4}></input>
						{OKpostnaSt === 2 ? (
							<div className='odzivi'>
								<CheckCircle size={22} className='odzivi' />
								Veljavna poštna številka
							</div>
						) : OKpostnaSt === 0 ? (
							<></>
						) : (
							<div className='odzivi'>
								<XCircle size={22} className='odzivi' />
								{sporociloNapaka.PSsporocilo !== '' ? `(${sporociloNapaka.PSsporocilo})` : null}
								<br />
							</div>
						)}
						<input
							type='text'
							onChange={(e) => {
								e.preventDefault();
								setVneseniPodatki({ ...vneseniPodatki, kraj: e.target.value });
								setPonovenVnos(false);
							}}
							maxLength={130}></input>
						<br />
						<p></p>
					</div>
					<div>
						<label>Telefonska številka:</label>
						<input
							type='text'
							onChange={(e) => {
								e.preventDefault();
								setVneseniPodatki({ ...vneseniPodatki, telefonska_stevilka: e.target.value });
								setPonovenVnos(false);
							}}
							maxLength={20}
							placeholder='+386 ## ### ###'></input>
						<br />
						<p></p>
					</div>
					<div>
						<label>Podjetje:</label>
						<input
							type='text'
							onChange={(e) => {
								e.preventDefault();
								setVneseniPodatki({ ...vneseniPodatki, podjetje: e.target.value });
								setPonovenVnos(false);
							}}
							maxLength={255}></input>
						<br />
						<p></p>
					</div>
					<button type='submit' className='gumb1'>
						Potrdi
					</button>
					<br />
					{ponovenVnos ? (
						<div>
							{sporociloNapaka.sporociloNapaka !== null
								? sporociloNapaka.sporociloNapaka
								: 'Napačen vnos'}
						</div>
					) : (
						<></>
					)}
				</div>
			</form>
		</div>
	);
};

export default Registracija;
