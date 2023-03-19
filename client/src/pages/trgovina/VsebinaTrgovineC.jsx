import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';
import Shopping from './NakupovanjeC';
import Kosarica from './KosaricaC';
import Blagajna from './BlagajnaC';
import Error from '../Error';
import ProductInfo from './InformacijeOProduktuC';
import { WarningCircle } from 'phosphor-react';

const ShopContent = ({ prikazi, setPrikazi, setCenaKosarice }) => {
	const { kosarica } = useContext(NakupovalniKontekst);

	const [prikazaniProdukti, setPrikazaniProdukti] = useState([]);
	const [niProduktov, setNiProduktov] = useState(true);
	const [napaka, setNapaka] = useState(false);
	const [izbranProdukt, setIzbranProdukt] = useState({}); // za prikaz na product info page ce pridemo iz product component
	//const [fetchNumber] = useState(6); mogoče potem opcija za koliko jih prikaze na stran
	const [izKosarice, setIzKosarice] = useState(null);
	const [removedMsg, setRemovedMsg] = useState('');

	const pridobiProdukte = async () => {
		try {
			let response = await axios.get(`http://localhost:${global.config.port}/api/produkti/`, {
				params: {
					number: 6,
					noDups: prikazaniProdukti.map((a) => a.ID_izdelka),
				},
			});
			// dodamo vsakemu izdelku kolicino v kosarici in sliko
			response = response.data;
			response.forEach(async (element) => {
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
				//console.log(res.data);
				if (res.data.size === 0) {
					element.slika = null;
				} else {
					element.slika = URL.createObjectURL(res.data);
				}
				//console.log('element.slika');
				//console.log(element.slika);
			});
			setPrikazaniProdukti([...prikazaniProdukti, ...response]);
			setNiProduktov(false);
		} catch (error) {
			console.log(error);
			setNapaka(true);
		}
	};

	useEffect(() => {
		let vsota = 0;
		kosarica.forEach((element) => {
			vsota +=
				element.cena_za_kos * element.kolicina -
				element.cena_za_kos * element.kolicina * (element.popust / 100.0);
		});
		setCenaKosarice(vsota);
		if (niProduktov) {
			setPrikazaniProdukti([]);
			pridobiProdukte();
		}
	});

	if (napaka) {
		return (
			<>
				<div>
					<WarningCircle size={25} />
					Napaka pri nalaganju izdelkov
				</div>
				<div>
					<button
						onClick={(e) => {
							e.preventDefault();
							setNapaka(false);
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
			<Shopping
				props={{
					izKosarice: izKosarice,
					setIzKosarice: setIzKosarice,
					setPrikazi: setPrikazi,
					prikazaniProdukti: prikazaniProdukti,
					setPrikazaniProdukti: setPrikazaniProdukti,
					niProduktov: niProduktov,
					napaka: napaka,
					pridobiProdukte: pridobiProdukte,
					izbranProdukt: izbranProdukt,
					setIzbranProdukt: setIzbranProdukt,
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
				pridobiProdukte={pridobiProdukte}
				prikazaniProdukti={prikazaniProdukti}
				setPrikazaniProdukti={setPrikazaniProdukti}
				removedMsg={removedMsg}
				setRemovedMsg={setRemovedMsg}
				setNiProduktov={setNiProduktov}
			/>
		);
	} else if (prikazi === 'blagajna') {
		return (
			<Blagajna
				setPrikazi={setPrikazi}
				removedMsg={removedMsg}
				setRemovedMsg={setRemovedMsg}
				pridobiProdukte={pridobiProdukte}
			/>
		);
	} else if (prikazi === 'produkt') {
		return (
			<ProductInfo
				izKosarice={izKosarice}
				setIzKosarice={setIzKosarice}
				izbranProdukt={izbranProdukt}
				setIzbranProdukt={setIzbranProdukt}
				setPrikazi={setPrikazi}
			/>
		);
	} else {
		return <Error />;
	}
};

export default ShopContent;
