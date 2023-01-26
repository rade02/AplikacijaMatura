import './AuthPage.css';
import AuthWindow from './AuthWindowComponent';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const AuthPage = () => {
	const location = useLocation();

	const [loggingMode, setLoggingMode] = useState(null);

	useMemo(() => {
		setLoggingMode(location.state.loggingMode);
	}, [location.state.loggingMode]);

	return (
		<div className='authPage'>
			<AuthWindow
				props={{
					loggingMode: loggingMode,
					setLoggingMode: setLoggingMode,
				}}
			/>
		</div>
	);
};

export default AuthPage;
