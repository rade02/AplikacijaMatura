import axios from 'axios';
import Product from './ProductComponent';
import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../../contexts/ShopContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ProductsPanel = ({ props, stVsehProduktov, kategorijeF, cenaF, popustF }) => {
	const PORT = 3005; // !!!
	const [nalaganje, setNalaganje] = useState(false);

	useEffect(() => {
		if (props.niProduktov) {
			setNalaganje(true);
		} else {
			setNalaganje(false);
		}
	}, [props.niProduktov]);

	if (props.napaka) {
		<div>Prišlo je do napake pri nalaganju izdelkov ({JSON.stringify(props.napaka)})</div>;
	} else if (props.niProduktov) {
		return (
			<div className='nalaganje'>
				<h2>Nalaganje izdelkov</h2>
				<Box sx={{ display: 'flex' }}>
					<CircularProgress color='inherit' />
				</Box>
			</div>
		);
	} else {
		return (
			<div className='products'>
				<div className='productPanel'>
					{props.prikazaniProdukti.map((produkt) => {
						return (
							<Product
								prikazi={props.prikazi}
								setPrikazi={props.setPrikazi}
								key={produkt.ID_izdelka}
								taProdukt={produkt} // podatki o posameznem produktu
								izbranProdukt={props.izbranProdukt}
								setIzbranProdukt={props.setIzbranProdukt}
							/>
						);
					})}
				</div>
				<div className='moreProducts'>
					<label>
						Prikazanih {props.prikazaniProdukti.length} od {stVsehProduktov} izdelkov{' '}
					</label>
					{props.prikazaniProdukti.length >= stVsehProduktov ? (
						<></>
					) : (
						<button
							onClick={(e) => {
								e.preventDefault();
								props.pridobiProdukte();
							}}>
							Prikaži več
						</button>
					)}
				</div>
			</div>
		);
	}
};
export default ProductsPanel;
