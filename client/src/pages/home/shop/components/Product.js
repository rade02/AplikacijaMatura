import '../../../../App.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useMemo, useEffect } from 'react';
import { UserContext } from '../../../../contexts/UserContext';
import { CartContext } from '../../../../OLD_context/CartContext';
import { ShoppingCart, Plus } from 'phosphor-react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';

const Product = ({ data }) => {
	const { username } = useContext(UserContext);
	const { cartItems, addToCart, getItemQuantity } = useContext(CartContext);

	const [id, setId] = useState(data.ID_izdelka);
	const [name, setName] = useState(data.ime);
	const [quantity, setQuantity] = useState(data.kosov_na_voljo);
	const [price, setPrice] = useState(data.cena_za_kos);
	const [info, setInfo] = useState(data.informacije);
	const [quantityInCart, setQuantityInCart] = useState(data.quantityInCart);

	let linkTo = `/shop/product/${id}`;
	const navigate = useNavigate();

	let productData = {
		ID_izdelka: id,
		ime: name,
		kosov_na_voljo: quantity,
		cena_za_kos: price,
		informacije: info,
		quantityInCart: quantityInCart,
	};

	//console.log('productData (ne sme met qIC cudn');
	//console.log(productData);

	/*console.log(data);
	console.log('getItemQuantity(data)');
	console.log(getItemQuantity(data));*/

	return (
		<div className='productCard'>
			<div className='productPicture'>Slika produkta</div>
			<div className='productInfo'>
				<hr></hr>
				<Link to={linkTo} state={data} className='linksToProducts'>
					<div className='productInformationsName'>
						<b>{name}</b>
					</div>
				</Link>
				<div className='productInformations'>
					<br></br> {info}
				</div>
				<div className='productPrice'>{price} €</div>
				{quantity < 4 ? (
					<div className='lowQuantity'>
						Na voljo le še {quantity}{' '}
						{quantity === 1 ? 'izdelek' : quantity === 2 ? 'izdelka' : 'izdelki'}!
					</div>
				) : (
					<div className='OKQuantity'>Na voljo še več kot 3 izdelki.</div>
				)}
			</div>
			<div className='productAction'>
				<button
					className='addToCart'
					onClick={() => {
						addToCart(productData);
						navigate(`/shop/${username}/cart`, {});
					}}>
					<div>Dodaj v</div>
					<div>{quantityInCart > 0 ? <Plus size={25} /> : <ShoppingCart size={25} />}</div>
				</button>
			</div>
		</div>
	);
};
//						getItemQuantity(data) > 0 ? 'incrementToCart' : 'addToCart'

// ------------------------------- ???
//filters, scroll position
//const [scroll, setScroll] = useState(null);

/*useScrollPosition (({ prevPos, currPos}) => {
        console.log(currPos.x)
        console.log(currPos.y)
    });
    useScrollPosition()*/

/* useEffect(() => {

    })*/
// ------------------------------- ???

/*useMemo(() => {
        states.cartData[1]
        states.cartData[1].updtFunc([...states.cartData[1].const, productInfo]);
        console.log(states.cartData[1].const)
    }, [productInfo])*/

export default Product;
