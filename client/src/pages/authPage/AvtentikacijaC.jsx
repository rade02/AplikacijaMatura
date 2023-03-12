import './Avtentikacija.css';
import Error from '../errorPage/ErrorPage';
import { useContext } from 'react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Registracija from './RegistracijaC';
import Prijava from './PrijavaC';
import Profil from './ProfilC';
import HomePage from '../homePage/HomePage';

const Avtentikacija = () => {
	const location = useLocation();
	const { jeAvtenticiran } = useContext(UporabniskiKontekst);
	const [loggingMode, setLoggingMode] = useState(null);
	try {
		useMemo(() => {
			setLoggingMode(location.state.loggingMode);
		}, [location.state.loggingMode]);

		return (
			<div className='authPage'>
				{jeAvtenticiran ? (
					<Profil />
				) : loggingMode === 'signin' ? (
					<Prijava />
				) : loggingMode === 'signup' ? (
					<Registracija />
				) : (
					<HomePage />
				)}
			</div>
		);
	} catch (error) {
		console.log(error);
		return <Error />;
	}
};

export default Avtentikacija;
