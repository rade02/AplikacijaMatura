import { ShoppingCart, CaretCircleLeft } from 'phosphor-react';
import { useContext } from 'react';
import { ShopContext } from '../../../contexts/ShopContext';
import AddToCartButton from './AddToCartButtonComponent';

const ProductInfo = ({ selectedProduct, setSelectedProduct }) => {
	// TODO: mogoča povečava slike
	// TODO: add to cart
	const { cart, setCart, state, setState } = useContext(ShopContext);
	console.log('state');
	console.log(state);
	return (
		<div className='productsMenu'>
			<div className='productDiv'>
				<div className='productField'>
					<div className='productTitle'>
						<h2>
							{`[#${state.props.selectedProduct.ID_izdelka}] `}
							{state.props.selectedProduct.ime}
						</h2>
					</div>
					<div>
						<div className='productImage'>
							<img src='' alt='ni slike'></img>
						</div>
						<div className='productDescription'>
							<div className='category'>{state.props.selectedProduct.kategorija}</div>
							<br></br>
							<div className='productInfos'>{state.props.selectedProduct.informacije}</div>
							<br></br>
							<div>
								{state.props.selectedProduct.kosov_na_voljo === 0 ? (
									<div className='lowQuantity'>Razprodano</div>
								) : state.props.selectedProduct.kosov_na_voljo < 4 ? (
									<div className='lowQuantity'>
										Na voljo le še {state.props.selectedProduct.kosov_na_voljo}{' '}
										{state.props.selectedProduct.kosov_na_voljo === 1
											? 'izdelek'
											: state.props.selectedProduct.kosov_na_voljo === 2
											? 'izdelka'
											: 'izdelki'}
										!
									</div>
								) : (
									<div className='OKQuantity'>Na voljo še več kot 3 izdelki.</div>
								)}
							</div>
							<br></br>
							<div>{state.props.selectedProduct.cena_za_kos} € (UPOŠTEVAMO POPUST)</div>
							<br></br>
							{state.props.selectedProduct.popust === 0 ? (
								<></>
							) : (
								<div>{state.props.selectedProduct.popust} % popust</div>
							)}
							<br></br>From cart: {state.fromCart.toString()}
							<div className='productButtonsDiv'>
								<AddToCartButton
									props={{
										displayedProduct: state.props,
										selectedProduct: selectedProduct,
										setSelectedProduct: setSelectedProduct,
									}}
								/>
								<button
									className='backButton'
									onClick={(e) => {
										e.preventDefault();
										if (state.fromCart) setState({ ...state, active: 'cart' });
										else setState({ ...state, active: 'shopping' });
									}}>
									<CaretCircleLeft size={25} />
									<div>Nazaj</div>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

/*
<div className='productButtonsDiv'>
										<button
											className='addToCart'
											onClick={(e) => {
												e.preventDefault();
												setCart([...cart, state.props.ID_izdelka]);
											}}>
											<div>Dodaj v</div>
											<div>
												<ShoppingCart size={25} />
											</div>
										</button>
										v
									</div>

				
<div className='productButtonsDiv'>
										<button
											className='addToCart'
											onClick={(e) => {
												e.preventDefault();
												setCart([...cart, props.productInfos.ID_izdelka]);
											}}>
											<div>Dodaj v</div>
											<div>
												<ShoppingCart size={25} />
											</div>
										</button>
										<button
											className='backButton'
											onClick={(e) => {
												e.preventDefault();
												props.setShow('allProducts');
											}}>
											<CaretCircleLeft size={25} />
											<div>Nazaj</div>
										</button>
									</div>
*/

/*
Product info
			<div>
				{Object.keys(props).map((key) => {
					return <p key={key}>{props[key]}</p>;
				})}
			</div>
*/
// { (location.state.discount > 0) ? location.state.price * (1 - (location.state.discount / 100.0)) : {location.state.price} €}

export default ProductInfo;
