import axios from 'axios';
import { useState, useContext } from 'react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const SpreminjanjeGesla = ({ props }) => {
	const { uporabnik, setUporabnik } = useContext(UporabniskiKontekst);
	const [geslo, setGeslo] = useState('');
	const [jePravilno, setJePravilno] = useState(null);

	const [OKgeslo, setOKgeslo] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno
	const [OKponovljeno, setOKponovljeno] = useState(4); // 0 - ni se vnosa, 1 - se ne ujema z geslom, 2 - veljavno
	const [sporocilo, setSporocilo] = useState('');

	const posljiStaroGeslo = () => {
		if (uporabnik.geslo === geslo) {
			setJePravilno(true);
			setGeslo('');
		} else {
			setJePravilno(false);
		}
	};

	const preveriUstreznostGesla = (geslo) => {
		let sporocilo = '';
		if (geslo === '') {
			setOKgeslo(0);
			sporocilo = '';
		} else {
			let nedovoljeniZnaki = ['%', '"', "'"];
			let ustrezno = true;

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
			} else if (!/\d/.test(geslo)) {
				ustrezno = false;
				sporocilo = 'Geslo mora vsebovati vsaj eno števko';
				setOKgeslo(1);
			} else if (ustrezno) {
				setOKgeslo(2);
				setGeslo(geslo);
			} else {
				setOKgeslo(1);
			}
		}
		setSporocilo(sporocilo);
	};

	const posljiNovoGeslo = async () => {
		if (OKgeslo === 2) {
			try {
				await axios.post(`http://localhost:${global.config.port}/api/avtentikacija/posodobitevGesla`, {
					uporabnisko_ime: uporabnik.uporabnisko_ime,
					geslo: geslo,
				});
				setUporabnik({ ...uporabnik, geslo: geslo });
				props.setPosodobljenUporabnik({ ...props.posodobljenUporabnik, geslo: geslo });
				props.setUrediGeslo(false);
			} catch (napaka) {
				console.log(napaka);
			}
		} else {
			setOKgeslo(1);
		}
	};

	if (jePravilno) {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					posljiNovoGeslo();
				}}>
				<label>Vnesite novo geslo: </label>
				<input
					type='geslo'
					key='b'
					defaultValue=''
					onChange={(e) => {
						e.preventDefault();
						preveriUstreznostGesla(e.target.value);
					}}></input>
				<br />
				<label>Ponovno vnesite novo geslo: </label>
				<input
					type='geslo'
					key='c'
					onChange={(e) => {
						e.preventDefault();
						if (e.target.value === geslo) setOKponovljeno(2);
						else setOKponovljeno(1);
					}}></input>
				{OKponovljeno === 2 ? <>Gesli se ujemata</> : <>Gesli se ne ujemata</>}
				<br />
				<button type='submit' disabled={OKponovljeno !== 2 || OKgeslo !== 2}>
					Potrdi
				</button>
				<br />{' '}
				<button
					onClick={(e) => {
						e.preventDefault();
						props.setUrediGeslo(false);
					}}>
					Nazaj na profil
				</button>
			</form>
		);
	}
	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				posljiStaroGeslo();
			}}>
			<label>Vnesite staro geslo: </label>
			<input
				type='geslo'
				key='a'
				defaultValue=''
				onChange={(e) => {
					e.preventDefault();
					setGeslo(e.target.value);
				}}></input>
			<button type='submit'>Potrdi</button>
			<br />
			<button
				onClick={(e) => {
					e.preventDefault();
					props.setUrediGeslo(false);
				}}>
				Nazaj na profil
			</button>
			<br />
			<label>{jePravilno === null ? '' : jePravilno ? '' : 'Geslo ni pravilno'}</label>
		</form>
	);
};

export default SpreminjanjeGesla;
