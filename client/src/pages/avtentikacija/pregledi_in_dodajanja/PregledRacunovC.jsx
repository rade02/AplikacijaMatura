import { useState } from 'react';
import axios from 'axios';
import TabelskaVrstica from './TabelskaVrsticaC';
import { CaretCircleLeft } from 'phosphor-react';
import KroznoNalaganje from '@mui/material/CircularProgress';
import Skatla from '@mui/material/Box';

const PregledRacunov = ({ props }) => {
	const [iskalniKriterij, setIskalniKriterij] = useState('ID_racuna');
	const [iskalniNiz, setIskalniNiz] = useState(null);
	const [razvrstiPo, setRazvrstiPo] = useState('ID_narocila');
	const [razvrsti, setRazvrsti] = useState('asc');

	return (
		<>
			<h2 className='naslov'>{props.naslov}</h2>
			<div>
				{props.tabela === null ? (
					<Skatla sx={{ display: 'flex' }} className='nalaganje'>
						<KroznoNalaganje color='inherit' />
					</Skatla>
				) : (
					<>
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
							{props.jeStranka ? (
								<></>
							) : (
								<div className='filtriIskanja'>
									<label className='oznaka'>Iskanje po: </label>
									<select
										onClick={(e) => {
											e.preventDefault();
											setIskalniKriterij(e.target.value);
										}}>
										<option value='ID_racuna'>ID-ju računa</option>
										<option value='ID_narocila'>ID-ju naročila</option>
										<option value='kupec'>kupcu</option>
										<option value='datumIzdaje'>datumu izdaje</option>
									</select>
									<input
										className='tekstovnoPolje'
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
											iskalniKriterij === 'datumIzdaje' ? 'LLLL-MM-DD' : 'Vnesite iskalni niz'
										}></input>
									<br />
									<label className='oznaka'>Razvrsti po: </label>
									<select
										onClick={(e) => {
											e.preventDefault();
											setRazvrstiPo(e.target.value);
										}}>
										<option value={null}>-</option>
										<option value='ID_racuna'>ID-ju računa</option>
										<option value='datumIzdaje'>datumu izdaje</option>
										<option value='za_placilo'>znesku</option>
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
										className='potrdi'
										onClick={async (e) => {
											e.preventDefault();
											try {
												if (iskalniNiz === null) {
													let odziv = await axios.get(
														`http://localhost:${global.config.port}/api/administrator/racuni`,
														{
															params: {
																iskalniKriterij: 1,
																iskalniNiz: 1,
																razvrscanje_po: razvrstiPo,
																razvrscanje_razvrsti: razvrsti,
															},
														}
													);
													props.setTabela(odziv.data);
												} else {
													let rezultat = await axios.get(
														`http://localhost:${global.config.port}/api/administrator/racuni`,
														{
															params: {
																iskalniKriterij: iskalniKriterij,
																iskalniNiz: iskalniNiz,
																razvrscanje_po: razvrstiPo,
																razvrscanje_razvrsti: razvrsti,
															},
														}
													);
													props.setTabela(rezultat.data);
												}
											} catch (napaka) {
												console.log(`Prišlo je do napake: ${napaka}`);
											}
										}}>
										Išči
									</button>
								</div>
							)}
							<table className='tabela' style={{ alignSelf: 'center' }}>
								<tbody>
									{props.tabela.length === 0 ? (
										<tr>
											<td>Ni računov</td>
										</tr>
									) : (
										<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
											{props.naslovnaVrstica.map((element) => {
												return <th key={element}>{element}</th>;
											})}
										</tr>
									)}
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

export default PregledRacunov;
