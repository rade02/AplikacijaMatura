import { useContext } from 'react';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';

const IzdelekVKosarici = ({ props }) => {
	const { kosarica } = useContext(NakupovalniKontekst);

	return (
		<div className='produktVKosarici'>
			<div className='slikaIzdelkaVKosarici'>
				<img
					src={props.product.slika}
					className='majhnaSlika'
					alt={`ni slike ${props.product.slika !== null ? 'Nalaganje...' : ''}`}
				/>
			</div>

			<div className='vrsticneInformacije'>
				<div
					className='produktBesedilo'
					onClick={(e) => {
						e.preventDefault();
						//setState({ props: props.product, active: 'product', fromCart: true });
						props.setIzbranProdukt(props.product);
						props.setIzKosarice(true);
						props.setPrikazi('produkt');
					}}>
					[{props.product.ID_izdelka}] {props.product.ime}{' '}
					{props.product.kratek_opis !== null ? ` ${props.product.kratek_opis}` : ''}
				</div>
				<div className='produktCenaInKosi'>
					<div>
						{parseFloat(props.product.cena_za_kos * (1 - props.product.popust / 100.0)).toFixed(2)} €
					</div>

					<div>
						<button
							className='plusMinusGumb'
							title='odstrani kos'
							onClick={(e) => {
								kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina--;

								props.setSporociloOdstranjevanje(
									// nujno za rerendering cart componenta !!
									`Odstranjen izdelek: ${props.product.ime} ${
										props.product.kratek_opis !== null ? 'props.product.kratek_opis' : ''
									} `
								);
								Math.random().toFixed(3);
								props.preveriZalogoIzdelkov();
							}}>
							-
						</button>{' '}
						kos: {props.product.kolicina}{' '}
						<button
							className='plusMinusGumb'
							title='dodaj kos'
							disabled={
								kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina + 1 >
								kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kosov_na_voljo
									? 'disabled'
									: ''
							}
							onClick={(e) => {
								if (
									kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina + 1 <=
									kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kosov_na_voljo
								) {
									kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina++;
									props.setSporociloOdstranjevanje(
										`Dodan izdelek: ${props.product.ime} ${
											props.product.kratek_opis !== null ? 'props.product.kratek_opis' : ''
										} `
									);
								} else {
									props.setSporociloOdstranjevanje(
										`Izdelka: ${props.product.ime} ${
											props.product.kratek_opis !== null ? 'props.product.kratek_opis' : ''
										} ni več na zalogi `
									);
								}
								Math.random().toFixed(3);
							}}>
							+
						</button>
					</div>
					<div>
						<button
							className='gumbNazaj'
							title='preglej izdelek'
							onClick={(e) => {
								e.preventDefault();
								props.setIzbranProdukt(props.product);
								props.setIzKosarice(true);
								props.setPrikazi('produkt');
							}}>
							Pregled izdelka
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default IzdelekVKosarici;
