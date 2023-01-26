import logo from '../../assets/Logo.png';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
	const navigate = useNavigate();

	return (
		<div
			className='logoDiv'
			onClick={() => {
				navigate('/about');
			}}>
			<img src={logo} alt='logo'></img>
			<label>Podjetje d.o.o.</label>
		</div>
	);
};

export default Logo;
