import { useState, useContext, useMemo } from 'react';
import { NakupovalniKontekst } from '../../../contexts/NakupovalniKontekst';

const Product = ({
	prikazi,
	setPrikazi,
	taProdukt,
	izbranProdukt,
	setIzbranProdukt,
	izKosarice,
	setIzKosarice,
}) => {
	const PORT = 3005; // !!!
	const [showNotif, setShowNotif] = useState({ show: false, content: '' }); // show: boolean and content:'what to show'
	const { kosarica, setKosarica} = useContext(NakupovalniKontekst);

	useMemo(() => {
		setIzbranProdukt(taProdukt);
	}, [taProdukt, setIzbranProdukt]);
	//console.log(taProdukt);

	return (
		<div
			className='productCard'
			onClick={(e) => {
				e.preventDefault();
				setIzbranProdukt(taProdukt);
				setPrikazi('produkt');
				setIzKosarice(false);
			}}>
			<div>
				<div>
					{taProdukt.slika === null ? (
						<div className='productPicture'>slika ni na voljo</div>
					) : (
						<div className='productPicture'>
							<img
								src={taProdukt.slika}
								className='srednjaSlika'
								alt={`${taProdukt.slika !== null ? 'Nalaganje...' : ''}`}
							/>
						</div>
					)}
				</div>
				<hr></hr>
				<div className='productInfo'>
					<div className='category'>{taProdukt.kategorija}</div>
					<div className='o'>
						<div className='productInfoBox'>
							<div state={taProdukt} className='linksToProducts'>
								<div className='productInformationsName'>
									<b>{taProdukt.ime}</b>
								</div>
							</div>
							<div className='productInformations'>{taProdukt.kratek_opis}</div>
							<div className='prices'>
								<div
									className={
										taProdukt.popust === 0 ? 'productInformations' : 'productPriceStrikethrough'
									}>
									{taProdukt.cena_za_kos.toFixed(2)} €
								</div>
								{taProdukt.popust > 0 ? (
									<div>{(taProdukt.cena_za_kos * (1 - taProdukt.popust / 100.0)).toFixed(2)} €</div>
								) : (
									<></>
								)}
							</div>

							{taProdukt.kosov_na_voljo < 4 ? (
								<div className='lowQuantity'>
									Na voljo le še {taProdukt.kosov_na_voljo}{' '}
									{taProdukt.kosov_na_voljo === 1
										? 'izdelek'
										: taProdukt.kosov_na_voljo === 2
										? 'izdelka'
										: 'izdelki'}
									!
								</div>
							) : (
								<div className='OKQuantity'>Na voljo še več kot 3 izdelki.</div>
							)}

							{taProdukt.popust > 0 ? (
								<div className='discount'>{taProdukt.popust} % popust: €</div>
							) : (
								<></>
							)}
						</div>
						<div></div>
					</div>
				</div>
				{kosarica.find((element) => element.ID_izdelka === taProdukt.ID_izdelka) === undefined ? (
					<button
						className='dodajVKosarico'
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							//console.log(taProdukt);
							taProdukt.kolicina++;
							setKosarica([...kosarica, taProdukt]);
						}}>
						Dodaj v košarico
					</button>
				) : (
					<div className='dodanoVKosarico'>Dodano v košarico</div>
				)}
			</div>
		</div>
	);
};
//{cart.find(element => element.ID) === undefined}
// setShowNotif={setShowNotif}
// {showNotif.show ? <AddingNotification props={showNotif.content} /> : <></>}
// <div className='OKQuantity'>Na voljo še več kot 3 izdelki.</div>
export default Product;

