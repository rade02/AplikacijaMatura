import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// elements:
import Navbar from './pages/mainPage/NavbarComponent';
import HomePage from './pages/homePage/HomePage';
import AboutPage from './pages/aboutPage/AboutPage';
import AuthPage from './pages/authPage/AuthPage';
import ShopPage from './pages/shopPage/ShopPage';
import ErrorPage from './pages/errorPage/ErrorPage';
import AboutRibbon from './pages/mainPage/AboutRibbon';
// context:
import { UserContextProvider } from './contexts/UserContext';

// EXPORTS AND IMPORTS:
// export ---> import {} from ... (can export many values from single file)
// export default ---> import x from ...  (can export one value from single file)

/*
Always use the setter for useState.
Always put a dependency array on useEffect, useCallback and useMemo.
To run useEffect only once use an empty array.
Do not depend on data you set.
Always add all the state you read from to the depoendency array.
*/

// ------------------------
// TODO: problem če gremo na detalje izdelka in potem damo add to cart in potem zelimo nazaj na cart
// TODO: loading spinner
// TODO: upoštevaj popust pri ceni
// ^^^^^^^^^^^^^^^^^^^^^^^^

// v state imamo cart, drugace passamo productInfo kot prop
// productInfo je kot prostor za izdelek, ki ga trenutno prikazujemo

function App() {
	// TODO: LOG file for all the actions (esp. user loging and changing infos)
	// za linke ki obstajajo povsod na strani (navbar): <a href="/home">Go to home</home>
	// routes uporabljamo za vsako pot (route)
	// v <Routes> damo spreminjajoče komponente pri preklapljanju strani
	// ostalo pa so stalne komponente

	// TA; KJER SO ROUTE TAM SO PAGES, na pages so komponente
	return (
		<Router>
			<UserContextProvider>
				<div className='main'>
					<Navbar />
					<div>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/about' element={<AboutPage />} />
							<Route path='/auth' element={<AuthPage />} />
							<Route path='/shop' element={<ShopPage />} />
							<Route path='*' element={<ErrorPage />} />
						</Routes>
					</div>
					<AboutRibbon />
				</div>
			</UserContextProvider>
		</Router>
	);
}

export default App;

/*
<Route path='/' element={<Navigate replace to='/gost/*' />} />
							<Route path='/:uname/*' element={<Home />} />

							<Route path='/auth/*' element={<Authentication />} />

							
*/

/*

							<Route path='/:uname' element={<Home />}></Route>
							<Route path='/shop' element={<Navigate replace to='/shop/gost' />} />
							<Route path='/shop/:uname' element={<Shop />}></Route>
							<Route path='/shop/product/:id/' element={<ProductPage />}></Route>
							<Route path='/shop/cart/' element={<Cart />}></Route>
							<Route path='/shop/cart/:uname' element={<Cart />}></Route>
							<Route path='/shop/cart/:uname/checkout' element={<Checkout />} />
*/
