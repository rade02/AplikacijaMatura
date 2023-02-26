import axios from 'axios';
import { ShoppingCart } from 'phosphor-react';
import { useContext, useState, useRef, useMemo, useEffect } from 'react';
import { ShopContext } from '../../../contexts/ShopContext';

const AddToCartButton = ({ props, setShowNotif }) => {
	const { cart, setCart, state, setState } = useContext(ShopContext);
	const [appearance, setAppearance] = useState('addToCart');

	if (props.produkt === null) {
		return <div>Props.produkt is null</div>;
	}
	return (
		<>
			{props.produkt.kolicina}
			<button
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					props.produkt.kolicina++;
					props.setProdukt({ ...props.produkt, kolicina: props.produkt.kolicina });
				}}></button>
		</>
	);

	/*
	useEffect(() => {
		if (props.selectedProduct.kolicina <= 0) {
			setAppearance('addToCart');
		} else if (props.selectedProduct.kolicina >= props.selectedProduct.kosov_na_voljo) {
			setAppearance('noMoreAvailable');
		} else {
			setAppearance('incrementToCart');
		}
	}, [props.selectedProduct.kolicina, props.selectedProduct.kosov_na_voljo]);

	return (
		<div className='productAction'>
			<div
				className={appearance}
				disabled={
					appearance === 'noMoreAvailable' ||
					props.selectedProduct.kolicina >= props.selectedProduct.kosov_na_voljo
						? 'disabled'
						: null
				}
				onClick={(e) => {
					e.preventDefault();

					if (appearance !== 'noMoreAvailable') {
						e.stopPropagation();

						console.log('props.selectedProductkolicina');
						console.log(props.selectedProduct.kolicina);

						if (props.selectedProduct.kolicina > 0) {
							console.log('props.selectedProduct.kolicina > 0');
							// increment product kolicina in cart
							cart.forEach((product) => {
								if (product.ID_izdelka === props.selectedProduct.ID_izdelka) {
									product.kolicina = product.kolicina + 1;
								}
							});
							//console.log(state.fromCart);
							if (state.fromCart) {
								props.setSelectedProduct({
									...props.selectedProduct,
									kolicina: props.selectedProduct.kolicina++,
								});
							} else {
								props.setSelectedProduct({
									...props.selectedProduct,
									kolicina: props.selectedProduct.kolicina + 1,
								});
							}
							setState({
								...state,
								[state.props.kolicina]: state.props.kolicina++,
							});
						} else {
							console.log('props.selectedProduct.kolicina <= 0');
							// add product to cart
							console.log(cart);
							props.setSelectedProduct({
								...props.selectedProduct,
								kolicina: props.selectedProduct.kolicina++,
							});
							setCart([...cart, props.selectededProduct]);
						}
					}
				}}>
				{appearance !== 'noMoreAvailable' ? (
					<div>
						Dodaj v <ShoppingCart size={22} style={{ marginLeft: '5px' }} />
					</div>
				) : (
					<div>Več izdelkov ni na voljo</div>
				)}
				{appearance === 'addToCart' ? (
					<></>
				) : (
					<div className='quantityInCart'>(količina: {props.selectedProduct.kolicina})</div>
				)}
			</div>
		</div>
	);*/
	/*
	{appearance === 'noMoreAvailable' ? (
					<button
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}>
						Odstrani
					</button>
				) : (
					<></>
				)}
	 */
};

export default AddToCartButton;
