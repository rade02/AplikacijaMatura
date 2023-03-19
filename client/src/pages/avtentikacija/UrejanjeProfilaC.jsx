import axios from 'axios';
import { useContext, useState } from 'react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';
import { Pencil, FloppyDisk, ClockCounterClockwise, SignOut, Key, UserMinus } from 'phosphor-react';
import PodatkiUporabnika from './PodatkiUporabnikaC';
import ChangePassword from './SpreminjanjeGeslaC';
import DeleteProfile from './IzbrisProfilaC';

const UrejanjeProfila = ({ vloga, setStanjeAdmin }) => {
	const { uporabnik, setUporabnik, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const [edit, setEdit] = useState(false);
	const [editPw, setEditPw] = useState(false);
	const [updatedUser, setUpdatedUser] = useState(uporabnik);
	const [error, setError] = useState(false);
	const [del, setDel] = useState(false);

	const handleClick = async () => {
		try {
			const result = await axios.post(
				`http://localhost:${global.config.port}/api/avtentikacija/updt`,
				updatedUser
			);
			setUporabnik(updatedUser);
			setEdit(false);
			//console.log(result.data);
		} catch (onRejectedError) {
			console.log(onRejectedError);
			setError(true);
		}
	};
	if (editPw) {
		return (
			<>
				<h2>Profil: {uporabnik.uporabnisko_ime}</h2>
				<ChangePassword
					props={{
						updatedUser: updatedUser,
						setUpdatedUser: setUpdatedUser,
						setEditPw: setEditPw,
					}}
				/>
			</>
		);
	}

	if (del && vloga === 2) {
		return (
			<DeleteProfile
				props={{
					setDel: setDel,
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
									setEdit(!edit);
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
							setEditPw(!editPw);
						}}>
						Spremeni geslo
						<Key size={22} style={{ marginLeft: '4px' }} />
					</button>
				</div>

				<PodatkiUporabnika
					props={{
						updatedUser: updatedUser,
						setUpdatedUser: setUpdatedUser,
						edit: edit,
						user: uporabnik,
					}}
				/>
				<div className='gumbi'>
					{' '}
					{vloga !== 0 ? (
						<>
							<button
								className={
									JSON.stringify(updatedUser) === JSON.stringify(uporabnik) ? 'gumbDisabled' : 'gumb2'
								}
								disabled={JSON.stringify(updatedUser) === JSON.stringify(uporabnik) ? 'disabled' : ''}
								onClick={(e) => {
									e.preventDefault();
									setEdit(false);
									handleClick();
								}}>
								Shrani spremembe <FloppyDisk size={22} style={{ marginLeft: '4px' }} />
							</button>
							<button
								className={
									JSON.stringify(updatedUser) === JSON.stringify(uporabnik) ? 'gumbDisabled' : 'gumb2'
								}
								disabled={JSON.stringify(updatedUser) === JSON.stringify(uporabnik) ? 'disabled' : ''}
								onClick={(e) => {
									e.preventDefault();

									//console.log(uporabnik);
									//console.log(updatedUser);
									setUpdatedUser(uporabnik);
									setEdit(false);
								}}>
								Ponastavi <ClockCounterClockwise size={22} style={{ marginLeft: '4px' }} />
							</button>

							{error ? <label>Napačen vnos podatkov</label> : null}
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
								setDel(true);
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