/*
	PROPS
	{
    "produkt": {
        "ID_izdelka": 1,
        "ime": "Samsung S21 FE 5G",
        "kategorija": "mobilni telefon",
        "cena_za_kos": 650.99,
        "kosov_na_voljo": 3,
        "kratek_opis": "Novi telefon Samsung",
        "informacije": null,
        "popust": 0,
        "slika": null,
        "kolicina": 0
    },
    "props": {
        "produkts": [
            {
                "ID_izdelka": 8,
                "ime": "Acer Nitro 5 prenosnik",
                "kategorija": "prenosnik",
                "cena_za_kos": 1053.73,
                "kosov_na_voljo": 4,
                "kratek_opis": "Novi prenosnik Acer",
                "informacije": "R7 5800H/16GB /SSD512GB/RTX3050 /15,6FHD/DOS Gaming prenosnik Nitro 5 je odlična izbira za vse ljubitelje igranja iger, ki hkrati želijo mobilnost. Poganja ga visoko zmogljiv procesor AMD Ryzen™ 7 5800H, za visoko grafično zmogljivost pa bo poskrbela samostojna grafična kartica NVIDIA GeForce RTX 3050.",
                "popust": 0,
                "slika": null,
                "kolicina": 0
            },
            {
                "ID_izdelka": 12,
                "ime": "Lorem ipsum dolor sit amet, consectetuer",
                "kategorija": "Lorem ipsum dolor si",
                "cena_za_kos": 39.9,
                "kosov_na_voljo": 4,
                "kratek_opis": "Lorem ipsum dolor sit amet, consectetuer",
                "informacije": "Naglavne JBL slušalke Tune T570 se ponašajo s kakovostnim zvokom, avtonomijo delovanja do kar 40 ur ter lahko in zložljivo zasnovo.",
                "popust": 0,
                "slika": null,
                "kolicina": 0
            },
            {
                "ID_izdelka": 13,
                "ime": "Lorem ipsum dolor sit amet, consectetuer",
                "kategorija": "Lorem ipsum dolor si",
                "cena_za_kos": 39.9,
                "kosov_na_voljo": 3,
                "kratek_opis": "Lorem ipsum dolor sit amet, consectetuer",
                "informacije": "Naglavne JBL slušalke Tune T570 se ponašajo s kakovostnim zvokom, avtonomijo delovanja do kar 40 ur ter lahko in zložljivo zasnovo.",
                "popust": 90,
                "slika": null,
                "kolicina": 0
            },
            {
                "ID_izdelka": 6,
                "ime": "JBL Flip 5 prenosni zvočnik",
                "kategorija": "zvočnik",
                "cena_za_kos": 109,
                "kosov_na_voljo": 2,
                "kratek_opis": "Novi zvočnik JBL",
                "informacije": "Prenosni zvočnik navdušuje s svojo vzdržljivostjo in odpornostjo na zunanje vplive, saj je IPX7 vodoodporen. Hkrati je tudi zelo zmogljiv, omogoča namreč do 12 h poslušanja glasbe z izjemnim značilnim JBL zvokom in izrazitimi basi.",
                "popust": 0,
                "slika": null,
                "kolicina": 0
            },
            {
                "ID_izdelka": 7,
                "ime": "Asus TUF Gaming A15 prenosnik",
                "kategorija": "prenosnik",
                "cena_za_kos": 799.9,
                "kosov_na_voljo": 3,
                "kratek_opis": "Novi prenosnik Asus",
                "informacije": "R5 4600H/ 16GB/SSD512GB/ GTX1650/15,6FHD/W11H Prenosnik serije TUF Gaming A15 prinaša 39,6 cm (15,6\") velik IPS zaslon z visoko ločljivostjo Full HD (1920 × 1080) in hitrostjo osveževanja kar 144 Hz.",
                "popust": 0,
                "slika": null,
                "kolicina": 0
            },
            {
                "ID_izdelka": 1,
                "ime": "Samsung S21 FE 5G",
                "kategorija": "mobilni telefon",
                "cena_za_kos": 650.99,
                "kosov_na_voljo": 3,
                "kratek_opis": "Novi telefon Samsung",
                "informacije": null,
                "popust": 0,
                "slika": null,
                "kolicina": 0
            }
        ],
        "noProducts": false,
        "error": false,
        "productInfos": {}
    }
}
	*/
