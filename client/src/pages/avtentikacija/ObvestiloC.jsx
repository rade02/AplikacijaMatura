import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Obvestilo = () => {
	const location = useLocation();
	const [obvestilo, setObvestilo] = useState('');

	useEffect(() => {
		setObvestilo(location.state.msg);
		const casovnik = setTimeout(() => {
			setObvestilo('');
		}, 2500);
		return () => {
			setObvestilo(location.state.msg);
			clearTimeout(casovnik);
		};
	}, [location.state.msg]);

	return obvestilo === '' ? <></> : <div className='obvestilo'>Obvestilo: {obvestilo}</div>;
};

export default Obvestilo;
