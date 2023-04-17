import axios from 'axios';
import { CaretCircleLeft, PaperPlaneRight } from 'phosphor-react';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';
import { useContext, useEffect } from 'react';
import IzdelekVKosarici from './IzdelekVKosariciC';

const Kosarica = ({
	setPrikazi,
	izbranProdukt,
	setIzbranProdukt,
	izKosarice,
	setIzKosarice,
	setCenaKosarice,
	prikazaniProdukti,
	setPrikazaniProdukti,
	sporociloOdstranjevanje,
	setSporociloOdstranjevanje,
	setNiProduktov,
}) => {
	const { kosarica, setKosarica } = useContext(NakupovalniKontekst);

	useEffect(() => {
		setIzbranProdukt(null);
		preveriZalogoIzdelkov();
		setSporociloOdstranjevanje('');
	}, []);

	const preveriZalogoIzdelkov = async () => {
		let vsota = 0;

		const preveriCeJeNaVoljo = async (produkt) => {
			try {
				let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/naVoljo`, {
					params: {
						ID_izdelka: produkt.ID_izdelka,
					},
				});
				// za odstranjevanje z "-" in preverjanje ce je produkt ze nekdo kupil in ga ni več
				if (produkt.kolicina <= 0) {
					setSporociloOdstranjevanje('Izdelek ' + produkt.ime + ' je bil odstranjen.');
					return false;
				}
				if (odziv.data[0].kosov_na_voljo <= 0) {
					setSporociloOdstranjevanje(
						'Izdelek ' + produkt.ime + ' je bil odstranjen, ker ga nimamo več na zalogi.'
					);
					return false;
				} else {
					return true;
				}
			} catch (napaka) {
				console.log(napaka);
			}
		};
		for (let produkt of kosarica) {
			vsota +=
				produkt.cena_za_kos *
				produkt.kolicina *
				-produkt.cena_za_kos *
				produkt.kolicina *
				(produkt.popust / 100.0);

			if (!(await preveriCeJeNaVoljo(produkt))) {
				setKosarica(kosarica.filter((p) => p.ID_izdelka !== produkt.ID_izdelka));
				setPrikazaniProdukti(prikazaniProdukti.filter((p) => p.ID_izdelka !== produkt.ID_izdelka));
			}
			setCenaKosarice(vsota);
		}
	};

	return (
		<div className='kosarica'>
			<div className='vsebinaKosarice'>
				{kosarica.length > 0 ? (
					kosarica.map((produkt) => {
						return (
							<IzdelekVKosarici
								key={produkt.ID_izdelka}
								props={{
									setCenaKosarice: setCenaKosarice,
									preveriZalogoIzdelkov: preveriZalogoIzdelkov,
									izKosarice: izKosarice,
									setIzKosarice: setIzKosarice,
									izbranProdukt: izbranProdukt,
									setIzbranProdukt: setIzbranProdukt,
									setPrikazi: setPrikazi,
									produkt: produkt,
									setSporociloOdstranjevanje: setSporociloOdstranjevanje,
								}}
							/>
						);
					})
				) : (
					<div>Košarica je prazna</div>
				)}
			</div>
			<div>
				<div className='nazajNaprej'>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setKosarica([...kosarica]);
							setPrikazi('nakupovanje');
							//setNiProduktov(true);
							setIzKosarice(false);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
					<button
						className={kosarica.length <= 0 ? 'onemogocenGumb' : 'gumbNaprej'}
						disabled={kosarica.length <= 0 ? 'disabled' : ''}
						onClick={(e) => {
							e.preventDefault();
							preveriZalogoIzdelkov();
							if (kosarica.length > 0) {
								setKosarica([...kosarica]);
								setPrikazi('blagajna');
								setSporociloOdstranjevanje('');
							} else {
								setSporociloOdstranjevanje('Vaša košarica je prazna.');
							}
						}}>
						<div>Na plačilo</div>
						<PaperPlaneRight size={22} style={{ marginLeft: '5px' }} />
					</button>
				</div>
				<div>{sporociloOdstranjevanje === '' ? '' : sporociloOdstranjevanje}</div>
			</div>
		</div>
	);
};

export default Kosarica;
