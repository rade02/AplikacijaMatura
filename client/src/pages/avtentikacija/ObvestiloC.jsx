import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Obvestilo = ({ besedilo }) => {
	const lokacija = useLocation();
	const [obvestilo, setObvestilo] = useState(besedilo);

	useEffect(() => {
		setObvestilo(lokacija.state.sporocilo); // iz NavigacijskaVrsticaC
		const casovnik = setTimeout(() => {
			setObvestilo('');
		}, 2500);
		return () => {
			setObvestilo(lokacija.state.sporocilo);
			clearTimeout(casovnik);
		};
	}, [lokacija.state.sporocilo]);

	return obvestilo === '' ? <></> : <div className='obvestilo'>Obvestilo: {obvestilo}</div>;
};

export default Obvestilo;
