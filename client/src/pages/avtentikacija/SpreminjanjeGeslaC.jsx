import axios from 'axios';
import { useState, useContext, useEffect } from 'react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const SpreminjanjeGesla = ({ props }) => {
	const { uporabnik, setUporabnik } = useContext(UporabniskiKontekst);
	const [geslo, setGeslo] = useState('');
	const [jePravilno, setJePravilno] = useState(null);
	const [OKgeslo, setOKgeslo] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno
	const [OKponovljeno, setOKponovljeno] = useState(4); // 0 - ni se vnosa, 1 - se ne ujema z geslom, 2 - veljavno
	const [sporocilo, setSporocilo] = useState('');

	useEffect(() => {
		preveriUstreznostGesla();
	});

	const posljiStaroGeslo = async () => {
		let odziv = await axios.get(`http://localhost:${global.config.port}/api/avtentikacija/`, {
			params: {
				uporabnisko_ime: uporabnik.uporabnisko_ime,
				geslo: geslo,
			},
		});
		if (typeof odziv.data !== 'boolean') {
			setJePravilno(true);
			setGeslo('');
		} else {
			setJePravilno(false);
		}
	};

	const preveriUstreznostGesla = () => {
		let sporocilo1 = '';
		if (geslo === '') {
			setOKgeslo(0);
			sporocilo1 = '';
		} else {
			let nedovoljeniZnaki = ['%', '"', "'"];
			let ustrezno = true;

			for (let i = 0; i < nedovoljeniZnaki.length; i++) {
				if (geslo.includes(nedovoljeniZnaki[i])) {
					ustrezno = false;
					sporocilo1 = 'Uporabljeni so bili nedovoljeni znaki (%, ", \')';
				}
			}
			if (geslo.length < 6 || geslo.length > 50) {
				ustrezno = false;
				sporocilo1 =
					geslo.length < 6
						? 'Geslo je prekratko, vsebovati mora najmanj 6 znakov'
						: 'Geslo je predolgo, vsebuje lahko največ 50 znakov';
				setOKgeslo(1);
			} else if (!/\d/.test(geslo)) {
				ustrezno = false;
				sporocilo1 = 'Geslo mora vsebovati vsaj eno števko';
				setOKgeslo(1);
			} else if (ustrezno) {
				sporocilo1 = '';
				setOKgeslo(2);
			} else {
				setOKgeslo(1);
			}
		}
		setSporocilo(sporocilo1);
	};

	const posljiNovoGeslo = async () => {
		if (OKgeslo === 2) {
			try {
				let odziv = await axios.get(
					`http://localhost:${global.config.port}/api/avtentikacija/posodobitevGesla`,
					{
						params: { uporabnisko_ime: uporabnik.uporabnisko_ime, geslo: geslo },
					}
				);
				setUporabnik({ ...uporabnik, geslo: odziv.data });
				props.setPosodobljenUporabnik({ ...props.posodobljenUporabnik, geslo: odziv.data });
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
					props.setSpreminjanjeAliBrisanje(false);
				}}>
				<label className='oznaka'>Vnesite novo geslo: </label>
				<input
					className='tekstovnoPolje'
					type='password'
					key='b'
					defaultValue=''
					onChange={(e) => {
						e.preventDefault();
						setGeslo(e.target.value);
					}}></input>
				<br />
				{(OKgeslo !== 2 || OKponovljeno !== 2) && sporocilo !== '' ? (
					<label className='opozorilo'>{sporocilo}</label>
				) : (
					<></>
				)}
				<br />
				{OKgeslo === 2 ? (
					<>
						<label className='oznaka'>Ponovno vnesite novo geslo: </label>
						<input
							className='tekstovnoPolje'
							type='password'
							key='c'
							onChange={(e) => {
								e.preventDefault();
								if (e.target.value === geslo) setOKponovljeno(2);
								else setOKponovljeno(1);
							}}></input>
						<br />
						{OKponovljeno === 2 ? (
							<label className='opozorilo' style={{ color: 'green' }}>
								Gesli se ujemata
							</label>
						) : (
							<label className='opozorilo'>Gesli se ne ujemata</label>
						)}
					</>
				) : (
					<></>
				)}
				<br />
				<button className='gumbPotrditev' type='submit' disabled={OKponovljeno !== 2 || OKgeslo !== 2}>
					Potrdi
				</button>
				<br />{' '}
				<button
					className='gumbPotrditev'
					onClick={(e) => {
						e.preventDefault();
						props.setUrediGeslo(false);
						props.setSpreminjanjeAliBrisanje(false);
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
			<label className='oznaka'>Vnesite staro geslo: </label>
			<input
				className='tekstovnoPolje'
				type='password'
				key='a'
				defaultValue=''
				onChange={(e) => {
					e.preventDefault();
					setGeslo(e.target.value);
					setJePravilno(null);
				}}></input>
			<br />
			<label className='opozorilo'>
				{jePravilno === null ? '' : jePravilno ? '' : 'Geslo ni pravilno'}
			</label>
			<br />
			<button type='submit' className='gumbPotrditev'>
				Potrdi
			</button>
			<br />
			<button
				className='gumbPotrditev'
				onClick={(e) => {
					e.preventDefault();
					props.setUrediGeslo(false);
					props.setSpreminjanjeAliBrisanje(false);
				}}>
				Nazaj na profil
			</button>
		</form>
	);
};

export default SpreminjanjeGesla;
