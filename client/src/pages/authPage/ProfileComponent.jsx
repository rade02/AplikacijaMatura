import axios from 'axios';
import { Pencil, Password, FloppyDisk, ClockCounterClockwise, SignOut } from 'phosphor-react';
import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import ChangePassword from './ChangePasswordComponent';
import DeleteProfile from './DeleteProfileComponent';
import NotificationCard from './NotificationCardComponent';
import UserDataComponent from './UserDataComponent';

const Profile = () => {
	const PORT = 3005; // !!!
	const { user, setUser, setIsAuth } = useContext(UserContext);
	const [edit, setEdit] = useState(false);
	const [editPw, setEditPw] = useState(false);
	const [updatedUser, setUpdatedUser] = useState(user);
	const [error, setError] = useState(false);
	const [del, setDel] = useState(false);

	// TODO: na domaci strani naredi okno ki se pojavi ob izbrisu profila
	// TODO: PREVERI CE JE VNOS PRAVILEN (int, date ...)
	// TODO: ne dela ce refreshamo na profile page in gremo nazaj na prijavo (isAuth se ponastavi, ostalo pa ne)
	// TODO: ne dela ce refreshamo - prikaze napacne podatke
	// ce vnesemo nove podatke v prazno polje in nato pritisnemo Ponastavi, se ne izbriše vsebina

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

	if (del) {
		return (
			<DeleteProfile
				props={{
					setDel: setDel,
				}}
			/>
		);
	}

	return (
		<div>
			<NotificationCard />
			<h2>Profil: {user.uporabnisko_ime}</h2>
			<div>
				<button
					onClick={(e) => {
						e.preventDefault();
						setEdit(!edit);
					}}>
					Uredi <Pencil size={22} />
				</button>
				<button
					onClick={(e) => {
						e.preventDefault();
						setEditPw(!editPw);
					}}>
					Spremeni geslo
					<Password size={22} />
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
			</div>
			<button
				onClick={(e) => {
					e.preventDefault();
					setIsAuth(false);
				}}>
				Odjava <SignOut size={22} />
			</button>
			<button
				onClick={(e) => {
					e.preventDefault();
					setDel(true);
				}}>
				Izbriši račun
			</button>
		</div>
	);
};

//

export default Profile;
