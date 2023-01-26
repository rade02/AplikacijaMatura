import '../../App.css';
import Shop from './shop/Shop';
import Info from './About';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import BuyerAndCart from './shop/components/BuyerAndCart';
import Clock from '../../OLD_components/Clock';
import Calendar from '../../OLD_components/Calendar';

const Home = (props) => {
	let navigate = useNavigate();

	const { username } = useContext(UserContext);

	return (
		<div>
			<BuyerAndCart props={{ label: 3, user: username }} />
			<div className='homeExtended'>
				<div className='additional'>
					Where can I get some? There are many variations of passages of Lorem Ipsum available, but the
					majority have suffered alteration in some form, by injected humour, or randomised words which
					don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need
					to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum
					generators on the Internet tend to repeat predefined chunks as necessary, making this the first
					true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a
					handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The
					generated Lorem Ipsum is therefore always free from repetition, injected humour, or
					non-characteristic words etc.
				</div>
				<div className='home'>
					<h1>Podjetje d.o.o.</h1>
					<p>
						Pozdravljeni na strani Podjetja d.o.o. Za dodatne funkcionalnosti se vpišite ali
						registrirajte.
					</p>
					<label>Vpis:</label>
					<button
						onClick={() => {
							navigate('/auth/signin');
						}}>
						Prijava
					</button>
					<br></br>
					<label>Nov uporabnik? Registriraj se:</label>
					<button
						onClick={() => {
							navigate('/auth/signup');
						}}>
						Vpis
					</button>
				</div>
				<div className='additional'>
					<Clock isAnalog={true} />
					<Calendar />
				</div>
			</div>
		</div>
	);
};

export default Home;
