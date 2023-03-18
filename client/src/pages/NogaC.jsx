import '../App.css';
import { FacebookLogo, InstagramLogo, TwitterLogo } from 'phosphor-react';

const Noga = () => {
	return (
		<div className='noga'>
			<div className='informacijeLevo'>
				<b>Podatki o podjetju</b>
				<br />
				<hr />
				Podjetje d.o.o., Ljubljana
				<br />
				Slovenska cesta 1<br />
				1000 Ljubljana
			</div>
			<div className='informacijeSredina'>
				<div>Sledite nam na družbenih omrežjih:</div>
				<div>
					<button
						onClick={(e) => {
							window.open('https://www.facebook.com', '_blank');
						}}>
						<FacebookLogo size={25} />
					</button>
				</div>
				<div>
					<button
						onClick={(e) => {
							window.open('https://www.instagram.com', '_blank');
						}}>
						<InstagramLogo size={25} />
					</button>
				</div>
				<div>
					<button
						onClick={(e) => {
							window.open('https://www.twitter.com', '_blank');
						}}>
						<TwitterLogo size={25} />
					</button>
				</div>
			</div>
			<div className='informacijeDesno'>
				<b>Kontakt</b>
				<br />
				<hr />
				<div>
					<div>Telefon:</div>
					<div className='telefonskeStevilke'>
						041 123 456
						<br />
						01 123 45 67
					</div>
				</div>
			</div>
		</div>
	);
};

export default Noga;
