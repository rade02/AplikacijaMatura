import axios from 'axios';
import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const Prijava = () => {
	const { setUporabnik, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const [vnesenoUporabniskoIme, setVnesenoUporabniskoIme] = useState('');
	const [vnesenoGeslo, setVnesenoGeslo] = useState('');
	const [sporocilo, setSporocilo] = useState('');
	const ui = useRef(null);
	const geslo = useRef(null);

	const navigate = useNavigate();

	const oddaja = async (vnesenoUporabniskoIme, vnesenoGeslo) => {
		try {
			if (vnesenoUporabniskoIme !== '' && vnesenoGeslo !== '') {
				let odziv = await axios.get(`http://localhost:${global.config.port}/api/avtentikacija/`, {
					params: {
						uporabnisko_ime: vnesenoUporabniskoIme,
						geslo: vnesenoGeslo,
					},
				});
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
						let uporabniskiPodatki = { ...podatki.data, geslo: vnesenoGeslo };

						setUporabnik({ ...uporabniskiPodatki, uporabnisko_ime: vnesenoUporabniskoIme });
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
			setSporocilo(napaka.code + ' (' + napaka.response.status + ')');
			console.log(napaka);
		}
	};

	return (
		<div className='kartice prijava'>
			<h2>Prijava</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					oddaja(vnesenoUporabniskoIme, vnesenoGeslo);
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
				onClick={(e) => {
					navigate('/avtentikacija', { state: { prikazAvtentikacija: 'registracija' } });
				}}>
				Registriracija
			</button>
			{sporocilo !== null && sporocilo !== '' ? (
				<div className='sporociloNapake'>
					<i>{sporocilo}</i>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Prijava;
