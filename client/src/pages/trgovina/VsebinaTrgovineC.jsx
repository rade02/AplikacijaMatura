import axios from 'axios';
import { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';
import Nakupovanje from './NakupovanjeC';
import Kosarica from './KosaricaC';
import Blagajna from './BlagajnaC';
import Error from '../Error';
import InformacijeOProduktu from './InformacijeOProduktuC';
import { WarningCircle } from 'phosphor-react';

const VsebinaTrgovine = ({ prikazi, setPrikazi, setCenaKosarice, setVidno, niProduktov, setNiProduktov }) => {
	const { kosarica } = useContext(NakupovalniKontekst);

	let [prikazaniProdukti, setPrikazaniProdukti] = useState([]);
	let stNalaganj = useRef(0);
	const [napaka, setNapaka] = useState(false);
	const [izbranProdukt, setIzbranProdukt] = useState({}); // za prikaz na product info page ce pridemo iz product component
	const [izKosarice, setIzKosarice] = useState(null);
	const [sporociloOdstranjevanje, setSporociloOdstranjevanje] = useState('');

	const pridobiProdukte = useCallback(async () => {
		try {
			let odziv = await axios.get(`http://localhost:${global.config.port}/api/produkti/`, {
				params: {
					steviloIzdelkov: 6,
					brezPodvajanja: prikazaniProdukti.map((a) => a.ID_izdelka),
				},
			});

			odziv = odziv.data;
			if (odziv.length === 0) {
				setNiProduktov(true);
				setNapaka(true);
			}
			if (odziv.length > 0) {
				setNiProduktov(false);
				setNapaka(false);
			}
			// dodamo vsakemu izdelku kolicino v kosarici in sliko
			odziv.forEach(async (element) => {
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
			setPrikazaniProdukti([...prikazaniProdukti, ...odziv]);
		} catch (napaka) {
			console.log(napaka);
			setNapaka(true);
			setPrikazaniProdukti([]);
		}
	}, [prikazaniProdukti, setNiProduktov]);

	useEffect(() => {
		let vsota = 0;
		kosarica.forEach((element) => {
			vsota +=
				element.cena_za_kos * element.kolicina -
				element.cena_za_kos * element.kolicina * (element.popust / 100.0);
		});
		setCenaKosarice(vsota);

		if (niProduktov) {
			if (stNalaganj.current === 0) {
				setPrikazaniProdukti([]);
				stNalaganj.current++;
				pridobiProdukte();
			}
		}
	}, [kosarica, setCenaKosarice, niProduktov, pridobiProdukte, stNalaganj, napaka, setNiProduktov]);

	if (napaka) {
		return (
			<>
				<div
					style={{
						margin: '20px',
						display: 'flex',
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						color: 'red',
					}}>
					<WarningCircle size={25} style={{ marginRight: '5px', color: 'red' }} />
					Napaka pri nalaganju izdelkov
				</div>
				<p>Napaka strežnika: preverite delovanje strežnika in ga ponovno zaženite.</p>
				<div>
					<button
						className='ponovno'
						onClick={(e) => {
							e.preventDefault();
							setNapaka(false);
							setNiProduktov(true);
							pridobiProdukte();
						}}>
						Poskusi ponovno
					</button>
				</div>
			</>
		);
	}
	if (prikazi === 'nakupovanje') {
		return (
			<Nakupovanje
				props={{
					izKosarice: izKosarice,
					setIzKosarice: setIzKosarice,
					prikazi: prikazi,
					setPrikazi: setPrikazi,
					prikazaniProdukti: prikazaniProdukti,
					setPrikazaniProdukti: setPrikazaniProdukti,
					niProduktov: niProduktov,
					setNiProduktov: setNiProduktov,
					napaka: napaka,
					setNapaka: setNapaka,
					izbranProdukt: izbranProdukt,
					setIzbranProdukt: setIzbranProdukt,
					setVidno: setVidno,
				}}
			/>
		);
	} else if (prikazi === 'kosarica') {
		return (
			<Kosarica
				izbranProdukt={izbranProdukt}
				setIzbranProdukt={setIzbranProdukt}
				setPrikazi={setPrikazi}
				izKosarice={izKosarice}
				setIzKosarice={setIzKosarice}
				setCenaKosarice={setCenaKosarice}
				prikazaniProdukti={prikazaniProdukti}
				setPrikazaniProdukti={setPrikazaniProdukti}
				sporociloOdstranjevanje={sporociloOdstranjevanje}
				setSporociloOdstranjevanje={setSporociloOdstranjevanje}
				setNiProduktov={setNiProduktov}
			/>
		);
	} else if (prikazi === 'blagajna') {
		return (
			<Blagajna
				setPrikazi={setPrikazi}
				sporociloOdstranjevanje={sporociloOdstranjevanje}
				setSporociloOdstranjevanje={setSporociloOdstranjevanje}
			/>
		);
	} else if (prikazi === 'produkt') {
		return (
			<InformacijeOProduktu izKosarice={izKosarice} izbranProdukt={izbranProdukt} setPrikazi={setPrikazi} />
		);
	} else {
		return <Error />;
	}
};

export default VsebinaTrgovine;
