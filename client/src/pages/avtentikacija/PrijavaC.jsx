import axios from 'axios';
import { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const Prijava = () => {
	const { setUporabnik, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const [typedUsername, setTypedUsername] = useState('');
	const [typedPassword, setTypedPassword] = useState('');
	const [msg, setMsg] = useState('');
	const un = useRef(null);
	const pwd = useRef(null);

	const navigate = useNavigate();

	// TODO: check password validity when changing in component
	// TODO: ce nima naslova, ne prikazemo naslova pri podatkih nakupa
	// TODO: zakrij geslo

	const handleSubmit = async (typedUsername, typedPassword) => {
		console.log('handle submit');
		try {
			if (typedUsername !== '' && typedPassword !== '') {
				// check un-pwd pair in the DB:
				let response = await axios.get(`http://localhost:${global.config.port}/api/avtentikacija/`, {
					params: {
						username: typedUsername,
						password: typedPassword,
					},
				});
				if (typeof response.data !== 'boolean') {
					if (response.data.omogocen === 0) {
						setTypedUsername('');
						setTypedPassword('');
						un.current = '';
						pwd.current = '';
						setMsg('Vaš profil je bil onemogočen');
					} else {
						// get all user's data from DB using request:
						var data = await axios.get(`http://localhost:${global.config.port}/api/avtentikacija/user`, {
							params: { username: typedUsername },
						});
						let userData = { ...data.data, geslo: typedPassword };
						// into context:
						setUporabnik({ ...userData, uporabnisko_ime: typedUsername });
						setJeAvtenticiran(true);
					}
				} else {
					setTypedUsername('');
					setTypedPassword('');
					un.current = '';
					pwd.current = '';
					setMsg('Napačni podatki');
				}
			} else {
				setMsg('Vnesite uporabniško ime in geslo');
			}
		} catch (error) {
			setMsg(error.code + ' (' + error.response.status + ')');
			console.log(error);
		}
	};

	return (
		<div className='kartice prijava'>
			<h2>Prijava</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit(typedUsername, typedPassword);
				}}>
				<label>Uporabniško ime:</label>
				<br />
				<input
					type='text'
					value={typedUsername}
					onChange={(e) => {
						setTypedUsername(e.target.value);
						setMsg('');
					}}></input>
				<br />
				<label>Geslo:</label>
				<br />
				<input
					type='password'
					value={typedPassword}
					onChange={(e) => {
						setTypedPassword(e.target.value);
						setMsg('');
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
			{msg !== null && msg !== '' ? (
				<div className='sporociloNapake'>
					<i>{msg}</i>
				</div>
			) : (
				<></>
			)}
		</div>
	);
};

export default Prijava;
