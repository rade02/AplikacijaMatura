import { useState } from 'react';
import axios from 'axios';
import TabelskaVrstica from './TabelskaVrsticaC';
import { CaretCircleLeft } from 'phosphor-react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PregledNarocil = ({ props }) => {
	const [iskalniKriterij, setIskalniKriterij] = useState('ID_narocila');
	const [iskalniNiz, setIskalniNiz] = useState(null);
	const [razvrstiPo, setRazvrstiPo] = useState('ID_narocila');
	const [razvrsti, setRazvrsti] = useState('asc');

	return (
		<>
			<h2 className='naslov'>{!props.stranka ? props.naslov : props.naslov + ' stranke ' + props.uporabnisko_ime}</h2>
			<div>
				{props.tabela === null ? (
					<Box sx={{ display: 'flex' }} className='nalaganje'>
						<CircularProgress color='inherit' />
					</Box>
				) : (
					<>
						<div>
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
								<option value='imeStranke'>Imenu stranke</option>
								<option value='priimekStranke'>Priimku stranke</option>
								<option value='naslovDostave'>Naslovu dostave</option>
							</select>

							<input
								type='text'
								onChange={(e) => {
									e.preventDefault();

									if (e.target.value === '') {
										setIskalniNiz(null);
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
							<br />
							<label>Razvrsti po: </label>
							<select
								onClick={(e) => {
									e.preventDefault();
									setRazvrstiPo(e.target.value);
								}}>
								<option value={null}>-</option>
								<option value='ID_narocila'>ID-ju</option>
								<option value='datum'>datumu</option>
							</select>
							<select
								onClick={(e) => {
									e.preventDefault();
									setRazvrsti(e.target.value);
								}}>
								<option value='asc'>Naraščajoče</option>
								<option value='desc'>Padajoče</option>
							</select>
							<button
								onClick={async (e) => {
									e.preventDefault();
									try {
										if (iskalniNiz === null) {
											let r = await axios.get(
												`http://localhost:${global.config.port}/api/administrator/narocila`,
												{
													params: {
														iskalniKriterij: 1,
														iskalniNiz: 1,
														razvrscanje_po: razvrstiPo,
														razvrscanje_razvrsti: razvrsti,
													},
												}
											);
											props.setTabela(r.data);
										} else {
											let r = await axios.get(
												`http://localhost:${global.config.port}/api/administrator/narocila`,
												{
													params: {
														iskalniKriterij: iskalniKriterij,
														iskalniNiz: iskalniNiz,
														razvrscanje_po: razvrstiPo,
														razvrscanje_razvrsti: razvrsti,
													},
												}
											);
											props.setTabela(r.data);
										}
									} catch (error) {
										console.log(`Prišlo je do napake: ${error}`);
									}
								}}>
								Išči
							</button>

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
