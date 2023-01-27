import './ShopPage.scss';
import { useState } from 'react';
import { ShopContextProvider } from '../../contexts/ShopContext';
import ShopContent from './ShopContentComponent';
import ShopNavbar from './ShopNavbarComponent';

const ShopPage = () => {
	return (
		<ShopContextProvider>
			<div className='shop'>
				<ShopNavbar />
				<ShopContent />
			</div>
		</ShopContextProvider>
	);
};

export default ShopPage;
