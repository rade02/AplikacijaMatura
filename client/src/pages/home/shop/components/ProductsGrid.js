import Product from './Product';

const ProductsGrid = ({ props }) => {
	//console.log(props.fetchedDataArray)

	return (
		<div className='productsGrid'>
			{props.fetchedDataArray.map((product) => {
				let rand = Math.random();
				return <Product key={product.id + ' - ' + product.ime + rand} data={product} />;
			})}
		</div>
	);
};

export default ProductsGrid;
