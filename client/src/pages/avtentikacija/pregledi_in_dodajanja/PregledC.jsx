import axios from 'axios';
import { CaretCircleLeft, X } from 'phosphor-react';
import { useState } from 'react';
import TabelskaVrstica from './TabelskaVrsticaC';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Pregled = ({ props }) => {
	const [iskalniKriterij, setIskalniKriterij] = useState('ID');
	const [iskalniNiz, setIskalniNiz] = useState(0);

	return (
		<>
			<h2 className='naslov'>{props.naslov}</h2>
			<div className='pregled'>
				<button
					className='gumbNazaj'
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
				{props.tabela === null ? (
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							alignSelf: 'center',
						}}>
						<Box sx={{ display: 'flex' }} className='nalaganje'>
							<CircularProgress color='inherit' />
						</Box>
					</div>
				) : (
					<>
						{props.moznosti === null ? ( // prikazemo moznost filtriranja
							// za pregled oseb
							<div className='filtriIskanja'>
								<div className='iskanje'>
									<label className='oznaka'>Iskanje po: </label>
									<select
										onClick={(e) => {
											e.preventDefault();
											setIskalniKriterij(e.target.value);
										}}>
										<option value='ID'>ID-ju</option>
										<option value='uporabnisko_ime'>upor. imenu</option>
										<option value='ime'>imenu</option>
										<option value='priimek'>priimku</option>
										<option value='elektronski_naslov'>e-pošti</option>
									</select>
								</div>
								<div className='iskanje'>
									<input
										className='tekstovnoPolje'
										style={{ width: '100px', height: '15px', fontSize: '13px' }}
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
										className='potrdi'
										onClick={async (e) => {
											e.preventDefault();
											try {
												let rezultat = await axios.get(
													`http://localhost:${global.config.port}/api/administrator/osebe`,
													{
														params: { iskalniKriterij: iskalniKriterij, iskalniNiz: iskalniNiz },
													}
												);
												props.setTabela(rezultat.data);
											} catch (napaka) {
												console.log(`Prišlo je do napake: ${napaka}`);
											}
										}}>
										Išči
									</button>
								</div>
							</div>
						) : props.naslov === 'Pregled uporabnikov' ? (
							// za pregled uporabnikov
							<>
								<div className='spustniMeni'>
									<select
										onClick={(e) => {
											e.preventDefault();
											props.setFilter(parseInt(e.target.value));
										}}>
										{props.moznosti.map((o) => {
											return (
												<option key={o.vrednost} value={o.vrednost}>
													{o.ime}
												</option>
											);
										})}
										)
									</select>
								</div>
							</>
						) : (
							// pregled izdelkov
							<div className='filtriIskanja'>
								<div className='iskanje'>
									<label className='oznaka'>Iskanje po: </label>
									<select
										onClick={(e) => {
											e.preventDefault();
											setIskalniKriterij(e.target.value);
										}}>
										<option value='ID_izdelka'>ID-ju izdelka</option>
										<option value='ime'>imenu</option>
										<option value='kategorija'>kategoriji</option>
										<option value='popust'>popustu</option>
									</select>
								</div>
								<div className='iskanje'>
									<input
										className='tekstovnoPolje'
										style={{ width: '100px', height: '15px', fontSize: '13px' }}
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
										className='potrdi'
										onClick={async (e) => {
											e.preventDefault();
											try {
												let r = await axios.get(
													`http://localhost:${global.config.port}/api/administrator/izdelki`,
													{
														params: { iskalniKriterij: iskalniKriterij, iskalniNiz: iskalniNiz },
													}
												);
												props.setTabela(r.data);
											} catch (napaka) {
												console.log(`Prišlo je do napake: ${napaka}`);
											}
										}}>
										Išči
									</button>
								</div>
							</div>
						)}
						<table className='tabela' style={{ alignSelf: 'center' }}>
							<tbody>
								<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
									{props.naslovnaVrstica.map((element) => {
										return <th key={element}>{element}</th>;
									})}
								</tr>
								{props.tabela.map((element) => {
									if (props.filter === -1) {
										// prikazi vse
										return (
											<TabelskaVrstica
												props={{
													naslov: props.naslov,
													element: element,
													setPredmet: props.setPredmet,
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
													{Object.keys(element).map((key) => {
														// pri pregledu oseb
														if (
															key === 'ID' ||
															key === 'uporabnisko_ime' ||
															key === 'elektronski_naslov' ||
															key === 'ime' ||
															key === 'priimek'
														)
															return <td>{element[key]}</td>;
														return null;
													})}
												</tr>
											);
										} else {
											if (element.vloga === props.filter)
												return (
													<TabelskaVrstica
														props={{
															element: element,
															setPredmet: props.setPredmet,
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
							className='gumbNazaj'
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
					</>
				)}
			</div>
		</>
	);
};

export default Pregled;
