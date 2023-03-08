import { useState } from 'react';
import axios from 'axios';
import TabelskaVrstica from './TabelskaVrsticaC';
import { CaretCircleLeft } from 'phosphor-react';

const PregledIzdelkov = ({ props }) => {
	const PORT = 3005; // !!!
	const [iskalniKriterij, setIskalniKriterij] = useState('ID_izdelka');
	const [iskalniNiz, setIskalniNiz] = useState(0);

	if (props.tabela !== null) {
		props.tabela.forEach((element) => {
			console.log(element);
		});
	}

	return (
		<>
			<h2>{props.naslov}</h2>
			<div>
				{props.tabela === null ? (
					<>Nalaganje...</>
				) : (
					<>
						<div>
							<button
								className='backBtn'
								onClick={(e) => {
									e.preventDefault();
									props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
									props.setStanjeAdmin(0);
									props.setTabela(null);
									props.setFilter(-1);
								}}>
								<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
								<div>Nazaj</div>
							</button>
							<label>Iskanje po: </label>
							<select
								onClick={(e) => {
									e.preventDefault();
									setIskalniKriterij(e.target.value);
								}}>
								<option value='ID_izdelka'>ID-ju izdelka</option>
								<option value='ime'>imenu</option>
								<option value='kategorija'>Kategoriji</option>
								<option value='popust'>Popustu</option>
							</select>
							<input
								type='text'
								onChange={(e) => {
									e.preventDefault();

									if (e.target.value === '') {
										setIskalniNiz(1);
										setIskalniKriterij(1);
									} else {
										setIskalniNiz(e.target.value);
									}
								}}
								placeholder='Vnesite iskalni niz'></input>
							<button
								onClick={async (e) => {
									e.preventDefault();
									//console.log('iskalniKriterij');
									//console.log(iskalniKriterij);
									//console.log('iskalniNiz');
									//console.log(iskalniNiz);
									try {
										let r = await axios.get(`http://localhost:${PORT}/api/admin/izdelki`, {
											params: { iskalniKriterij: iskalniKriterij, iskalniNiz: iskalniNiz },
										});
										props.setTabela(r.data);
									} catch (error) {
										console.log(`Prišlo je do napake: ${error}`);
									}
								}}>
								Išči
							</button>
							<table>
								<tbody>
									<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
										{props.naslovnaVrstica.map((he) => {
											return <th key={he}>{he}</th>;
										})}
									</tr>
									{props.tabela.map((el) => {
										console.log('----------------');
										console.log(el);
										if (props.filter === -1) {
											// prikazi vse
											return (
												<TabelskaVrstica
													props={{
														naslov: props.naslov,
														element: el,
														setOseba: props.setOseba,
														setPrejsnjeStanjeAdmin: props.setPrejsnjeStanjeAdmin,
														stanjeAdmin: props.stanjeAdmin,
														setStanjeAdmin: props.setStanjeAdmin,
														setTabela: props.setTabela,
													}}
												/>
											);
										} else {
											// prikazi filtrirano
											if (el.vloga === props.filter)
												return (
													<TabelskaVrstica
														props={{
															element: el,
															setOseba: props.setOseba,
															setPrejsnjeStanjeAdmin: props.setPrejsnjeStanjeAdmin,
															stanjeAdmin: props.stanjeAdmin,
															setStanjeAdmin: props.setStanjeAdmin,
															setTabela: props.setTabela,
														}}
													/>
												);
											return <></>;
										}
									})}
								</tbody>
							</table>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default PregledIzdelkov;
