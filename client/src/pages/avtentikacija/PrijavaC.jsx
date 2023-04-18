import axios from 'axios';
import { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';
import KroznoNalaganje from '@mui/material/CircularProgress';
import Skatla from '@mui/material/Box';

const Prijava = () => {
	const { setUporabnik, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const [vnesenoUporabniskoIme, setVnesenoUporabniskoIme] = useState('');
	const [vnesenoGeslo, setVnesenoGeslo] = useState('');
	const [sporocilo, setSporocilo] = useState('');
	const ui = useRef(null);
	const geslo = useRef(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (sporocilo === 'Nalaganje..') {
			const casovnik = setTimeout(() => {
				console.log(sporocilo);
				if (sporocilo === 'Nalaganje..') {
					setSporocilo('Napaka na strežniku, poskusite znova kasneje');
					console.log(sporocilo);
				}
			}, 4500);

			return () => {
				//setObvestilo(location.state.sporocilo);
				clearTimeout(casovnik);
			};
		}
	}, [sporocilo]);

	const oddaja = async (vnesenoUporabniskoIme, vnesenoGeslo) => {
		try {
			if (vnesenoUporabniskoIme !== '' && vnesenoGeslo !== '') {
				let odziv = await axios.get(`http://localhost:${global.config.port}/api/avtentikacija/`, {
					params: {
						uporabnisko_ime: vnesenoUporabniskoIme,
						geslo: vnesenoGeslo,
					},
				});
				setSporocilo('Nalaganje...');
				if (typeof odziv.data !== 'boolean') {
					if (odziv.data.omogocen === 0) {
						setVnesenoUporabniskoIme('');
						setVnesenoGeslo('');
						ui.current = '';
						geslo.current = '';
						setSporocilo('Vaš profil je bil onemogočen');
					} else {
						var podatki = await axios.get(
							`http://localhost:${global.config.port}/api/avtentikacija/uporabnik`,
							{
								params: { uporabnisko_ime: vnesenoUporabniskoIme },
							}
						);

						let uporabniskiPodatki = { ...podatki.data, geslo: odziv.data };

						setUporabnik({
							...uporabniskiPodatki,
							uporabnisko_ime: vnesenoUporabniskoIme,
						});
						setJeAvtenticiran(true);
					}
				} else {
					setVnesenoUporabniskoIme('');
					setVnesenoGeslo('');
					ui.current = '';
					geslo.current = '';
					setSporocilo('Napačni podatki');
				}
			} else {
				setSporocilo('Vnesite uporabniško ime in geslo');
			}
		} catch (napaka) {
			setSporocilo(`Napaka na strežniku [${napaka.code}], poskusite znova kasneje`);
			console.log(napaka);
		}
	};

	return (
		<div className='kartice prijava'>
			<h2>Prijava</h2>
			{sporocilo !== null && sporocilo !== '' && sporocilo !== '' ? (
				<div>
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						{sporocilo !== 'Nalaganje..' ? (
							<></>
						) : (
							<Skatla sx={{ display: 'flex' }}>
								<KroznoNalaganje color='inherit' />
							</Skatla>
						)}
					</div>
				</div>
			) : (
				<></>
			)}
			<form
				onSubmit={(e) => {
					e.preventDefault();
					oddaja(vnesenoUporabniskoIme, vnesenoGeslo);
					setSporocilo('Nalaganje..');
				}}>
				<label>Uporabniško ime:</label>
				<br />
				<input
					type='text'
					value={vnesenoUporabniskoIme}
					onChange={(e) => {
						setVnesenoUporabniskoIme(e.target.value);
						setSporocilo('');
					}}></input>
				<br />
				<label>Geslo:</label>
				<br />
				<input
					type='password'
					value={vnesenoGeslo}
					onChange={(e) => {
						setVnesenoGeslo(e.target.value);
						setSporocilo('');
					}}></input>
				<br />
				<button type='submit' className='gumb1'>
					Prijava
				</button>
			</form>
			<button
				className='gumb1'
				style={{ marginBottom: '2px' }}
				onClick={(e) => {
					navigate('/avtentikacija', { state: { prikazAvtentikacija: 'registracija' } });
				}}>
				Registriracija
			</button>
			{sporocilo !== null && sporocilo !== '' && sporocilo !== '' ? (
				<div className='sporociloNapake'>
					<div style={{ marginBottom: '8px' }}>
						<i>{sporocilo}</i>
					</div>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Prijava;
