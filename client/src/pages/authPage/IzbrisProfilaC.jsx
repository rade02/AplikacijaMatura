import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const IzbrisProfila = ({ props }) => {
	const [ponovljenoGeslo, setPonovljenoGeslo] = useState(true);
	const [geslo, setGeslo] = useState('');
	const [potrditev, setPotrditev] = useState(null);
	const [sporocilo, setSporocilo] = useState({ sporociloGeslo: '' });
	const [error, setError] = useState(false);

	const { uporabnik, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const navigate = useNavigate();

	const handleClickCheckExisting = async () => {
		try {
			let response = await axios.get(`http://localhost:${global.config.port}/api/login/`, {
				params: {
					username: uporabnik.uporabnisko_ime,
					password: geslo,
				},
			});
			if (response.data) {
				setPonovljenoGeslo(false);
				setSporocilo({ ...sporocilo, sporociloGeslo: `` });
			} else {
				setSporocilo({ ...sporocilo, sporociloGeslo: `Nepravilno geslo` });
			}
		} catch (error) {
			console.log(error);
			setSporocilo({ ...sporocilo, sporociloNapaka: `${error.message} (${error.name})` });
			setError(true);
		}
	};

	const izbrisi = async () => {
		try {
			let response = await axios.delete(`http://localhost:${global.config.port}/api/login/del`, {
				params: {
					username: uporabnik.uporabnisko_ime,
				},
			});
		} catch (error) {
			console.log(error);
			setSporocilo({ ...sporocilo, sporociloNapaka: `${error.message} (${error.name})` });
			setError(true);
		}
	};

	if (ponovljenoGeslo) {
		return (
			<div>
				<h2>Izbris računa {uporabnik.uporabnisko_ime}</h2>
				<div>
					<label>Vnesite geslo: </label>
					<input
						type='password'
						key='1'
						onChange={(e) => {
							e.preventDefault();
							setGeslo(e.target.value);
							setError(false);
							setSporocilo({ ...sporocilo, sporociloGeslo: `` });
						}}></input>
				</div>

				<button
					onClick={(e) => {
						e.preventDefault();
						props.setDel(false);
					}}>
					Nazaj na profil
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						handleClickCheckExisting(e.target.value);
					}}>
					Potrdi
				</button>

				{error ? <label>{sporocilo.sporociloNapaka}</label> : sporocilo.sporociloGeslo}
			</div>
		);
	}
	return (
		<div>
			<h2>Izbris računa {uporabnik.uporabnisko_ime}</h2>
			<div>
				<label>Vnesite 'briši račun {uporabnik.uporabnisko_ime}': </label>
				<input
					type='text'
					key='2'
					onChange={(e) => {
						e.preventDefault();
						setPotrditev(e.target.value);
						setError(false);
						setSporocilo({ ...sporocilo, sporociloGeslo: `` });
					}}></input>
			</div>
			<button
				onClick={(e) => {
					e.preventDefault();
					if (potrditev === `briši račun ${uporabnik.uporabnisko_ime}`) {
						izbrisi();
						if (!error) {
							setJeAvtenticiran(false);
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
			<button
				onClick={(e) => {
					e.preventDefault();
					props.setDel(false);
				}}>
				Nazaj na profil
			</button>
			{error ? <label>{sporocilo.sporociloNapaka}</label> : sporocilo.sporociloGeslo}
		</div>
	);
};

export default IzbrisProfila;
