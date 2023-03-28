import Produkt from './ProduktC';
import KroznoNalaganje from '@mui/material/CircularProgress';
import Skatla from '@mui/material/Box';

const PrikazProduktov = ({
	setFokus1,
	props,
	stVsehProduktov,
	filtriraj,
	setIzKosarice,
	filtri,
	kategorijeF,
	setKategorijeF,
	cenaF,
	popustF,
}) => {
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
			<div
				className='produkti'
				onClick={(e) => {
					setFokus1(false);
				}}>
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
								setIzKosarice={setIzKosarice}
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
								filtri.current.reset();
								kategorijeF = [];
								cenaF = { od: undefined, do: undefined };
								popustF = 0;
								filtriraj(true, kategorijeF);
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
