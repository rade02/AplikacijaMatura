import '../../../App.css';
import { ShoppingBag, CreditCard, House } from 'phosphor-react';
import { useContext, useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserContext } from '../../../contexts/UserContext';
import { CartContext } from '../../../context/CartContext';
import BuyerAndCart from './components/BuyerAndCart';
import CartProduct from './components/CartProduct';

const Cart = () => {
	const navigate = useNavigate();
	const { username } = useContext(UserContext);
	const { cartItems, setCartItems, addToCart, totalPrice, setTotalPrice } = useContext(CartContext);

	/*useMemo(() => {
		//console.log('setting total');
		cartItems.forEach((product) => {
			setTotalPrice(product.cena_za_kos * product.quantityInCart);
		});
	}, [setTotalPrice, cartItems]);*/

	console.log(cartItems);
	return (
		<div className='productsMenu'>
			<div>
				<BuyerAndCart props={{ label: 1, user: username }} />
				<div className='cartProducts'>
					{cartItems.length === 0 ? (
						<h5>Košarica je prazna</h5>
					) : (
						cartItems.map((product, i) => {
							return <CartProduct props={{ index: i, id: product.ID_izdelka }} />;
						})
					)}
				</div>
				<div>
					<button
						onClick={(e) => {
							navigate(`/shop/${username}`, {});
						}}>
						Nazaj v trgovino
						<ShoppingBag size={25} />{' '}
					</button>
					<button
						onClick={(e) => {
							navigate(`/`, {});
						}}>
						Nazaj domov
						<House size={25} />{' '}
					</button>
					<div>{Math.abs(totalPrice).toFixed(2)} €</div>
					<div>
						<button
							onClick={(e) => {
								navigate(`/shop/cart/${username}/checkout`, {});
							}}>
							Na blagajno <CreditCard size={30} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
