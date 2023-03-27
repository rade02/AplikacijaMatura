import { useContext, useMemo } from 'react';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';
import { CodesandboxLogo } from 'phosphor-react';

const Produkt = ({ setPrikazi, taProdukt, setIzbranProdukt, setIzKosarice, setVidno }) => {
	const { kosarica, setKosarica } = useContext(NakupovalniKontekst);

	useMemo(() => {
		setIzbranProdukt(taProdukt);
	}, [taProdukt, setIzbranProdukt]);

	return (
		<div
			className='poljeProdukta'
			onClick={(e) => {
				e.preventDefault();
				setIzbranProdukt(taProdukt);
				setPrikazi('produkt');
				setVidno(0);
				setIzKosarice(false);
			}}>
			<div>
				<div>
					{taProdukt.slika === null ? (
						<div className='niNaVoljo'>slika ni na voljo</div>
					) : (
						<div className='slikaVPoljuProdukta'>
							<img
								src={taProdukt.slika}
								className='srednjaSlika'
								alt={`${taProdukt.slika !== null ? 'Nalaganje...' : ''}`}
							/>
						</div>
					)}
				</div>
				<hr></hr>
				<div className='infoProdukta'>
					<div className='kategorija'>{taProdukt.kategorija}</div>
					<div className='predelZaInformacije'>
						<div className='kratkeInformacije'>
							<div state={taProdukt} className='linkProdukta'>
								<div className='imenaProduktov'>
									<b>{taProdukt.ime}</b>
								</div>
							</div>
							<div className='kratekOpisProdukta'>{taProdukt.kratek_opis}</div>
							<div className='cene'>
								<div className={taProdukt.popust === 0 ? 'kratekOpisProdukta' : 'prejsnjaCena'}>
									{taProdukt.cena_za_kos.toFixed(2)} €
								</div>
								{taProdukt.popust > 0 ? (
									<div>{(taProdukt.cena_za_kos * (1 - taProdukt.popust / 100.0)).toFixed(2)} €</div>
								) : (
									<></>
								)}
							</div>

							{taProdukt.kosov_na_voljo < 4 ? (
								<div className='majhnaZaloga'>
									Na voljo le še {taProdukt.kosov_na_voljo}{' '}
									{taProdukt.kosov_na_voljo === 1
										? 'izdelek'
										: taProdukt.kosov_na_voljo === 2
										? 'izdelka'
										: 'izdelki'}
									!
								</div>
							) : (
								<div className='dovoljsnjaZaloga'>Na voljo še več kot 3 izdelki.</div>
							)}

							{taProdukt.popust > 0 ? (
								<div className='popust1'>{taProdukt.popust} % popust: €</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
				{kosarica.find((element) => element.ID_izdelka === taProdukt.ID_izdelka) === undefined ? (
					<button
						className='dodajVKosarico'
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
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

export default Produkt;