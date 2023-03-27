import axios from 'axios';
import { useContext, useState } from 'react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';
import { Pencil, FloppyDisk, ClockCounterClockwise, SignOut, Key, UserMinus } from 'phosphor-react';
import PodatkiUporabnika from './PodatkiUporabnikaC';
import SpreminjanjeGesla from './SpreminjanjeGeslaC';
import IzbrisProfila from './IzbrisProfilaC';

const UrejanjeProfila = ({ vloga, setStanjeAdmin }) => {
	const { uporabnik, setUporabnik, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const [uredi, setUredi] = useState(false);
	const [urediGeslo, setUrediGeslo] = useState(false);
	const [posodobljenUporabnik, setPosodobljenUporabnik] = useState(uporabnik);
	const [napaka, setNapaka] = useState(false);
	const [izbrisi, setIzbrisi] = useState(false);

	const shraniSpremembe = async () => {
		try {
			await axios.post(
				`http://localhost:${global.config.port}/api/avtentikacija/posodobitev`,
				posodobljenUporabnik
			);
			setUporabnik(posodobljenUporabnik);
			setUredi(false);
		} catch (napaka) {
			console.log(napaka);
			setNapaka(true);
		}
	};
	if (urediGeslo) {
		return (
			<>
				<h2>Profil: {uporabnik.uporabnisko_ime}</h2>
				<SpreminjanjeGesla
					props={{
						posodobljenUporabnik: posodobljenUporabnik,
						setPosodobljenUporabnik: setPosodobljenUporabnik,
						setUrediGeslo: setUrediGeslo,
					}}
				/>
			</>
		);
	}

	if (izbrisi && vloga === 2) {
		return (
			<IzbrisProfila
				props={{
					setIzbrisi: setIzbrisi,
				}}
			/>
		);
	}
	return (
		<div className='urejanjeProfila'>
			<div className='podatkiOUporabniku'>
				<div className='urejanje'>
					{vloga !== 0 ? (
						<>
							<button
								className='gumb2'
								onClick={(e) => {
									e.preventDefault();
									setUredi(!uredi);
								}}>
								Uredi <Pencil size={22} style={{ marginLeft: '4px' }} />
							</button>
						</>
					) : (
						<></>
					)}
					<button
						className='gumb2'
						onClick={(e) => {
							e.preventDefault();
							setUrediGeslo(!urediGeslo);
						}}>
						Spremeni geslo
						<Key size={22} style={{ marginLeft: '4px' }} />
					</button>
				</div>

				<PodatkiUporabnika
					props={{
						posodobljenUporabnik: posodobljenUporabnik,
						setPosodobljenUporabnik: setPosodobljenUporabnik,
						uredi: uredi,
					}}
				/>
				<div className='gumbi'>
					{' '}
					{vloga !== 0 ? (
						<>
							<button
								className={
									JSON.stringify(posodobljenUporabnik) === JSON.stringify(uporabnik)
										? 'gumbOnemogocen'
										: 'gumb2'
								}
								disabled={
									JSON.stringify(posodobljenUporabnik) === JSON.stringify(uporabnik) ? 'disabled' : ''
								}
								onClick={(e) => {
									e.preventDefault();
									setUredi(false);
									shraniSpremembe();
								}}>
								Shrani spremembe <FloppyDisk size={22} style={{ marginLeft: '4px' }} />
							</button>
							<button
								className={
									JSON.stringify(posodobljenUporabnik) === JSON.stringify(uporabnik)
										? 'gumbOnemogocen'
										: 'gumb2'
								}
								disabled={
									JSON.stringify(posodobljenUporabnik) === JSON.stringify(uporabnik) ? 'disabled' : ''
								}
								onClick={(e) => {
									e.preventDefault();
									setPosodobljenUporabnik(uporabnik);
									setUredi(false);
								}}>
								Ponastavi <ClockCounterClockwise size={22} style={{ marginLeft: '4px' }} />
							</button>

							{napaka ? <label>Napačen vnos podatkov</label> : null}
						</>
					) : (
						<></>
					)}
				</div>
				<div className='gumbi'>
					<button
						className='gumb2'
						onClick={(e) => {
							e.preventDefault();
							setJeAvtenticiran(false);
						}}>
						Odjava <SignOut size={22} style={{ marginLeft: '4px' }} />
					</button>
					{vloga !== 0 ? (
						<button
							className='gumb2'
							onClick={(e) => {
								e.preventDefault();
								setIzbrisi(true);
							}}>
							Izbriši račun <UserMinus size={22} style={{ marginLeft: '4px' }} />
						</button>
					) : (
						<></>
					)}
				</div>
			</div>
		</div>
	);
};

export default UrejanjeProfila;
