import { useContext } from 'react';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';
import { useState, useEffect } from 'react';

const IzdelekVKosarici = ({ props }) => {
	const { kosarica, setKosarica } = useContext(NakupovalniKontekst);
	const [izdelek, setIzdelek] = useState(props.produkt);

	useEffect(() => {
		for (let i = 0; i < kosarica.length; i++) {
			if (kosarica[i].ID_izdelka === izdelek.ID_izdelka) {
				kosarica[i] = izdelek;
				if (izdelek.kolicina <= 0) {
					setKosarica(kosarica.filter((p) => p.ID_izdelka !== izdelek.ID_izdelka));
				}
			}
		}
		let vsota = 0;
		kosarica.forEach((element) => {
			vsota +=
				element.cena_za_kos * element.kolicina -
				element.cena_za_kos * element.kolicina * (element.popust / 100.0);
		});
		props.setCenaKosarice(vsota);
	});

	return (
		<div className='produktVKosarici'>
			<div className='slikaIzdelkaVKosarici'>
				<img
					src={izdelek.slika}
					className='majhnaSlika'
					alt={`ni slike ${izdelek.slika !== null ? 'Nalaganje...' : ''}`}
				/>
			</div>

			<div className='vrsticneInformacije'>
				<div
					className='produktBesedilo'
					onClick={(e) => {
						e.preventDefault();
						props.setIzbranProdukt(izdelek);
						props.setIzKosarice(true);
						props.setPrikazi('produkt');
					}}>
					[{izdelek.ID_izdelka}] {izdelek.ime}{' '}
					{izdelek.kratek_opis !== null ? ` ${izdelek.kratek_opis}` : ''}
				</div>
				<div className='produktCenaInKosi'>
					<div>{parseFloat(izdelek.cena_za_kos * (1 - izdelek.popust / 100.0)).toFixed(2)} €</div>

					<div>
						<button
							className='plusMinusGumb'
							title='odstrani kos'
							onClick={(e) => {
								setIzdelek({ ...izdelek, kolicina: izdelek.kolicina - 1 });

								props.setSporociloOdstranjevanje(
									`Odstranjen izdelek: ${izdelek.ime} ${
										izdelek.kratek_opis !== null ? izdelek.kratek_opis : ''
									} `
								);
								props.preveriZalogoIzdelkov();
							}}>
							-
						</button>{' '}
						kos: {izdelek.kolicina}{' '}
						<button
							className='plusMinusGumb'
							title='dodaj kos'
							disabled={izdelek.kolicina + 1 > izdelek.kosov_na_voljo ? 'disabled' : ''}
							onClick={(e) => {
								if (izdelek.kolicina + 1 <= izdelek.kosov_na_voljo) {
									setIzdelek({ ...izdelek, kolicina: izdelek.kolicina + 1 });
									props.setSporociloOdstranjevanje(
										`Dodan izdelek: ${izdelek.ime} ${
											izdelek.kratek_opis !== null ? izdelek.kratek_opis : ''
										} `
									);
								} else {
									props.setSporociloOdstranjevanje(
										`Izdelka: ${izdelek.ime} ${
											izdelek.kratek_opis !== null ? izdelek.kratek_opis : ''
										} ni več na zalogi `
									);
								}
							}}>
							+
						</button>
					</div>
					<div>
						<button
							className='gumbNazaj'
							title='preglej izdelek'
							onClick={(e) => {
								e.preventDefault();
								props.setIzbranProdukt(izdelek);
								props.setIzKosarice(true);
								props.setPrikazi('produkt');
							}}>
							Pregled izdelka
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default IzdelekVKosarici;
