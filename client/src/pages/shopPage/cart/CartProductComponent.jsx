import { useContext } from 'react';
import { ShopContext } from '../../../contexts/ShopContext';

const CartProduct = ({ props }) => {
	const { cart, setState } = useContext(ShopContext);
	// TODO: SPREMENI, DA BO NAMESTO += 0.5 : += 1
	return (
		<div className='cartProduct'>
			<div className='cartProductIndex'>#{(props.counter.current += 0.5)}</div>
			<img src='' alt='ni slike' className='smallImage'></img>
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
					[{props.product.ID_izdelka}] {props.product.ime} -- {props.product.kratek_opis}
				</div>
				<div className='productLaneDetailInfo'>
					<div>
						{parseFloat(
							props.product.cena_za_kos * props.product.kolicina -
								props.product.cena_za_kos * props.product.kolicina * (props.product.popust / 100.0)
						).toFixed(2)}{' '}
						€
					</div>

					<div>
						<button
							title='odstrani kos'
							onClick={(e) => {
								e.preventDefault();

								cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina--;

								props.setRemovedMsg(
									// nujno za rerendering cart componenta !!
									`Odstranjen izdelek: ${props.product.ime} -- ${props.product.kratek_opis} ` +
										Math.random().toFixed(3)
								);
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
								if (
									cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina + 1 <=
									cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kosov_na_voljo
								) {
									cart.filter((p) => p.ID_izdelka === props.product.ID_izdelka)[0].kolicina++;

									props.setRemovedMsg(
										`Dodan izdelek: ${props.product.ime} -- ${props.product.kratek_opis} ` +
											Math.random().toFixed(3)
									);
								} else {
									props.setRemovedMsg(
										`Izdelka: ${props.product.ime} -- ${props.product.kratek_opis} ni več na zalogi ` +
											Math.random().toFixed(3)
									);
								}
								console.log(props.product);
							}}>
							+
						</button>
					</div>
					<div>
						<button
							title='preglej izdelek'
							onClick={(e) => {
								e.preventDefault();
								console.log(props.product);
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
