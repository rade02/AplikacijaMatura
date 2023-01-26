import { useLocation } from 'react-router-dom';
import NotificationCard from '../authPage/NotificationCardComponent';

const HomePage = () => {
	const location = useLocation();
	if (location.state !== null) return <div>{location.state.msg}</div>;
	return (
		<div>
			<p>To je domača stran</p>
		</div>
	);
};

export default HomePage;
