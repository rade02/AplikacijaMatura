import { useState } from 'react';
import axios from 'axios';
import TabelskaVrstica from './TabelskaVrsticaC';
import { CaretCircleLeft } from 'phosphor-react';

const PregledNarocil = ({ props }) => {
	const PORT = 3005; // !!!
	const [iskalniKriterij, setIskalniKriterij] = useState('ID_narocila');
	const [iskalniNiz, setIskalniNiz] = useState(0);
	return (
		<>
			<h2>{!props.stranka ? props.naslov : props.naslov + ' stranke ' + props.uporabnisko_ime}</h2>
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
							{!props.stranka ? (
								<>
									<label>Iskanje po: </label>
									<select
										onClick={(e) => {
											e.preventDefault();
											setIskalniKriterij(e.target.value);
										}}>
										<option value='ID_narocila'>ID-ju naročila</option>
										<option value='datum'>Datumu</option>
										<option value='ID_stranke'>ID-ju stranke</option>
										<option value='opravljeno'>Opravljenosti</option>
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
										placeholder={
											iskalniKriterij === 'datum'
												? 'YYYY-MM-DD'
												: iskalniKriterij === 'opravljeno'
												? '1 ali 0'
												: 'Vnesite iskalni niz'
										}></input>
									<button
										onClick={async (e) => {
											e.preventDefault();
											try {
												let r = await axios.get(`http://localhost:${PORT}/api/admin/narocila`, {
													params: { iskalniKriterij: iskalniKriterij, iskalniNiz: iskalniNiz },
												});
												props.setTabela(r.data);
											} catch (error) {
												console.log(`Prišlo je do napake: ${error}`);
											}
										}}>
										Išči
									</button>
								</>
							) : (
								<></>
							)}
							<table>
								<tbody>
									{props.tabela.length === 0 ? (
										<tr>
											<td>Ni naročil</td>
										</tr>
									) : (
										<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
											{props.naslovnaVrstica.map((he) => {
												return <th key={he}>{he}</th>;
											})}
										</tr>
									)}
									{props.tabela.map((el) => {
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

export default PregledNarocil;
