import logo from '../assets/Logotip.png';
import { useNavigate } from 'react-router-dom';

const Logo = () => {
	const navigate = useNavigate();

	return (
		<div
			className='logoDiv'
			onClick={() => {
				navigate('/oNas');
			}}>
			<img src={logo} alt='logo'></img>
			<label>Podjetje d.o.o.</label>
		</div>
	);
};

export default Logo;
