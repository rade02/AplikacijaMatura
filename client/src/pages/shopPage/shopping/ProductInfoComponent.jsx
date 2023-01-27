import { ShoppingCart, CaretCircleLeft } from 'phosphor-react';
import { useContext } from 'react';
import { ShopContext } from '../../../contexts/ShopContext';
import AddToCartButton from './AddToCartButtonComponent';

const ProductInfo = ({ selectedProduct, setSelectedProduct }) => {
	const { cart, setCart, state, setState } = useContext(ShopContext);
	console.log(selectedProduct.popust);
	return (
		<div className='productsMenu'>
			<div className='productDiv'>
				<div className='productField'>
					<div className='productTitle'>
						<h2>
							{`[#${selectedProduct.ID_izdelka}] `}
							{selectedProduct.ime}
						</h2>
					</div>
					<div>
						<div className='productImage'>
							<img src='' alt='ni slike'></img>
						</div>
						<div className='productDescription'>
							<div className='category'>{selectedProduct.kategorija}</div>
							<br></br>
							<div className='productInfos'>{selectedProduct.informacije}</div>
							<br></br>
							<div>
								{selectedProduct.kosov_na_voljo === 0 ? (
									<div className='lowQuantity'>Razprodano</div>
								) : selectedProduct.kosov_na_voljo < 4 ? (
									<div className='lowQuantity'>
										Na voljo le še {selectedProduct.kosov_na_voljo}{' '}
										{selectedProduct.kosov_na_voljo === 1
											? 'izdelek'
											: selectedProduct.kosov_na_voljo === 2
											? 'izdelka'
											: 'izdelki'}
										!
									</div>
								) : (
									<div className='OKQuantity'>Na voljo še več kot 3 izdelki.</div>
								)}
							</div>
							<br></br>
							<div
								className={
									selectedProduct.popust === 0 ? 'productInformations' : 'productPriceStrikethrough'
								}>
								{selectedProduct.cena_za_kos.toFixed(2)} €
							</div>
							{selectedProduct.popust === 0 ? (
								<></>
							) : (
								<div className='discount2'>{selectedProduct.popust} % popust</div>
							)}
							{selectedProduct.popust > 0 ? (
								<div className='productInformations'>
									{(selectedProduct.cena_za_kos * (1 - selectedProduct.popust / 100.0)).toFixed(2)} €
								</div>
							) : (
								<></>
							)}
							<br></br>
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
												setCart([...cart, ID_izdelka]);
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
