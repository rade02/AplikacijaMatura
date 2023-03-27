import axios from 'axios';
import { Funnel } from 'phosphor-react';
import { useState, useEffect, useRef } from 'react';
import ProductsPanel from './PrikazProduktovC';

const Nakupovanje = ({ props }) => {
	const [kategorijeNaVoljo, setKategorijenaVoljo] = useState([]);
	const [kategorijeF, setKategorijeF] = useState([]);
	const [cenaF, setCenaF] = useState({ od: undefined, do: undefined });
	const [popustF, setPopustF] = useState(0);
	const od = useRef('od');
	const Do = useRef('do');
	const [stVsehProduktov, setStVsehProduktov] = useState(null);

	const pridobiSteviloVsehProduktov = async () => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/stVsehProduktov`);
			setStVsehProduktov(odziv.data);
		} catch (napaka) {
			console.log(napaka);
		}
	};
	const pridobiKategorije = async () => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/kategorije`);

			setKategorijenaVoljo([...odziv.data]);
		} catch (napaka) {
			console.log(napaka);
		}
	};
	const filtriraj = async (dodatno) => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/filtriranje`, {
				params: {
					steviloIzdelkov: 6,
					kategorijeF: kategorijeF,
					cenaF: cenaF,
					popustF: popustF,
					brezPodvajanj: props.prikazaniProdukti.map((a) => a.ID_izdelka),
				},
			});
			setStVsehProduktov(odziv.data.stProduktovKiUstrezajoFiltru);

			odziv.data.produkti.forEach(async (element) => {
				let rezultat = await axios.get(
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
				if (rezultat.data.size === 0) {
					element.slika = null;
				} else {
					element.slika = URL.createObjectURL(rezultat.data);
				}
			});

			if (dodatno) {
				props.setPrikazaniProdukti([...props.prikazaniProdukti, ...odziv.data.produkti]);
			} else {
				props.setPrikazaniProdukti([...odziv.data.produkti]);
			}
		} catch (napaka) {
			console.log(napaka);
		}
	};

	useEffect(() => {
		pridobiKategorije();
		pridobiSteviloVsehProduktov();
	}, []);

	return (
		<div className='filtriInIzdelki'>
			<div className='filtri'>
				<div style={{ fontSize: '24px', fontWeight: '650', maxWidth: '200px' }}>Filtriranje izdelkov</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
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

						//console.log(parseFloat(cenaF.od));
						if (isNaN(parseFloat(cenaF.od)) || parseFloat(cenaF.od) < 0) {
							cenaF.od = undefined;
						}
						//console.log(parseFloat(cenaF.do));
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
						<div className='nasloviFiltrov'>Po kategoriji izdelka</div>
						{kategorijeNaVoljo.map((kategorija) => {
							return (
								<div className='potrditvenoPolje' key={kategorija.kategorija}>
									<input
										className='kvadrat'
										id={kategorija.kategorija}
										type='checkbox'
										value={kategorija.kategorija}
										onChange={(e) => {
											if (e.target.checked && !kategorijeF.includes(kategorija.kategorija)) {
												setKategorijeF([...kategorijeF, e.target.value]);
											} else {
												let indeks = kategorijeF.indexOf(kategorija.kategorija);
												if (indeks > -1) {
													kategorijeF.splice(indeks, 1);
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
						<div className='nasloviFiltrov'>Po ceni</div>
						<div className='potrditvenoPolje' style={{ flexDirection: 'column' }}>
							<div className='filtriranjePoCeni'>
								Od
								<input
									ref={od}
									type='text'
									className='poljeZaVnosCene'
									placeholder={cenaF.od === undefined ? '-' : undefined}
									onChange={(e) => {
										e.preventDefault();
										//console.log((!isNaN(parseInt(e.target.value))).toString());
										//console.log((parseInt(e.target.value) > 0).toString());
										//console.log(
										//	(
										//		cenaF.do === undefined || parseInt(e.target.value) < parseInt(cenaF.do)
										//	).toString()
										//);
										if (
											!isNaN(parseInt(e.target.value)) &&
											parseInt(e.target.value) > 0 &&
											(cenaF.do === undefined || parseInt(e.target.value) < parseInt(cenaF.do))
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
										/*console.log((!isNaN(parseInt(e.target.value))).toString());
										console.log((parseInt(e.target.value) > 0).toString());
										console.log(
											(
												cenaF.od === undefined || parseInt(e.target.value) > parseInt(cenaF.od)
											).toString()
										);*/
										if (
											!isNaN(parseInt(e.target.value)) &&
											parseInt(e.target.value) > 0 &&
											(cenaF.od === undefined || parseInt(e.target.value) > parseInt(cenaF.od))
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
						<div className='nasloviFiltrov'>Po popustu</div>
						<div className='potrditvenoPolje'>
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
						<div className='potrditvenoPolje'>
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
						<div className='potrditvenoPolje'>
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
					<div className='filtriranje'>
						<button className='gumbFiltriranje' type='submit'>
							Filtriraj <Funnel size={22} style={{ marginLeft: '4px' }} />
						</button>
					</div>
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

export default Nakupovanje;
