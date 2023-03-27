import './Avtentikacija.css';
import Error from '../Error';
import { useContext } from 'react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';
import { useLocation } from 'react-router-dom';
import Registracija from './RegistracijaC';
import Prijava from './PrijavaC';
import Profil from './ProfilC';

const Avtentikacija = () => {
	const lokacija = useLocation();
	const { jeAvtenticiran } = useContext(UporabniskiKontekst);

	return (
		<div className='authPage'>
			{jeAvtenticiran ? (
				<Profil />
			) : lokacija.state.prikazAvtentikacija === 'prijava' ? (
				<Prijava />
			) : lokacija.state.prikazAvtentikacija === 'registracija' ? (
				<Registracija />
			) : (
				<Error />
			)}
		</div>
	);
};

export default Avtentikacija;
