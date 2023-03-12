import axios from 'axios';
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const IzbrisProfila = ({ props }) => {
	const PORT = 3005; // !!!
	const [repeatPwd, setRepeatPwd] = useState(true);
	const [pwd, setPwd] = useState('');
	const [confirmation, setConfirmation] = useState(null);
	const [msg, setMsg] = useState({ pwdmsg: '' });
	const [error, setError] = useState(false);

	const { uporabnik, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const navigate = useNavigate();

	const handleClickCheckExisting = async () => {
		try {
			let response = await axios.get(`http://localhost:${PORT}/api/login/`, {
				params: {
					username: uporabnik.uporabnisko_ime,
					password: pwd,
				},
			});
			if (response.data) {
				setRepeatPwd(false);
				setMsg({ ...msg, pwdmsg: `` });
			} else {
				setMsg({ ...msg, pwdmsg: `Nepravilno geslo` });
			}
		} catch (error) {
			console.log(error);
			setMsg({ ...msg, errmsg: `${error.message} (${error.name})` });
			setError(true);
		}
	};

	const handleClickDelete = async () => {
		try {
			let response = await axios.delete(`http://localhost:${PORT}/api/login/del`, {
				params: {
					username: uporabnik.uporabnisko_ime,
				},
			});
		} catch (error) {
			console.log(error);
			setMsg({ ...msg, errmsg: `${error.message} (${error.name})` });
			setError(true);
		}
	};

	if (repeatPwd) {
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
							setPwd(e.target.value);
							setError(false);
							setMsg({ ...msg, pwdmsg: `` });
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

				{error ? <label>{msg.errmsg}</label> : msg.pwdmsg}
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
						setConfirmation(e.target.value);
						setError(false);
						setMsg({ ...msg, pwdmsg: `` });
					}}></input>
			</div>
			<button
				onClick={(e) => {
					e.preventDefault();
					if (confirmation === `briši račun ${uporabnik.uporabnisko_ime}`) {
						handleClickDelete();
						if (!error) {
							console.log('brišem...');
							setJeAvtenticiran(false);
							navigate('/', { state: { msg: `račun ${uporabnik.uporabnisko_ime} izbrisan` } });
						} else {
							console.log('Napaka');
						}
					} else {
						setMsg({
							...msg,
							pwdmsg: `Če želite izbrisati račun, vpišite: "briši račun ${uporabnik.uporabnisko_ime}"`,
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
			{error ? <label>{msg.errmsg}</label> : msg.pwdmsg}
		</div>
	);
};

export default IzbrisProfila;
