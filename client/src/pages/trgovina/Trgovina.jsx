import './Trgovina.css';
import { useEffect, useState, useRef, useMemo } from 'react';
import { NakupovalniKontekstProvider } from '../../contexts/NakupovalniKontekst';
import VsebinaTrgovine from './VsebinaTrgovineC';
import NavigacijaTrgovine from './NavigacijaTrgovineC';
import { ArrowCircleUp } from 'phosphor-react';

const Trgovina = ({ Ref }) => {
	const [vidno, setVidno] = useState(0); // 0 - zgoraj, 2 - vidno
	const [prikazi, setPrikazi] = useState('nakupovanje');
	const [cenaKosarice, setCenaKosarice] = useState(0);
	const [naVrh, setNaVrh] = useState(false);
	const prejsnjiOdmik = useRef(0);

	useEffect(() => {
		if (prikazi === 'nakupovanje') {
			const pomikanje = () => {
				if (naVrh) {
					setNaVrh(false);
				}
				let odmikOdVrha = window.pageYOffset;

				if (odmikOdVrha < 250) {
					setVidno(0);
				} else if (naVrh) {
					setVidno(0);
				} else {
					if (prejsnjiOdmik.current < odmikOdVrha && (vidno === 2 || vidno === 0)) {
						setVidno(2);
					} else {
						setVidno(0);
					}
				}

				prejsnjiOdmik.current = odmikOdVrha;
			};
			window.addEventListener('scroll', pomikanje);
			return () => {
				window.removeEventListener('scroll', pomikanje);
			};
		}
	});

	useMemo(() => {
		if (naVrh) {
			Ref.current.scrollIntoView({ behaviour: 'smooth' });
		}
	}, [naVrh, Ref]);

	return (
		<NakupovalniKontekstProvider>
			<div className='trgovina'>
				<NavigacijaTrgovine
					vidno={vidno}
					setVidno={setVidno}
					prikazi={prikazi}
					setPrikazi={setPrikazi}
					cenaKosarice={cenaKosarice}
				/>
				<VsebinaTrgovine
					setVidno={setVidno}
					prikazi={prikazi}
					setPrikazi={setPrikazi}
					setCenaKosarice={setCenaKosarice}
				/>
				{prikazi === 'nakupovanje' && (prejsnjiOdmik.current > 450 || vidno === 2) ? (
					<div
						className='naVrh'
						onClick={() => {
							setVidno(0);
							setNaVrh(true);
						}}>
						<ArrowCircleUp size={35} />
					</div>
				) : (
					<></>
				)}
			</div>
		</NakupovalniKontekstProvider>
	);
};

export default Trgovina;
