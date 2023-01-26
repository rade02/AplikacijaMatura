import { Warning } from 'phosphor-react';
import { Link } from 'react-router-dom';

const ErrorPage = () => {
	return (
		<div className='errorDiv'>
			<div className='warning'>
				<Warning size={30} style={{ marginRight: '10px' }} />
				Napaka, stran ni bila najdena
			</div>
			<div>
				<Link to='/'>Domov</Link>
			</div>
		</div>
	);
};

export default ErrorPage;
