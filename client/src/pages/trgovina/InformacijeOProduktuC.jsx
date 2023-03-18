import { CaretCircleLeft } from 'phosphor-react';
import { useContext } from 'react';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';

const ProductInfo = ({ prikazi, setPrikazi, izbranProdukt, setIzbranProdukt, izKosarice, setIzKosarice }) => {
	const { kosarica, setKosarica } = useContext(NakupovalniKontekst);

	//console.log(izbranProdukt);

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
							{izbranProdukt.slika === null ? (
								<div className='productPicture'>slika ni na voljo</div>
							) : (
								<div className='productPicture'>
									<img
										src={izbranProdukt.slika}
										className='velikaSlika'
										alt={`ni slike ${izbranProdukt.slika !== null ? 'Nalaganje...' : ''}`}
									/>
								</div>
							)}
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
								<button
									className='backButton'
									onClick={(e) => {
										e.preventDefault();
										if (izKosarice) setPrikazi('kosarica');
										else setPrikazi('nakupovanje');
									}}>
									<CaretCircleLeft size={25} />
									<div>Nazaj</div>
								</button>
								{kosarica.find((element) => element.ID_izdelka === izbranProdukt.ID_izdelka) ===
								undefined ? (
									<button
										className='dodajVKosarico'
										style={{ marginTop: '0px' }}
										onClick={(e) => {
											e.preventDefault();
											izbranProdukt.kolicina++;
											setKosarica([...kosarica, izbranProdukt]);
										}}>
										Dodaj v košarico
									</button>
								) : (
									<div
										className='dodanoVKosarico'
										style={{ marginLeft: '40px', width: 'fit-content', minWidth: '165px' }}>
										Dodano v košarico
									</div>
								)}
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
