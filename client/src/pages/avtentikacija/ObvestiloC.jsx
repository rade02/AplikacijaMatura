import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Obvestilo = ({ besedilo }) => {
	const location = useLocation();
	const [obvestilo, setObvestilo] = useState(besedilo);

	useEffect(() => {
		setObvestilo(location.state.sporocilo); // iz NavigacijskaVrsticaC
		const casovnik = setTimeout(() => {
			setObvestilo('');
		}, 2500);
		return () => {
			setObvestilo(location.state.sporocilo);
			clearTimeout(casovnik);
		};
	}, [location.state.sporocilo]);

	return obvestilo === '' ? <></> : <div className='obvestilo'>Obvestilo: {obvestilo}</div>;
};

export default Obvestilo;
