import axios from 'axios';
import { CheckCircle, XCircle } from 'phosphor-react';
import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const SignUpComponent = () => {
	// TODO: enter --> skoči na drugo vnosno polje
	// TODO: geslu dodaj se obvezne posebne znake (!, ., ...)
	// TODO: popravi msg: setterje izven eventa (ne dela ce popravljamo)

	const PORT = 3005; // !!!
	const { setUser, setIsAuth } = useContext(UserContext);
	const navigate = useNavigate();

	const [inputData, setInputData] = useState({
		uporabnisko_ime: null,
		geslo: null,
		elektronski_naslov: null,
		ime: null,
		priimek: null,
		ulica_in_hisna_stevilka: null,
		kraj: null,
		postna_stevilka: null,
		telefonska_stevilka: null,
		podjetje: null,
	});
	const [retry, setRetry] = useState(false);
	const [OKusername, setOKusername] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno, 3 - zasedeno
	const [OKpassword, setOKpassword] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - veljavno
	const [OKrepeat, setOKrepeat] = useState(4); // 0 - ni se vnosa, 1 - se ne ujema z geslom, 2 - veljavno
	const [OKemail, setOKemail] = useState(0); // 0 - ni se vnosa, 1 - ni veljavno, 2 - ze uporabljeno, 3 - veljavno
	const [msg, setMsg] = useState({ UNmsg: '', PWmsg: '', msgPW2: '', EMmsg: '' });
	const pwdRef = useRef(null);

	const handleSubmit = async () => {
		try {
			if (inputData !== null) {
				Object.keys(inputData).map((key) => {
					if (inputData[key] === null) {
						setRetry(true);
					}
					return inputData;
				});
			}

			if (retry || OKusername !== 2 || OKpassword !== 2 || OKemail !== 3) {
				let warn = '';
				if (retry) {
					warn = 'Ponovno vnesite potrebne podatke';
				} else if (OKusername !== 2) {
					warn = 'Uporabniško ime ni veljavno';
				} else if (OKpassword !== 2) {
					warn = 'Geslo ni veljavno';
				} else if (OKemail !== 3) {
					warn = 'Neveljaven elektronski naslov';
				}
				alert(`Registracija NEuspešna: \n${warn}`);
			} else {
				console.log(inputData);
				let response = await axios.post(`http://localhost:${PORT}/api/login/newUser`, {
					uporabnisko_ime: inputData.uporabnisko_ime,
					geslo: inputData.geslo,
					elektronski_naslov: inputData.elektronski_naslov,
					ime: inputData.ime,
					priimek: inputData.priimek,
					ulica_in_hisna_stevilka: inputData.ulica_in_hisna_stevilka,
					kraj: inputData.kraj,
					postna_stevilka: inputData.postna_stevilka,
					podjetje: inputData.podjetje,
				});

				if (response.data === 'insertion successful') {
					setIsAuth(true);
					setUser(inputData);
					//TODO: notification card - success
				}
				alert('Registracija uspešna: ' + JSON.stringify(inputData));
			}
		} catch (error) {
			setRetry(true);
			setMsg({ ...msg, errmsg: `${error.code} (${error.response.status})` });
			console.log(error);
		}
	};

	const checkUnameAvailability = async (uname) => {
		try {
			if (uname === '') setOKusername(0);
			else {
				let checkUn = checkUnameValidity(uname);
				if (!checkUn.isValid) {
					setOKusername(1);
					setMsg({ ...msg, UNmsg: checkUn.msg });
				} else {
					const result = await axios.get(`http://localhost:${PORT}/api/login/user`, {
						params: { username: uname },
					});
					if (result.data !== '') {
						setOKusername(3);
					} else {
						setOKusername(2);
					}
				}
			}
		} catch (error) {
			setOKusername(2);
			setRetry(true);
			setMsg({ ...msg, errmsg: `${error.code} (${error.response.status})` });
			console.log(error);
		}
	};
	const checkUnameValidity = (uname) => {
		let illegalChars = ['%', '"', "'"];
		let valid = true;
		let msg = '';

		for (let i = 0; i < illegalChars.length; i++) {
			if (uname.includes(illegalChars[i])) {
				valid = false;
				msg = 'Uporabljeni so bili nedovoljeni znaki (%, ", \')';
			}
		}
		if (uname.length < 4 || uname.length > 50) {
			valid = false;
			msg =
				uname.length < 4
					? 'Uporabniško ime je prekratko, vsebovati mora najmanj 4 znake'
					: 'Uporabniško ime je predolgo, vsebuje lahko največ 50 znakov';
		}
		return { isValid: valid, msg: msg };
	};
	const checkPasswordValidity = (password) => {
		if (password === '') {
			setOKpassword(0);
		} else {
			let illegalChars = ['%', '"', "'"];
			let valid = true;
			let m = '';

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
				setRetry(true);
			} else if (!/\d/.test(password)) {
				valid = false;
				m = 'Geslo mora vsebovati vsaj eno števko';
				setOKpassword(1);
				setRetry(true);
			} else if (valid) {
				setOKpassword(2);
				setRetry(false);
			} else {
				setOKpassword(1);
				setRetry(true);
			}
			setMsg({ ...msg, PWmsg: m });

			if (OKpassword !== 2) setMsg({ ...msg, PWmsg: m, msgPW2: 'Ponovite geslo' });
			//return { isValid: valid, msg: m };
		}
	};
	const checkEmailAvailability = async (email) => {
		setMsg({ ...msg, EMmsg: '' });
		try {
			if (email === '') setOKemail(0);
			else {
				let checkEm = checkEmailValidity(email);
				console.log(checkEm.isValid.toString());
				console.log(checkEm.msg);
				if (!checkEm.isValid) {
					setOKemail(1);
					setMsg({ ...msg, EMmsg: checkEm.msg });
				} else {
					const result = await axios.get(`http://localhost:${PORT}/api/login/email`, {
						params: { email: email },
					});
					if (result.data !== '') {
						setOKemail(2);
					} else {
						setOKemail(3);
					}
				}
			}
		} catch (error) {
			setOKusername(3);
			setRetry(true);
			setMsg({ ...msg, errmsg: `${error.code} (${error.response.status})` });
			console.log(error);
		}
	};
	const checkEmailValidity = (email) => {
		let valid = true;
		let msg = '';
		if (!email.includes('@')) {
			valid = false;
			setOKemail(1);
			msg = "E-naslov mora vsebovati znak '@'";
		} else {
			let index = email.indexOf('@');
			if (email[++index] === undefined || email[++index] === '') {
				valid = false;
				setOKemail(1);
				msg = 'Vnesite veljaven e-naslov';
			}
		}
		console.log(msg);
		return { isValid: valid, msg: msg };
	};

	return (
		<div className='registerDiv cards'>
			<h2>Registracija</h2>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}>
				<div>
					<p>Pozdravljeni, registrirajte se in pridobite možnost hitrejšega spletnega naročanja.</p>
				</div>

				<label>Že imate račun? </label>
				<button
					onClick={(e) => {
						e.preventDefault();
						navigate('/auth', { state: { loggingMode: 'signin' } });
					}}>
					Prijava
				</button>

				<div className='inputFields'>
					<div>
						<label>Uporabniško ime:</label>
						<br />
						<input
							type='text'
							className='forInfo'
							required
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, uporabnisko_ime: e.target.value });
								setRetry(false);
								checkUnameAvailability(e.target.value);
							}}
							maxLength={150}></input>
						<br />
						{OKusername === 0 ? (
							<></>
						) : OKusername === 1 ? (
							<div style={{ color: '#520F01' }}>
								<XCircle size={22} style={{ color: '#520F01' }} /> Neveljavno uporabniško ime <br />(
								{msg.UNmsg})
							</div>
						) : OKusername === 2 ? (
							<div style={{ color: 'green' }}>
								<CheckCircle size={22} style={{ color: 'green' }} />
								Veljavno uporabniško ime
							</div>
						) : (
							<div style={{ color: '#520F01' }}>
								<XCircle size={22} style={{ color: '#520F01' }} />
								Uporabniško ime zasedeno
							</div>
						)}
						<p></p>
					</div>
					<div>
						<label>Geslo:</label>
						<br />
						<input
							type='password'
							ref={pwdRef}
							className='forInfo'
							required
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, geslo: e.target.value });
								setRetry(false);
								checkPasswordValidity(e.target.value);
								setOKrepeat(OKrepeat);
							}}
							maxLength={150}></input>
						<br />
						{OKpassword === 2 ? (
							<div style={{ color: 'green' }}>
								<CheckCircle size={22} style={{ color: 'green' }} />
								Veljavno geslo
							</div>
						) : OKpassword === 1 ? (
							<div style={{ color: '#520F01' }}>
								<XCircle size={22} style={{ color: '#520F01' }} /> Neveljavno geslo{' '}
								{msg.PWmsg !== '' ? `(${msg.PWmsg})` : null}
								<br />
							</div>
						) : (
							<></>
						)}
					</div>

					<div>
						<label>Ponovite geslo:</label>
						<br />
						<input
							type='password'
							className='forInfo'
							required
							disabled={!(OKpassword === 2)}
							onChange={(e) => {
								e.preventDefault();
								if (e.target.value === '') {
									setMsg({ ...msg, msgPW2: 'Ponovno vnesite geslo' });
									setRetry(true);
									setOKrepeat(0);
								} else if (pwdRef.current.value === e.target.value) {
									setInputData({ ...inputData, geslo: e.target.value });
									setMsg({ ...msg, msgPW2: 'Gesli se ujemata' });
									setRetry(false);
									setOKrepeat(2);
								} else if (e.target.value !== '') {
									setInputData({ ...inputData, geslo: null });
									setMsg({ ...msg, msgPW2: 'Gesli se ne ujemata' });
									setRetry(true);
									setOKrepeat(1);
								}
								setOKpassword(OKpassword);
							}}
							maxLength={150}></input>
						<br />
						{OKrepeat === 2 ? (
							<div style={{ color: 'green' }}>
								<CheckCircle size={22} style={{ color: 'green' }} />
								{msg.msgPW2}
							</div>
						) : OKrepeat === 1 ? (
							<div style={{ color: '#520F01' }}>
								<XCircle size={22} style={{ color: '#520F01' }} /> {msg.msgPW2}
								<br />
							</div>
						) : msg !== null && msg.msgPW2 !== null && OKrepeat === 0 ? (
							<div style={{ color: '#520F01' }}>
								<XCircle size={22} style={{ color: '#520F01' }} />
								{msg.msgPW2}
								<br />
							</div>
						) : (
							<></>
						)}
						<p></p>
					</div>
					<div>
						<label>E-naslov:</label>
						<br />
						<input
							type='email'
							className='forInfo'
							required
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, elektronski_naslov: e.target.value });
								setRetry(false);
								checkEmailAvailability(e.target.value);
								setOKrepeat(OKrepeat);
							}}
							maxLength={160}></input>
						<br />
						{OKemail === 3 ? (
							<div style={{ color: 'green' }}>
								<CheckCircle size={22} style={{ color: 'green' }} />
								Veljaven e-naslov
							</div>
						) : OKemail === 0 ? (
							<></>
						) : OKemail === 1 ? (
							<div style={{ color: '#520F01' }}>
								<XCircle size={22} style={{ color: '#520F01' }} /> Vnesite veljaven e-naslov{' '}
								{msg.EMmsg !== '' ? `(${msg.EMmsg})` : null}
								<br />
							</div>
						) : (
							<div style={{ color: '#520F01' }}>
								<XCircle size={22} style={{ color: '#520F01' }} /> Ta e-naslov je že zaseden{' '}
								{msg.EMmsg !== '' ? `(${msg.EMmsg})` : null}
								<br />
							</div>
						)}
						<p></p>
					</div>

					<div>
						<label>Ime:</label>
						<br />
						<input
							type='text'
							className='forInfo'
							required
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, ime: e.target.value });
								setRetry(false);
							}}
							maxLength={120}></input>
						<br />
					</div>
					<div>
						<label>Priimek:</label>
						<br />
						<input
							type='text'
							className='forInfo'
							required
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, priimek: e.target.value });
								setRetry(false);
							}}
							maxLength={130}></input>
						<br />
						<p></p>
					</div>
					<div>
						<label>Ulica in hišna številka:</label>
						<br />
						<input
							type='text'
							className='forInfo'
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, ulica_in_hisna_stevilka: e.target.value });
								setRetry(false);
							}}
							maxLength={160}></input>
						<br />
						<p></p>
					</div>
					<div>
						<label>Poštna številka in kraj:</label>
						<br />
						<input
							type='text'
							className='forInfo'
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, postna_stevilka: e.target.value });
								setRetry(false);
							}}
							maxLength={4}></input>
						<input
							type='text'
							className='forInfo'
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, kraj: e.target.value });
								setRetry(false);
							}}
							maxLength={130}></input>
						<br />
						<p></p>
					</div>
					<div>
						<label>Telefonska številka:</label>
						<br />
						<input
							type='text'
							className='forInfo'
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, telefonska_stevilka: e.target.value });
								setRetry(false);
							}}
							maxLength={20}></input>
						<br />
						<p></p>
					</div>
					<div>
						<label>Podjetje:</label>
						<br />
						<input
							type='text'
							className='forInfo'
							onChange={(e) => {
								e.preventDefault();
								setInputData({ ...inputData, podjetje: e.target.value });
								setRetry(false);
							}}
							maxLength={255}></input>
						<br />
						<p></p>
					</div>
					<button type='submit' className='submitButton'>
						Potrdi
					</button>
					<br />
					{retry ? <div>{msg.errmsg !== null ? msg.errmsg : 'Napačen vnos'}</div> : <></>}
				</div>
			</form>
		</div>
	);
};

export default SignUpComponent;
