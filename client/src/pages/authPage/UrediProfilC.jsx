import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import {
	Pencil,
	Password,
	FloppyDisk,
	ClockCounterClockwise,
	SignOut,
	Key,
	Eraser,
	UserMinus,
} from 'phosphor-react';
import UserDataComponent from './UserDataComponent';
import ChangePassword from './ChangePasswordComponent';
import DeleteProfile from './DeleteProfileComponent';

const UrediProfil = ({ vloga, setStanjeAdmin }) => {
	const PORT = 3005; // !!!
	const { user, setUser, setIsAuth } = useContext(UserContext);
	const [edit, setEdit] = useState(false);
	const [editPw, setEditPw] = useState(false);
	const [updatedUser, setUpdatedUser] = useState(user);
	const [error, setError] = useState(false);
	const [del, setDel] = useState(false);

	const handleClick = async () => {
		try {
			const result = await axios.post(`http://localhost:${PORT}/api/login/updt`, updatedUser);
			setUser(updatedUser);
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
				<h2>Profil: {user.uporabnisko_ime}</h2>
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
		<div className='funkcije'>
			<h2>
				Profil: {user.uporabnisko_ime}{' '}
				{vloga !== 2
					? vloga === 0
						? '(administrator)'
						: vloga === 1
						? '(zaposleni)'
						: vloga === 3
						? '(računovodja)'
						: ''
					: ''}
			</h2>
			<div>
				<div>
					{vloga !== 0 ? (
						<>
							<button
								onClick={(e) => {
									e.preventDefault();
									setEdit(!edit);
								}}>
								Uredi <Pencil size={22} />
							</button>
						</>
					) : (
						<></>
					)}
					<button
						onClick={(e) => {
							e.preventDefault();
							setEditPw(!editPw);
						}}>
						Spremeni geslo
						<Key size={22} />
					</button>
				</div>
				<div>
					<UserDataComponent
						props={{
							updatedUser: updatedUser,
							setUpdatedUser: setUpdatedUser,
							edit: edit,
							user: user,
						}}
					/>
					{vloga !== 0 ? (
						<>
							<button
								disabled={JSON.stringify(updatedUser) === JSON.stringify(user) ? 'disabled' : ''}
								onClick={(e) => {
									e.preventDefault();
									setEdit(false);
									handleClick();
								}}>
								Shrani spremembe <FloppyDisk size={22} />
							</button>
							<button
								disabled={JSON.stringify(updatedUser) === JSON.stringify(user) ? 'disabled' : ''}
								onClick={(e) => {
									e.preventDefault();

									console.log(user);
									console.log(updatedUser);
									setUpdatedUser(user);
									setEdit(false);
								}}>
								Ponastavi <ClockCounterClockwise size={22} />
							</button>

							{error ? <label>Napačen vnos podatkov</label> : null}
						</>
					) : (
						<></>
					)}
				</div>
				<div>
					<button
						onClick={(e) => {
							e.preventDefault();
							setIsAuth(false);
						}}>
						Odjava <SignOut size={22} />
					</button>
					{vloga !== 0 ? (
						<button
							onClick={(e) => {
								e.preventDefault();
								setDel(true);
							}}>
							Izbriši račun <UserMinus size={22} />
						</button>
					) : (
						<button
							onClick={(e) => {
								e.preventDefault();
								setStanjeAdmin(0);
							}}>
							Nazaj
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default UrediProfil;
