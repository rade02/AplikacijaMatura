import Produkt from './ProduktC';
import KroznoNalaganje from '@mui/material/CircularProgress';
import Skatla from '@mui/material/Box';

const PrikazProduktov = ({ props, stVsehProduktov, filtriraj, kategorijeF, cenaF, popustF }) => {
	if (props.napaka) {
		<div>Prišlo je do napake pri nalaganju izdelkov ({JSON.stringify(props.napaka)})</div>;
	} else if (props.niProduktov) {
		return (
			<div className='nalaganje'>
				<h2>Nalaganje izdelkov</h2>
				<Skatla sx={{ display: 'flex' }}>
					<KroznoNalaganje color='inherit' />
				</Skatla>
			</div>
		);
	} else {
		return (
			<div className='produkti'>
				<div className='prostorZaProdukte'>
					{props.prikazaniProdukti.map((produkt) => {
						return (
							<Produkt
								setVidno={props.setVidno}
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
				<div className='vecProduktov'>
					<label>
						Prikazanih {props.prikazaniProdukti.length} od {stVsehProduktov} izdelkov{' '}
					</label>
					{props.prikazaniProdukti.length >= stVsehProduktov ? (
						<></>
					) : (
						<button
							className='prikaziVec'
							onClick={(e) => {
								e.preventDefault();
								filtriraj(true);
							}}>
							Prikaži več
						</button>
					)}
				</div>
			</div>
		);
	}
};
export default PrikazProduktov;
