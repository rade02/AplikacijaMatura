import './ShopPage.css';
import { useEffect, useState } from 'react';
import { ShopContextProvider } from '../../contexts/ShopContext';
import ShopContent from './ShopContentComponent';
import ShopNavbar from './ShopNavbarComponent';
import ReactDOM from 'react-dom';

const ShopPage = () => {
	const [position, setPosition] = useState(window.pageYOffset);
	const [visible, setVisible] = useState(0); // 0 - top, 1 - invisible, 2 - visible
	const [prikazi, setPrikazi] = useState('nakupovanje');

	/*useEffect(() => {
		const handleScroll = () => {
			let moving = window.pageYOffset; // koliko dol smo zdaj
			//console.log(position);
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
	});*/

	return (
		<ShopContextProvider>
			<div className='shop'>
				<ShopNavbar visible={visible} prikazi={prikazi} setPrikazi={setPrikazi} />
				<ShopContent prikazi={prikazi} setPrikazi={setPrikazi} />
			</div>
		</ShopContextProvider>
	);
};

export default ShopPage;
