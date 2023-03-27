import { CaretCircleLeft } from 'phosphor-react';
import { useContext } from 'react';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';

const InformacijeOProduktu = ({ setPrikazi, izbranProdukt, izKosarice }) => {
	const { kosarica, setKosarica } = useContext(NakupovalniKontekst);

	return (
		<div className='oknoProdukta'>
			<div className='divProdukta'>
				<div className='divProdukta2'>
					<h2>
						{`[#${izbranProdukt.ID_izdelka}] `}
						{izbranProdukt.ime}
					</h2>
					<div>
						<div className='prostorZaSliko'>
							{izbranProdukt.slika === null ? (
								<div>slika ni na voljo</div>
							) : (
								<>
									<div className='slikaProdukta'>
										<img
											src={izbranProdukt.slika}
											className='velikaSlika'
											alt={`ni slike ${izbranProdukt.slika !== null ? 'Nalaganje...' : ''}`}
										/>
									</div>
								</>
							)}
						</div>
						<div className='opisProdukta'>
							<div className='kategorija'>{izbranProdukt.kategorija}</div>
							<br></br>
							<div className='informacijeOProduktu'>{izbranProdukt.informacije}</div>
							<br></br>
							<div>
								{izbranProdukt.kosov_na_voljo === 0 ? (
									<div className='majhnaZaloga'>Razprodano</div>
								) : izbranProdukt.kosov_na_voljo < 4 ? (
									<div className='majhnaZaloga'>
										Na voljo le še {izbranProdukt.kosov_na_voljo}{' '}
										{izbranProdukt.kosov_na_voljo === 1
											? 'izdelek'
											: izbranProdukt.kosov_na_voljo === 2
											? 'izdelka'
											: 'izdelki'}
										!
									</div>
								) : (
									<div className='dovoljsnjaZaloga'>Na voljo še več kot 3 izdelki.</div>
								)}
							</div>
							<br></br>
							<div className={izbranProdukt.popust === 0 ? 'informacijeProdukta' : 'prejsnjaCena'}>
								{izbranProdukt.cena_za_kos.toFixed(2)} €
							</div>
							{izbranProdukt.popust === 0 ? (
								<></>
							) : (
								<div className='popust'>{izbranProdukt.popust} % popust</div>
							)}
							{izbranProdukt.popust > 0 ? (
								<div className='informacijeProdukta'>
									{(izbranProdukt.cena_za_kos * (1 - izbranProdukt.popust / 100.0)).toFixed(2)} €
								</div>
							) : (
								<></>
							)}
							<br></br>
							<div className='divGumbi'>
								<button
									className='gumbNazaj'
									onClick={(e) => {
										e.preventDefault();
										if (izKosarice) setPrikazi('kosarica');
										else setPrikazi('nakupovanje');
									}}>
									<CaretCircleLeft size={25} />
									<div>Nazaj</div>
								</button>
								{kosarica.find((element) => element.ID_izdelka === izbranProdukt.ID_izdelka) ===
								undefined ? (
									<button
										className='dodajVKosarico'
										style={{ marginTop: '0px' }}
										onClick={(e) => {
											e.preventDefault();
											izbranProdukt.kolicina++;
											setKosarica([...kosarica, izbranProdukt]);
										}}>
										Dodaj v košarico
									</button>
								) : (
									<div
										className='dodanoVKosarico'
										style={{ marginLeft: '40px', width: 'fit-content', minWidth: '165px' }}>
										Dodano v košarico
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default InformacijeOProduktu;
