import './Trgovina.css';
import { useEffect, useState, useRef } from 'react';
import { NakupovalniKontekstProvider } from '../../contexts/NakupovalniKontekst';
import ShopContent from './VsebinaTrgovineC';
import ShopNavbar from './NavigacijaTrgovineC';

const ShopPage = () => {
	const [position, setPosition] = useState(window.pageYOffset);
	const [visible, setVisible] = useState(0); // 0 - top, 1 - invisible, 2 - visible
	const [prikazi, setPrikazi] = useState('nakupovanje');
	const [cenaKosarice, setCenaKosarice] = useState(0);
	const zgoraj = useRef('zgoraj');

	useEffect(() => {
		if (prikazi === 'nakupovanje') {
			const handleScroll = () => {
				let moving = window.pageYOffset; // koliko dol smo zdaj
				if (position < 250) {
					setVisible(0);
				} else {
					//console.log('position & moving');
					//console.log(position);
					//console.log(moving);
					setVisible(position > moving + 2 ? 1 : 2);
				}
				setPosition(moving);
			};
			window.addEventListener('scroll', handleScroll);
			return () => {
				window.removeEventListener('scroll', handleScroll);
			};
		}
	});

	return (
		<NakupovalniKontekstProvider>
			<div className='shop' ref={zgoraj}>
				<ShopNavbar
					visible={visible}
					setVisible={setVisible}
					prikazi={prikazi}
					setPrikazi={setPrikazi}
					cenaKosarice={cenaKosarice}
				/>
				<ShopContent
					prikazi={prikazi}
					setPrikazi={setPrikazi}
					cenaKosarice={cenaKosarice}
					setCenaKosarice={setCenaKosarice}
				/>
				{prikazi === 'nakupovanje' ? (
					<div
						className='naVrh'
						onClick={(e) => {
							zgoraj.current.scrollIntoView({ behaviour: 'smooth' });
							setVisible(2);
						}}
					/>
				) : (
					<></>
				)}
			</div>
		</NakupovalniKontekstProvider>
	);
};

export default ShopPage;
