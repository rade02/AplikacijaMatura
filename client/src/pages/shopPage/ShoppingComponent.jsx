import axios from 'axios';
import { useContext, useState, useEffect, useRef } from 'react';
import ProductsPanel from './shopping/ProductsPanelComponent';
import ProductInfo from './shopping/ProductInfoComponent';
import { ShopContext } from '../../contexts/ShopContext';

const Shopping = ({ props }) => {
	const PORT = 3005; // !!!
	const [kategorijeNaVoljo, setKategorijenaVoljo] = useState([]);
	const [kategorijeF, setKategorijeF] = useState([]);
	const [cenaF, setCenaF] = useState({ od: undefined, do: undefined });
	const [popustF, setPopustF] = useState(0);
	const od = useRef('od');
	const Do = useRef('do');
	const [stVsehProduktov, setStVsehProduktov] = useState(null);

	// ODSTRANI:
	const pridobiSteviloVsehProduktov = async () => {
		try {
			let response = await axios.get(`http://localhost:${PORT}/api/products/stVsehProduktov`);
			setStVsehProduktov(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	const pridobiKategorije = async () => {
		try {
			let response = await axios.get(`http://localhost:${PORT}/api/products/kategorije`);

			setKategorijenaVoljo([...response.data]);
		} catch (error) {
			console.log(error);
		}
	};
	const filtriraj = async () => {
		try {
			let response = await axios.get(`http://localhost:${PORT}/api/products/filtriranje`, {
				params: {
					number: 6,
					noDups: props.prikazaniProdukti.map((a) => a.ID_izdelka),
					kategorijeF: kategorijeF,
					cenaF: cenaF,
					popustF: popustF,
				},
			});

			setKategorijenaVoljo([...response.data]);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		pridobiKategorije();
		pridobiSteviloVsehProduktov();
	}, []);
	//checked={kategorijeF.includes(kategorija.kategorija) ? 'checked' : null}
	return (
		<div className='shoppingPanel'>
			<div className='filters'>
				<label style={{ fontSize: '21px', fontWeight: '550px' }}>Filtriranje izdelkov</label>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						console.log('filtriraj!');
						console.log(kategorijeF);
						console.log(cenaF);
						console.log(popustF);
						if (cenaF.od !== undefined) {
							od.current.value = cenaF.od;
						} else {
							od.current.value = '';
						}
						if (cenaF.do !== undefined) {
							Do.current.value = cenaF.do;
						} else {
							Do.current.value = '';
						}
						// dejansko filtriraj
						filtriraj();
					}}>
					<div className='filter'>
						<div className='naslov'>Po kategoriji izdelka</div>
						{kategorijeNaVoljo.map((kategorija) => {
							return (
								<div className='checkbox'>
									<input
										id={kategorija.kategorija}
										type='checkbox'
										value={kategorija.kategorija}
										onChange={(e) => {
											if (e.target.checked && !kategorijeF.includes(kategorija.kategorija)) {
												setKategorijeF([...kategorijeF, e.target.value]);
											} else {
												let index = kategorijeF.indexOf(kategorija.kategorija);
												if (index > -1) {
													kategorijeF.splice(index, 1);
												}
											}
										}}
									/>
									<label>{kategorija.kategorija}</label>
								</div>
							);
						})}
					</div>
					<div className='filter'>
						<div className='naslov'>Po ceni (slider - bootstrap)</div>
						<div className='checkbox' style={{ flexDirection: 'column' }}>
							<div className='filtriranjePoCeni'>
								Od
								<input
									ref={od}
									type='text'
									className='poljeZaVnosCene'
									placeholder={cenaF.od === undefined ? '-' : undefined}
									onChange={(e) => {
										e.preventDefault();
										if (
											(!isNaN(parseInt(e.target.value)) &&
												parseInt(e.target.value) > 0 &&
												parseInt(e.target.value) < parseInt(cenaF.do)) ||
											cenaF.do === undefined
										) {
											setCenaF({ ...cenaF, od: e.target.value });
										} else {
											setCenaF({ ...cenaF, od: undefined });
										}
									}}></input>
								€
							</div>
							<div className='filtriranjePoCeni'>
								do
								<input
									ref={Do}
									type='text'
									className='poljeZaVnosCene'
									placeholder={cenaF.do === undefined ? '-' : undefined}
									onChange={(e) => {
										e.preventDefault();
										if (
											(!isNaN(parseInt(e.target.value)) &&
												parseInt(e.target.value) > 0 &&
												parseInt(e.target.value) > parseInt(cenaF.od)) ||
											cenaF.od === undefined
										) {
											setCenaF({ ...cenaF, do: e.target.value });
										} else {
											setCenaF({ ...cenaF, do: undefined });
										}
									}}></input>
								€
							</div>
						</div>
					</div>
					<div className='filter'>
						<div className='naslov'>Po popustu</div>
						<div className='checkbox'>
							<input
								type='radio'
								value={0}
								name='popusti'
								defaultChecked
								onChange={(e) => {
									setPopustF(e.target.value);
								}}
							/>
							<label>z in brez popustov</label>
						</div>
						<div className='checkbox'>
							<input
								type='radio'
								value={5}
								name='popusti'
								onChange={(e) => {
									setPopustF(e.target.value);
								}}
							/>
							<label>več kot 5 % popust</label>
						</div>

						<div className='checkbox'>
							<input
								type='radio'
								value={10}
								name='popusti'
								onChange={(e) => {
									setPopustF(e.target.value);
								}}
							/>
							<label>več kot 10 % popust</label>
						</div>
					</div>
					<button type='submit'>Filtriraj</button>
				</form>
			</div>
			<ProductsPanel
				props={props}
				stVsehProduktov={stVsehProduktov}
				kategorijeF={kategorijeF}
				cenaF={cenaF}
				popustF={popustF}
			/>
		</div>
	);
};

export default Shopping;
