import '../../App.css';
import { UserCircle } from 'phosphor-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';
import Logo from './LogoComponent';

const NavigacijskaVrstica = () => {
	const { uporabnik, jeAvtenticiran, setJeAvtenticiran } = useContext(UporabniskiKontekst);
	const sporocilo = {
		sporocilo1: 'Za ponovno prijavo se morate najprej odjaviti',
		sporocilo2: 'Za registracijo se morate najprej odjaviti',
	};

	return (
		<div className='navigacija1'>
			<div className='vrstica1'>
				<Logo />
				<div>
					<Link to='/' className='linki'>
						Domov
					</Link>
				</div>
				<div>
					<Link to='/trgovina' className='linki'>
						Trgovina
					</Link>
				</div>
				<div>
					<Link
						to='/avtentikacija'
						state={{
							prikazAvtentikacija: 'registracija',
							sporocilo: jeAvtenticiran ? sporocilo.sporocilo2 : '',
						}}
						className='linki'>
						Registracija
					</Link>
				</div>
				<div>
					<Link
						to='/avtentikacija'
						state={{
							prikazAvtentikacija: 'prijava',
							sporocilo: jeAvtenticiran ? sporocilo.sporocilo1 : '',
						}}
						className='linki'>
						{jeAvtenticiran ? (
							<>
								<UserCircle size={28} style={{ marginRight: '4px' }} />
								<label style={{ marginRight: '12px' }}>{uporabnik.uporabnisko_ime}</label>
								<label
									onClick={(e) => {
										e.preventDefault();
										e.stopPropagation();
										setJeAvtenticiran(false);
									}}
									style={{ textDecoration: 'underline' }}>
									Odjava
								</label>
							</>
						) : (
							'Prijava'
						)}
					</Link>
				</div>
			</div>
		</div>
	);
};

export default NavigacijskaVrstica;
