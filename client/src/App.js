import './App.css';
import { useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavigacijskaVrstica from './pages/NavigacijskaVrsticaC';
import Domov from './pages/Domov';
import ONas from './pages/ONas';
import Trgovina from './pages/trgovina/Trgovina';
import Error from './pages/Error';
import Noga from './pages/NogaC';
import { UporabniskiKontekstProvider } from './contexts/UporabniskiKontekst';
import Avtentikacija from './pages/avtentikacija/Avtentikacija';

function App() {
	const zgoraj = useRef('zgoraj');

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
