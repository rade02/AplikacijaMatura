import { useContext } from 'react';
import { ShopContext } from '../../../contexts/ShopContext';

const CartProduct = ({ props, refresh, setRefresh }) => {
	const { cart, setCart, setState } = useContext(ShopContext);
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
					<div>{parseFloat(props.product.cena_za_kos).toFixed(2)} €</div>

					<div>
						<button
							title='odstrani kos'
							onClick={(e) => {
								e.preventDefault();

								cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina--;

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
								cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina + 1 >
								cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kosov_na_voljo
									? 'disabled'
									: ''
							}
							onClick={(e) => {
								e.preventDefault();
								console.log('click');
								if (
									cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina + 1 <=
									cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kosov_na_voljo
								) {
									cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina++;
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
