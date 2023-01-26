import { useContext, useState } from 'react';
import ProductsPanel from './shopping/ProductsPanelComponent';
import ProductInfo from './shopping/ProductInfoComponent';
import { ShopContext } from '../../contexts/ShopContext';

const Shopping = ({ props }) => {
	return (
		<div className='shoppingPanel'>
			<div className='filters'>Filtri</div>
			<ProductsPanel props={props} />
		</div>
	);
};

export default Shopping;
