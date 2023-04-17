import './App.css';
import { useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// elements:
import NavigacijskaVrstica from './pages/NavigacijskaVrsticaC';
import Domov from './pages/Domov';
import ONas from './pages/ONas';
import Trgovina from './pages/trgovina/Trgovina';
import Error from './pages/Error';
import Noga from './pages/NogaC';
// context:
import { UporabniskiKontekstProvider } from './contexts/UporabniskiKontekst';
import Avtentikacija from './pages/avtentikacija/Avtentikacija';

// EXPORTS AND IMPORTS:
// export ---> import {} from ... (can export many values from single file)
// export default ---> import x from ...  (can export one value from single file)

/*
Always use the setter for useState.
Always put a dependency array on useEffect
To run useEffect only once use an empty array.
Do not depend on data you set.
Always add all the state you read from to the depoendency array.
*/

function App() {
	// TODO: LOG file for all the actions (esp. user loging and changing infos)
	// za linke ki obstajajo povsod na strani (navbar): <a href="/home">Go to home</home>
	// routes uporabljamo za vsako pot (route)
	// v <Routes> damo spreminjajoče komponente pri preklapljanju strani
	// ostalo pa so stalne komponente
	const zgoraj = useRef('zgoraj');

	// TAM KJER SO ROUTE TAM SO PAGES, na pages so komponente
	return (
		<BrowserRouter>
			<UporabniskiKontekstProvider>
				<div className='vsebina' ref={zgoraj}>
					<NavigacijskaVrstica />
					<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Routes>
							<Route path='/' element={<Domov />} />
							<Route path='/oNas' element={<ONas />} />
							<Route path='/avtentikacija' element={<Avtentikacija />} />
							<Route path='/trgovina' element={<Trgovina Ref={zgoraj} />} />
							<Route path='/*' element={<Error />} />
						</Routes>
					</div>
					<Noga />
				</div>
			</UporabniskiKontekstProvider>
		</BrowserRouter>
	);
}

export default App;
