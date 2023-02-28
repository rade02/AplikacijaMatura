import axios from 'axios';
import Product from './ProductComponent';
import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../../contexts/ShopContext';

const ProductsPanel = ({ props, stVsehProduktov, kategorijeF, cenaF, popustF }) => {
	const PORT = 3005; // !!!

	if (props.napaka) {
		<div>Prišlo je do napake pri nalaganju izdelkov ({JSON.stringify(props.napaka)})</div>;
	} else if (props.niProduktov) {
		return <h2>Nalagamo izdelke... ?? Animacija spinner ??</h2>;
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
