import { useLocation } from 'react-router-dom';
import NotificationCard from '../authPage/NotificationCardComponent';
import FileUpload from '../FileUpload';

const HomePage = () => {
	const location = useLocation();
	if (location.state !== null) return <div>{location.state.msg}</div>;
	return (
		<div>
			<p>To je domača stran</p>
			<FileUpload />
		</div>
	);
};

export default HomePage;
