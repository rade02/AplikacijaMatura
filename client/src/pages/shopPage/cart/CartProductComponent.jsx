import { useContext } from 'react';
import { NakupovalniKontekst } from '../../../contexts/NakupovalniKontekst';

const CartProduct = ({ props, refresh, setRefresh }) => {
	const { kosarica } = useContext(NakupovalniKontekst);
	// TODO: SPREMENI, DA BO NAMESTO += 0.5 : += 1
	//console.log(props.product);
	return (
		<div className='cartProduct'>
			<div className='productPicture'>
				<img
					src={props.product.slika}
					className='majhnaSlika'
					alt={`ni slike ${props.product.slika !== null ? 'Nalaganje...' : ''}`}
				/>
			</div>

			<div className='productLaneInfo'>
				<div
					className='productText'
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
				<div className='productLaneDetailInfo'>
					<div>
						{parseFloat(props.product.cena_za_kos * (1 - props.product.popust / 100.0)).toFixed(2)} €
					</div>

					<div>
						<button
							title='odstrani kos'
							onClick={(e) => {
								kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina--;

								props.setRemovedMsg(
									// nujno za rerendering cart componenta !!
									`Odstranjen izdelek: ${props.product.ime} ${
										props.product.kratek_opis !== null ? 'props.product.kratek_opis' : ''
									} `
								);
								Math.random().toFixed(3);
								props.preveriZalogoIzdelkov();
								setRefresh(!refresh);
							}}>
							-
						</button>{' '}
						kos: {props.product.kolicina}{' '}
						<button
							title='dodaj kos'
							disabled={
								kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina + 1 >
								kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kosov_na_voljo
									? 'disabled'
									: ''
							}
							onClick={(e) => {
								console.log('click');
								if (
									kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina + 1 <=
									kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kosov_na_voljo
								) {
									kosarica.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina++;
									props.setRemovedMsg(
										`Dodan izdelek: ${props.product.ime} ${
											props.product.kratek_opis !== null ? 'props.product.kratek_opis' : ''
										} `
									);
								} else {
									props.setRemovedMsg(
										`Izdelka: ${props.product.ime} ${
											props.product.kratek_opis !== null ? 'props.product.kratek_opis' : ''
										} ni več na zalogi `
									);
								}
								Math.random().toFixed(3);
								setRefresh(!refresh);

								//console.log(props.product);
							}}>
							+
						</button>
					</div>
					<div>
						<button
							title='preglej izdelek'
							onClick={(e) => {
								e.preventDefault();
								//console.log(props.product);
								props.setIzbranProdukt(props.product);
								props.setIzKosarice(true);
								/*setState({
									props: {
										...props.product,
										productInfos: props.productInfos,
										setProductInfos: props.setProductInfos,
									},
									fromCart: true,
								});*/
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

export default CartProduct;
