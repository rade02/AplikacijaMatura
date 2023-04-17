import { useContext, useEffect, useState } from 'react';
import { NakupovalniKontekst } from '../../contexts/NakupovalniKontekst';
import VzdolznoNalaganje from '@mui/material/LinearProgress';
import Skatla from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const Produkt = (props) => {
	const { kosarica, setKosarica } = useContext(NakupovalniKontekst);
	let [nalaganje, setNalaganje] = useState(true);

	useEffect(() => {
		const casovnik = setTimeout(() => {
			setNalaganje(false);
		}, 1650);

		return () => {
			clearTimeout(casovnik);
			setNalaganje(true);
		};
	}, []);

	useEffect(() => {
		if (props.nalaganjeSlikeIzdelka) {
			setNalaganje(true);

			const casovnik2 = setTimeout(() => {
				setNalaganje(false);
				props.setNalaganjeSlikeIzdelka(null);
			}, 1650);

			return () => {
				clearTimeout(casovnik2);
			};
		}
	}, [props.nalaganjeSlikeIzdelka, props.setNalaganjeSlikeIzdelka]);

	return (
		<div
			className='poljeProdukta'
			onClick={(e) => {
				e.preventDefault();
				props.setIzbranProdukt(props.taProdukt);
				props.setPrikazi('produkt');
				props.setVidno(0);
				props.setIzKosarice(false);
			}}>
			<div>
				{nalaganje ? (
					<>
						<div style={{ backgroundColor: 'white' }}>
							<Stack spacing={1}>
								<Skeleton variant='rectangular' animation='wave' width={160} height={160} />
							</Stack>
						</div>
						<Skatla sx={{ width: '85%' }}>
							<VzdolznoNalaganje color='inherit' />
						</Skatla>
					</>
				) : (
					<></>
				)}
				{!nalaganje ? (
					<div>
						{props.taProdukt.slika === null ? (
							<div className='niNaVoljo'>slika ni na voljo</div>
						) : (
							<div className='slikaVPoljuProdukta'>
								<img src={props.taProdukt.slika} className='srednjaSlika' alt='Nalaganje...' />
							</div>
						)}
					</div>
				) : (
					<></>
				)}
				<hr></hr>
				<div className='infoProdukta'>
					<div className='kategorija'>{props.taProdukt.kategorija}</div>
					<div className='predelZaInformacije'>
						<div className='kratkeInformacije'>
							<div state={props.taProdukt} className='linkProdukta'>
								<div className='imenaProduktov'>
									<b>{props.taProdukt.ime}</b>
								</div>
							</div>
							<div className='kratekOpisProdukta'>{props.taProdukt.kratek_opis}</div>
							<div className='cene'>
								<div className={props.taProdukt.popust === 0 ? 'kratekOpisProdukta' : 'prejsnjaCena'}>
									{props.taProdukt.cena_za_kos.toFixed(2)} €
								</div>
								{props.taProdukt.popust > 0 ? (
									<div>
										{(props.taProdukt.cena_za_kos * (1 - props.taProdukt.popust / 100.0)).toFixed(2)}{' '}
										€
									</div>
								) : (
									<></>
								)}
							</div>

							{props.taProdukt.kosov_na_voljo < 4 ? (
								<div className='majhnaZaloga'>
									Na voljo le še {props.taProdukt.kosov_na_voljo}{' '}
									{props.taProdukt.kosov_na_voljo === 1
										? 'izdelek'
										: props.taProdukt.kosov_na_voljo === 2
										? 'izdelka'
										: 'izdelki'}
									!
								</div>
							) : (
								<div className='dovoljsnjaZaloga'>Na voljo še več kot 3 izdelki.</div>
							)}

							{props.taProdukt.popust > 0 ? (
								<div className='popust1'>{props.taProdukt.popust} % popust: €</div>
							) : (
								<></>
							)}
						</div>
					</div>
				</div>
				{kosarica.find((element) => element.ID_izdelka === props.taProdukt.ID_izdelka) === undefined ? (
					<button
						className='dodajVKosarico'
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
							props.taProdukt.kolicina++;
							setKosarica([...kosarica, props.taProdukt]);
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
