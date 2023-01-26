import axios from 'axios';
import { useState, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const ChangePassword = ({ props }) => {
	const PORT = 3005; // !!!
	const { user, setUser } = useContext(UserContext);
	const [password, setPassword] = useState('');
	const [isCorrect, setIsCorrect] = useState(null);

	const [OKpassword, setOKpassword] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno
	const [OKrepeat, setOKrepeat] = useState(4); // 0 - ni se vnosa, 1 - se ne ujema z geslom, 2 - veljavno
	const [msg, setMsg] = useState('');

	const handleSubmitOldPw = () => {
		if (user.geslo === password) {
			setIsCorrect(true);
			setPassword('');
		} else {
			setIsCorrect(false);
		}
	};

	const checkPasswordValidity = (password) => {
		let m = '';
		if (password === '') {
			setOKpassword(0);
			m = '';
		} else {
			let illegalChars = ['%', '"', "'"];
			let valid = true;

			for (let i = 0; i < illegalChars.length; i++) {
				if (password.includes(illegalChars[i])) {
					valid = false;
					m = 'Uporabljeni so bili nedovoljeni znaki (%, ", \')';
				}
			}
			if (password.length < 6 || password.length > 50) {
				valid = false;
				m =
					password.length < 6
						? 'Geslo je prekratko, vsebovati mora najmanj 6 znakov'
						: 'Geslo je predolgo, vsebuje lahko največ 50 znakov';
				setOKpassword(1);
			} else if (!/\d/.test(password)) {
				valid = false;
				m = 'Geslo mora vsebovati vsaj eno števko';
				setOKpassword(1);
			} else if (valid) {
				setOKpassword(2);
				setPassword(password);
			} else {
				setOKpassword(1);
			}
		}
		setMsg(m);
	};

	const handleSubmitNewPw = async () => {
		if (OKpassword === 2) {
			try {
				let response = await axios.post(`http://localhost:${PORT}/api/login/pwdUpdt`, {
					username: user.uporabnisko_ime,
					password: password,
				});
				//console.log(response.data);
				setUser({ ...user, geslo: password });
				props.setUpdatedUser({ ...props.updatedUser, geslo: password });
				props.setEditPw(false);
			} catch (onRejectedError) {
				console.log(onRejectedError);
			}
		} else {
			setOKpassword(1);
		}
	};

	if (isCorrect) {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmitNewPw();
				}}>
				<label>Vnesite novo geslo: </label>
				<input
					type='password'
					key='b'
					defaultValue=''
					onChange={(e) => {
						e.preventDefault();
						checkPasswordValidity(e.target.value);
					}}></input>
				<br />
				<label>Ponovno vnesite novo geslo: </label>
				<input
					type='password'
					key='c'
					onChange={(e) => {
						e.preventDefault();
						if (e.target.value === password) setOKrepeat(2);
						else setOKrepeat(1);
					}}></input>
				{OKrepeat === 2 ? <>Gesli se ujemata</> : <>Gesli se ne ujemata</>}
				<br />
				<button type='submit' disabled={OKrepeat !== 2 || OKpassword !== 2}>
					Potrdi
				</button>
				<br />{' '}
				<button
					onClick={(e) => {
						e.preventDefault();
						props.setEditPw(false);
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
				handleSubmitOldPw();
			}}>
			<label>Vnesite staro geslo: </label>
			<input
				type='password'
				key='a'
				defaultValue=''
				onChange={(e) => {
					e.preventDefault();
					setPassword(e.target.value);
				}}></input>
			<button type='submit'>Potrdi</button>
			<br />
			<button
				onClick={(e) => {
					e.preventDefault();
					props.setEditPw(false);
				}}>
				Nazaj na profil
			</button>
			<br />
			<label>{isCorrect === null ? '' : isCorrect ? '' : 'Geslo ni pravilno'}</label>
		</form>
	);
};

export default ChangePassword;
