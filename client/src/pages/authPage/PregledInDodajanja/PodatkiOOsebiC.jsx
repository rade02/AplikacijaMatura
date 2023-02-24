import { CaretCircleLeft } from 'phosphor-react';

const PodatkiOOsebi = ({ oseba, prejsnjeStanjeAdmin, setStanjeAdmin }) => {
	if (oseba === null) {
		return (
			<div>
				<div>Prišlo je do napake pri prikazu osebe</div>
				<button
					className='backBtn'
					onClick={(e) => {
						e.preventDefault();
						setStanjeAdmin(prejsnjeStanjeAdmin);
					}}>
					<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
					<div>Nazaj</div>
				</button>
			</div>
		);
	}

	return (
		<div>
			<div className='podrobniPodatki'>
				<table className='tabela'>
					<tbody>
						{Object.keys(oseba).map((pr) => {
							return (
								<tr>
									<td>{pr}:</td>
									{pr === 'vloga' ? (
										<td>
											{oseba[pr] === 0
												? 'administrator'
												: oseba[pr] === 1
												? 'zaposleni'
												: oseba[pr] === 2
												? 'stranka'
												: oseba[pr] === 3
												? 'računovodja'
												: 'nedoločeno'}
										</td>
									) : pr === 'omogocen' ? (
										<td>{oseba[pr] === 1 ? 'omogočen' : 'onemogočen'}</td>
									) : pr === 'geslo' ? (
										<td>{oseba[pr]}</td>
									) : (
										<td>{oseba[pr]}</td>
									)}
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<button
				className='backBtn'
				onClick={(e) => {
					e.preventDefault();
					setStanjeAdmin(prejsnjeStanjeAdmin);
				}}>
				<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
				<div>Nazaj</div>
			</button>
		</div>
	);
};

export default PodatkiOOsebi;
