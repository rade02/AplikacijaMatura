import { ShoppingCart } from 'phosphor-react';
import { useContext } from 'react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const ShopNavbar = ({ visible, setVisible, prikazi, setPrikazi, cenaKosarice }) => {
	const { uporabnik } = useContext(UporabniskiKontekst);
	//&& prikazi === 'nakupovanje'

	return (
		<header className={visible === 0 ? 'shopNavbarTop' : visible === 1 ? 'invisibleNavbar' : 'shopNavbar'}>
			<div className='shopNavbarHeading'>
				{prikazi === 'nakupovanje' ? (
					<label>
						Pozdravljeni <i>{uporabnik.uporabnisko_ime}</i>, izberite naše izdelke po ugodni ceni
					</label>
				) : prikazi === 'kosarica' ? (
					<label>Košarica uporabnika: {uporabnik.uporabnisko_ime}</label>
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
						<div>{uporabnik.uporabnisko_ime}</div>
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
