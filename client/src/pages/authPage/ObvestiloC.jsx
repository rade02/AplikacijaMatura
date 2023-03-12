import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Obvestilo = () => {
	const location = useLocation();
	const [message, setMessage] = useState('');

	useEffect(() => {
		setMessage(location.state.msg);
		const timer = setTimeout(() => {
			setMessage('');
		}, 2500);
		return () => {
			setMessage(location.state.msg);
			clearTimeout(timer);
		};
	}, [location.state.msg]);

	return message === '' ? <></> : <div className='notificationCard'>Obvestilo: {message}</div>;
};

export default Obvestilo;
