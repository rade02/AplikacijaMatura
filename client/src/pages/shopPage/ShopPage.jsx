import './ShopPage.css';
import { useEffect, useState, useContext, useRef } from 'react';
import { ShopContextProvider } from '../../contexts/ShopContext';
import ShopContent from './ShopContentComponent';
import ShopNavbar from './ShopNavbarComponent';
import { ShopContext } from '../../contexts/ShopContext';

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
		<ShopContextProvider>
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
		</ShopContextProvider>
	);
};

export default ShopPage;
