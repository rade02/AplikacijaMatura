import Product from './ProductComponent';

const ProductsPanel = ({ props }) => {
	if (props.error) {
		<div>Prišlo je do napake pri nalaganju izdelkov ({JSON.stringify(props.error)})</div>;
	} else if (props.noProducts) {
		return <h2>Nalagamo izdelke... ?? Animacija ??</h2>;
	} else {
		return (
			<div className='products'>
				<div className='productPanel'>
					{props.displayedProducts.map((displayedProduct) => {
						return (
							<Product
								key={displayedProduct.ID_izdelka}
								displayedProduct={displayedProduct} // podatki o posameznem produktu
								selectedProduct={props.selectedProduct}
								setSelectedProduct={props.setSelectedProduct}
							/>
						);
					})}
				</div>
				<div className='moreProducts'>
					<label>Prikazanih {props.displayedProducts.length} izdelkov </label>
					<button
						onClick={(e) => {
							e.preventDefault();
							props.fetchProducts();
						}}>
						Prikaži več
					</button>
				</div>
			</div>
		);
	}
};
export default ProductsPanel;
