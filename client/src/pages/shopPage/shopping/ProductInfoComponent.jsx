import { ShoppingCart, CaretCircleLeft } from 'phosphor-react';
import { useContext, useMemo, useState } from 'react';
import { ShopContext } from '../../../contexts/ShopContext';
import AddToCartButton from './AddToCartButtonComponent';

const ProductInfo = ({ prikazi, setPrikazi, izbranProdukt, setIzbranProdukt }) => {
	const { cart, setCart, state } = useContext(ShopContext);

	return (
		<div className='productsMenu'>
			<div className='productDiv'>
				<div className='productField'>
					<div className='productTitle'>
						<h2>
							{`[#${izbranProdukt.ID_izdelka}] `}
							{izbranProdukt.ime}
						</h2>
					</div>
					<div>
						<div className='productImage'>
							<img src='' alt='ni slike'></img>
						</div>
						<div className='productDescription'>
							<div className='category'>{izbranProdukt.kategorija}</div>
							<br></br>
							<div className='productInfos'>{izbranProdukt.informacije}</div>
							<br></br>
							<div>
								{izbranProdukt.kosov_na_voljo === 0 ? (
									<div className='lowQuantity'>Razprodano</div>
								) : izbranProdukt.kosov_na_voljo < 4 ? (
									<div className='lowQuantity'>
										Na voljo le še {izbranProdukt.kosov_na_voljo}{' '}
										{izbranProdukt.kosov_na_voljo === 1
											? 'izdelek'
											: izbranProdukt.kosov_na_voljo === 2
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
									izbranProdukt.popust === 0 ? 'productInformations' : 'productPriceStrikethrough'
								}>
								{izbranProdukt.cena_za_kos.toFixed(2)} €
							</div>
							{izbranProdukt.popust === 0 ? (
								<></>
							) : (
								<div className='discount2'>{izbranProdukt.popust} % popust</div>
							)}
							{izbranProdukt.popust > 0 ? (
								<div className='productInformations'>
									{(izbranProdukt.cena_za_kos * (1 - izbranProdukt.popust / 100.0)).toFixed(2)} €
								</div>
							) : (
								<></>
							)}
							<br></br>
							<div className='productButtonsDiv'>
								{cart.find((element) => element.ID_izdelka === izbranProdukt.ID_izdelka) ===
								undefined ? (
									<button
										onClick={(e) => {
											e.preventDefault();
											izbranProdukt.kolicina++;
											setCart([...cart, izbranProdukt]);
										}}>
										Dodaj v košarico
									</button>
								) : (
									<>Dodano v košarico</>
								)}
								<button
									className='backButton'
									onClick={(e) => {
										e.preventDefault();
										if (state.fromCart) setPrikazi('kosarica');
										else setPrikazi('nakupovanje');
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
