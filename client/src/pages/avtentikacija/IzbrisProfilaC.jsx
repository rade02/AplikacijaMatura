import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const IzbrisProfila = ({ props }) => {
	const [ponovljenoGeslo, setPonovljenoGeslo] = useState(true);
	const [geslo, setGeslo] = useState('');
	const [potrditev, setPotrditev] = useState(null);
	const [sporocilo, setSporocilo] = useState({ sporociloGeslo: '' });
	const [napaka, setNapaka] = useState(false);
	const { uporabnik, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const navigate = useNavigate();

	const preveriObstojece = async () => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/avtentikacija/`, {
				params: {
					uporabnisko_ime: uporabnik.uporabnisko_ime,
					geslo: geslo,
				},
			});
			if (odziv.data) {
				setPonovljenoGeslo(false);
				setSporocilo({ ...sporocilo, sporociloGeslo: `` });
			} else {
				setSporocilo({ ...sporocilo, sporociloGeslo: `Nepravilno geslo` });
			}
		} catch (napaka) {
			console.log(napaka);
			setSporocilo({ ...sporocilo, sporociloNapaka: `${napaka.message} (${napaka.name})` });
			setNapaka(true);
		}
	};

	const izbrisi = async () => {
		try {
			await axios.delete(`http://localhost:${global.config.port}/api/avtentikacija/izbrisi`, {
				params: {
					uporabnisko_ime: uporabnik.uporabnisko_ime,
				},
			});
		} catch (napaka) {
			console.log(napaka);
			setSporocilo({ ...sporocilo, sporociloNapaka: `${napaka.message} (${napaka.name})` });
			setNapaka(true);
		}
	};

	if (ponovljenoGeslo) {
		return (
			<div>
				<h2>Izbris računa {uporabnik.uporabnisko_ime}</h2>
				<div>
					<label className='oznaka'>Vnesite geslo: </label>
					<input
						className='tekstovnoPolje'
						type='password'
						key='1'
						onChange={(e) => {
							e.preventDefault();
							setGeslo(e.target.value);
							setNapaka(false);
							setSporocilo({ ...sporocilo, sporociloGeslo: `` });
						}}></input>
				</div>
				{napaka ? (
					<label className='opozorilo'>{sporocilo.sporociloNapaka}</label>
				) : (
					<label className='opozorilo'>{sporocilo.sporociloGeslo}</label>
				)}
				<br />
				<button
					className='gumbPotrditev'
					onClick={(e) => {
						e.preventDefault();
						props.setIzbrisi(false);
						props.setSpreminjanjeAliBrisanje(false);
					}}>
					Nazaj na profil
				</button>
				<br />
				<button
					className='gumbPotrditev'
					onClick={(e) => {
						e.preventDefault();
						preveriObstojece(e.target.value);
					}}>
					Potrdi
				</button>
			</div>
		);
	}
	return (
		<div>
			<h2>Izbris računa {uporabnik.uporabnisko_ime}</h2>
			<div>
				<label className='oznaka'>Vnesite 'briši račun {uporabnik.uporabnisko_ime}': </label>
				<input
					type='text'
					className='tekstovnoPolje'
					key='2'
					onChange={(e) => {
						e.preventDefault();
						setPotrditev(e.target.value);
						setNapaka(false);
						setSporocilo({ ...sporocilo, sporociloGeslo: `` });
					}}></input>
			</div>
			{napaka ? (
				<label className='opozorilo'>{sporocilo.sporociloNapaka}</label>
			) : (
				<label className='opozorilo'>{sporocilo.sporociloGeslo}</label>
			)}
			<br />
			<button
				className='gumbPotrditev'
				onClick={(e) => {
					e.preventDefault();
					props.setIzbrisi(false);
					props.setSpreminjanjeAliBrisanje(false);
				}}>
				Nazaj na profil
			</button>
			<br />
			<button
				className='gumbPotrditev'
				onClick={(e) => {
					e.preventDefault();
					if (potrditev === `briši račun ${uporabnik.uporabnisko_ime}`) {
						izbrisi();
						if (!napaka) {
							setJeAvtenticiran(false);
							props.setSpreminjanjeAliBrisanje(false);
							navigate('/', { state: { sporocilo: `račun ${uporabnik.uporabnisko_ime} izbrisan` } });
						} else {
							console.log('Napaka');
						}
					} else {
						setSporocilo({
							...sporocilo,
							sporociloGeslo: `Če želite izbrisati račun, vpišite: "briši račun ${uporabnik.uporabnisko_ime}"`,
						});
					}
				}}>
				Potrdi
			</button>
		</div>
	);
};

export default IzbrisProfila;
