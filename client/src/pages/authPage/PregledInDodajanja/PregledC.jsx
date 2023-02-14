import axios from 'axios';
import { useRef, useState } from 'react';
import TabelskaVrstica from './TabelskaVrsticaC';

const Pregled = ({ props }) => {
	const PORT = 3005; // !!!
	const [iskalniKriterij, setIskalniKriterij] = useState('ID');
	const [iskalniNiz, setIskalniNiz] = useState(0);

	return (
		<>
			<h2>{props.naslov}</h2>
			<div>
				{props.tabela === null ? (
					<>Nalaganje...</>
				) : (
					<>
						{props.opcije === null ? ( // prikazemo moznost filtriranja
							<div>
								<label>Iskanje po: </label>
								<select
									onClick={(e) => {
										e.preventDefault();
										setIskalniKriterij(e.target.value);
									}}>
									<option value='ID'>ID-ju</option>
									<option value='uporabnisko_ime'>Uporabniškem imenu</option>
									<option value='ime'>imenu</option>
									<option value='priimek'>priimku</option>
									<option value='elektronski_naslov'>e-pošti</option>
								</select>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();

										/*if (e.target.value === '') {
											setIskalniNiz(1);
											setIskalniKriterij(1);
										} else {*/
										setIskalniNiz(e.target.value);
										//}
									}}
									placeholder='Vnesite iskalni niz'></input>
								<button
									onClick={async (e) => {
										e.preventDefault();
										try {
											let r = await axios.get(`http://localhost:${PORT}/api/admin/osebe`, {
												params: { iskalniKriterij: iskalniKriterij, iskalniNiz: iskalniNiz },
											});
											props.setTabela(r.data);
										} catch (error) {
											console.log(`Prišlo je do napake: ${error}`);
										}
									}}>
									Išči
								</button>
							</div>
						) : (
							<select
								className='izbirnoPolje'
								onClick={(e) => {
									e.preventDefault();
									props.setFilter(parseInt(e.target.value));
								}}>
								{props.opcije.map((o) => {
									return (
										<option key={o.vrednost} value={o.vrednost}>
											{o.ime}
										</option>
									);
								})}
								)
							</select>
						)}
						<table className='tabela'>
							<tbody>
								<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
									{props.naslovnaVrstica.map((he) => {
										return <th key={he}>{he}</th>;
									})}
								</tr>
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
										if (props.naslov === 'Pregled oseb') {
											return (
												<tr>
													{Object.keys(el).map((key) => {
														if (
															key === 'ID' ||
															key === 'uporabnisko_ime' ||
															key === 'elektronski_naslov' ||
															key === 'ime' ||
															key === 'priimek'
														)
															return <td>{el[key]}</td>;
														return null;
													})}
												</tr>
											);
										} else {
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
									}
								})}
							</tbody>
						</table>
						<button
							onClick={(e) => {
								e.preventDefault();
								props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
								props.setStanjeAdmin(0);
								props.setTabela(null);
								props.setFilter(-1);
							}}>
							Nazaj
						</button>
					</>
				)}
			</div>
		</>
	);
};

export default Pregled;
