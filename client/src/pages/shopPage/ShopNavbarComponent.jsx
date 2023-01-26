import { ShoppingCart } from 'phosphor-react';
import { useContext, useState } from 'react';
import { ShopContext } from '../../contexts/ShopContext';
import { UserContext } from '../../contexts/UserContext';

const ShopNavbar = () => {
	const { state, setState } = useContext(ShopContext);
	const { user } = useContext(UserContext);

	return (
		<div className='shopNavbar'>
			<div className='shopNavbarHeading'>
				{state.active === 'shopping' ? (
					<label>
						Pozdravljeni <i>{user.uporabnisko_ime}</i>, izberite naše izdelke po ugodni ceni
					</label>
				) : state.active === 'cart' ? (
					<label>Košarica uporabnika: {user.uporabnisko_ime}</label>
				) : state.active === 'product' ? (
					<label>Izdelek</label>
				) : state.active === 'checkout' ? (
					<label>Podatki o nakupu</label>
				) : state.active === 'cardInput' ? (
					<label>Plačilo s kartico</label>
				) : (
					<label>Spletna trgovina podjetja d.o.o.</label>
				)}
			</div>
			<div className='shopNavbarCart'>
				<button
					className='cartButton'
					onClick={(e) => {
						e.preventDefault();
						setState({ ...state, active: 'cart' });
					}}>
					<ShoppingCart size={25} style={{ marginRight: '8px' }} />
					{user.uporabnisko_ime}
				</button>
			</div>
		</div>
	);
};
/*
				<div>{username}</div>
				<div>({cartItems.length})</div>
				<div>{Math.abs(totalPrice).toFixed(2)} €</div>
*/

export default ShopNavbar;
