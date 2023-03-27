import { ShoppingCart } from 'phosphor-react';
import { useContext } from 'react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';

const NavigacijaTrgovine = ({ vidno, setVidno, prikazi, setPrikazi, cenaKosarice }) => {
	const { uporabnik } = useContext(UporabniskiKontekst);

	return (
		<div
			className={
				vidno === 0
					? 'navigacijaZgoraj'
					: vidno === 1
					? 'navigacijaTrgovineNevidna'
					: 'navigacijaTrgovineSpodaj'
			}>
			<div className='vsebinaNavigacije'>
				<div className='navigacijaBesedilo'>
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
				<div className='navigacijaKosarica'>
					<button
						className='gumbZaKosarico'
						onClick={(e) => {
							e.preventDefault();
							setVidno(0);
							setPrikazi('kosarica');
						}}>
						<div>
							<ShoppingCart size={25} style={{ marginRight: '17px' }} />
						</div>
						<div className='besediloZaKosarico'>
							<div>{uporabnik.uporabnisko_ime}</div>
							<div>{cenaKosarice.toFixed(2)} €</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
};

export default NavigacijaTrgovine;
