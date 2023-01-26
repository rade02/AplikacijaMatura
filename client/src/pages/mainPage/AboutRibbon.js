import '../../App.css';
import { FacebookLogo, InstagramLogo, TwitterLogo } from 'phosphor-react';

const AboutRibbon = () => {
	return (
		<div className='aboutRibbon'>
			<div className='leftInfoBox'>
				<b>Podatki o podjetju</b>
				<br />
				<hr />
				Podjetje d.o.o., Ljubljana
				<br />
				Slovenska cesta 1<br />
				1000 Ljubljana
			</div>
			<div className='centerInfoBox'>
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
			<div className='rightInfoBox'>
				<b>Kontakt</b>
				<br />
				<hr />
				<div>
					<div>Telefon:</div>
					<div className='phoneNums'>
						041 123 456
						<br />
						01 123 45 67
					</div>
				</div>
			</div>
		</div>
	);
};

export default AboutRibbon;
