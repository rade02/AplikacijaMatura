import { ShoppingCart } from 'phosphor-react';
import { useContext, useState } from 'react';
import { ShopContext } from '../../contexts/ShopContext';
import { UserContext } from '../../contexts/UserContext';

const ShopNavbar = ({ visible, setVisible, prikazi, setPrikazi, cenaKosarice }) => {
	const { user } = useContext(UserContext);
	//&& prikazi === 'nakupovanje'

	return (
		<header className={visible === 0 ? 'shopNavbarTop' : visible === 1 ? 'invisibleNavbar' : 'shopNavbar'}>
			<div className='shopNavbarHeading'>
				{prikazi === 'nakupovanje' ? (
					<label>
						Pozdravljeni <i>{user.uporabnisko_ime}</i>, izberite naše izdelke po ugodni ceni
					</label>
				) : prikazi === 'kosarica' ? (
					<label>Košarica uporabnika: {user.uporabnisko_ime}</label>
				) : prikazi === 'produkt' ? (
					<label>Izdelek</label>
				) : prikazi === 'blagajna' ? (
					<label>Podatki o nakupu</label>
				) : prikazi === 'vnosKartice' ? (
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
						setVisible(0);
						setPrikazi('kosarica');
					}}>
					<div>
						<ShoppingCart size={25} style={{ marginRight: '17px' }} />
					</div>
					<div className='cartbuttonText'>
						<div>{user.uporabnisko_ime}</div>
						<div>{cenaKosarice.toFixed(2)} €</div>
					</div>
				</button>
			</div>
		</header>
	);
};
/*
				<div>{username}</div>
				<div>({cartItems.length})</div>
				<div>{Math.abs(totalPrice).toFixed(2)} €</div>
*/

export default ShopNavbar;
