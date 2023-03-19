import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import ProductsPanel from './PrikazProduktovC';

const Shopping = ({ props }) => {
	const [kategorijeNaVoljo, setKategorijenaVoljo] = useState([]);
	const [kategorijeF, setKategorijeF] = useState([]);
	const [cenaF, setCenaF] = useState({ od: undefined, do: undefined });
	const [popustF, setPopustF] = useState(0);
	const od = useRef('od');
	const Do = useRef('do');
	const [stVsehProduktov, setStVsehProduktov] = useState(null);

	const pridobiSteviloVsehProduktov = async () => {
		try {
			let response = await axios.get(`http://localhost:${global.config.port}/api/produkti/stVsehProduktov`);
			setStVsehProduktov(response.data);
		} catch (error) {
			console.log(error);
		}
	};
	const pridobiKategorije = async () => {
		try {
			let response = await axios.get(`http://localhost:${global.config.port}/api/produkti/kategorije`);

			setKategorijenaVoljo([...response.data]);
		} catch (error) {
			console.log(error);
		}
	};
	const filtriraj = async (dodatno) => {
		console.log('filtriraj');
		try {
			let response = await axios.get(`http://localhost:${global.config.port}/api/produkti/filtriranje`, {
				params: {
					number: 6,
					kategorijeF: kategorijeF,
					cenaF: cenaF,
					popustF: popustF,
					noDups: props.prikazaniProdukti.map((a) => a.ID_izdelka),
				},
			});
			setStVsehProduktov(response.data.stProduktovKiUstrezajoFiltru);

			response.data.produkti.forEach(async (element) => {
				let res = await axios.get(
					`http://localhost:${global.config.port}/api/administrator/pridobiSliko`,
					{
						method: 'get',
						responseType: 'blob',
						params: {
							ID_izdelka: element.ID_izdelka,
						},
					}
				);

				element.kolicina = 0;
				if (res.data.size === 0) {
					element.slika = null;
				} else {
					element.slika = URL.createObjectURL(res.data);
				}
				//console.log(element.slika);
			});

			if (dodatno) {
				props.setPrikazaniProdukti([...props.prikazaniProdukti, ...response.data.produkti]);
			} else {
				props.setPrikazaniProdukti([...response.data.produkti]);
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		pridobiKategorije();
		pridobiSteviloVsehProduktov();
	}, []);

	return (
		<div className='shoppingPanel'>
			<div className='filters'>
				<label style={{ fontSize: '21px', fontWeight: '550px' }}>Filtriranje izdelkov</label>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						// setting input fields
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

						console.log(parseFloat(cenaF.od));
						if (isNaN(parseFloat(cenaF.od)) || parseFloat(cenaF.od) < 0) {
							cenaF.od = undefined;
						}
						console.log(parseFloat(cenaF.do));
						if (isNaN(parseFloat(cenaF.do)) || parseFloat(cenaF.do) < 0) {
							cenaF.do = undefined;
						}
						props.prikazaniProdukti = []; // nujno pred filtrireanjem, da ne vzame prejsnjih izdelkov kot podvojene
						filtriraj();
						if (
							(kategorijeF === undefined || kategorijeF.length === 0) &&
							(cenaF === undefined || (cenaF.od === undefined && cenaF.do === undefined)) &&
							popustF === 0
						) {
							pridobiSteviloVsehProduktov();
						}
					}}>
					<div className='filter'>
						<div className='naslov'>Po kategoriji izdelka</div>
						{kategorijeNaVoljo.map((kategorija) => {
							return (
								<div className='checkbox' key={kategorija.kategorija}>
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
						<div className='naslov'>Po ceni</div>
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
										console.log((!isNaN(parseInt(e.target.value))).toString());
										console.log((parseInt(e.target.value) > 0).toString());
										console.log(
											(
												cenaF.do === undefined || parseInt(e.target.value) < parseInt(cenaF.do)
											).toString()
										);
										if (
											!isNaN(parseInt(e.target.value)) &&
											parseInt(e.target.value) > 0 &&
											(cenaF.do === undefined || parseInt(e.target.value) < parseInt(cenaF.do))
										) {
											console.log('setting cenaf');
											setCenaF({ ...cenaF, od: e.target.value });
										} else {
											console.log('setting cenaf UNDEFINED');

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
										console.log((!isNaN(parseInt(e.target.value))).toString());
										console.log((parseInt(e.target.value) > 0).toString());
										console.log(
											(
												cenaF.od === undefined || parseInt(e.target.value) > parseInt(cenaF.od)
											).toString()
										);
										if (
											!isNaN(parseInt(e.target.value)) &&
											parseInt(e.target.value) > 0 &&
											(cenaF.od === undefined || parseInt(e.target.value) > parseInt(cenaF.od))
										) {
											console.log('setting cenaf');
											setCenaF({ ...cenaF, do: e.target.value });
										} else {
											console.log('setting cenaf UNDEFINED');
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
				filtriraj={filtriraj}
				stVsehProduktov={stVsehProduktov}
				kategorijeF={kategorijeF}
				cenaF={cenaF}
				popustF={popustF}
			/>
		</div>
	);
};

export default Shopping;
