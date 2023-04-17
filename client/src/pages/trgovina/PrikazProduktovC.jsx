import Produkt from './ProduktC';
import KroznoNalaganje from '@mui/material/CircularProgress';
import Skatla from '@mui/material/Box';

const PrikazProduktov = ({
	setFokus1,
	props,
	stVsehProduktov,
	filtriraj,
	filtri,
	kategorijeF,
	nalaganjeSlikeIzdelka,
	setNalaganjeSlikeIzdelka,
}) => {
	if (props.napaka) {
		return <div>Prišlo je do napake pri nalaganju izdelkov ({JSON.stringify(props.napaka)})</div>;
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
								key={produkt.ID_izdelka}
								setVidno={props.setVidno}
								setPrikazi={props.setPrikazi}
								taProdukt={produkt} // podatki o posameznem produktu
								setIzbranProdukt={props.setIzbranProdukt}
								setIzKosarice={props.setIzKosarice}
								nalaganjeSlikeIzdelka={nalaganjeSlikeIzdelka}
								setNalaganjeSlikeIzdelka={setNalaganjeSlikeIzdelka}
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
