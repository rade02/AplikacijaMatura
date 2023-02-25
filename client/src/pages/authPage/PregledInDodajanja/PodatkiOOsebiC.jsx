import axios from 'axios';
import { CaretCircleLeft } from 'phosphor-react';

const PodatkiOOsebi = ({ oseba, prejsnjeStanjeAdmin, setStanjeAdmin, tabela, setTabela }) => {
	const PORT = 3005; // !!!

	//console.log('tabela @ Podatki o osebi');
	//console.log(tabela);

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
				{tabela !== undefined &&
				tabela !== null &&
				tabela.podatkiOIzdelkih !== null &&
				tabela.podatkiOIzdelkih !== undefined &&
				tabela.imenaIzdelkov !== null &&
				tabela.imenaIzdelkov !== undefined ? (
					<>
						<label>Izdelki pri naročilu:</label>
						<table>
							<tbody>
								<tr>
									<td>Ime izdelka</td>
									<td>Količina</td>
									<td>Cena za kos</td>
								</tr>
								{tabela.podatkiOIzdelkih.map((izdelek) => {
									return (
										<tr key={izdelek.ID_izdelka + '' + izdelek.ID_izdelka}>
											{Object.keys(izdelek).map((key) => {
												if (key === 'ID_izdelka') {
													let imeIzdelka = tabela.imenaIzdelkov.filter(
														(ime) => ime.ID_izdelka === izdelek[key]
													);
													return <td key={key + '' + izdelek[key]}>{imeIzdelka[0].ime}</td>;
												} else if (key === 'cena') {
													return <td key={key + '' + izdelek[key]}>{izdelek[key]} €</td>;
												} else if (key !== 'ID_narocila') {
													return <td key={key + '' + izdelek[key]}>{izdelek[key]}</td>;
												} else return <></>;
											})}
										</tr>
									);
								})}
							</tbody>
						</table>
					</>
				) : (
					<></>
				)}
			</div>
			<button
				className='backBtn'
				onClick={(e) => {
					e.preventDefault();
					setStanjeAdmin(prejsnjeStanjeAdmin);
					setTabela(null);
				}}>
				<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
				<div>Nazaj</div>
			</button>
		</div>
	);
};
/*
{tabela !== undefined || null ? (
							tabela[0].podatkiOIzdelkih.map((izdelek) => {
								return (
									<tr key={izdelek.ID_izdelka + '' + izdelek.ID_izdelka}>
										{Object.keys(izdelek).map((key) => {
											console.log('izdelek[key]');
											console.log(izdelek[key]);
											if (key === 'ID_izdelka') {
												let imeIzdelka = tabela.imenaIzdelkov.filter(
													(ime) => ime.ID_izdelka === izdelek[key]
												);
												console.log('ime izdelka');
												console.log(imeIzdelka);
												return <td key={key + '' + izdelek[key]}>{imeIzdelka.ime}</td>;
											} else return <td key={key + '' + izdelek[key]}>{izdelek[key]}</td>;
										})}
									</tr>
								);
							})
						) : (
							<></>
						)}
*/

export default PodatkiOOsebi;
