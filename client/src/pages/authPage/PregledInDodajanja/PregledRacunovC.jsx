import { useState } from 'react';
import axios from 'axios';
import TabelskaVrstica from './TabelskaVrsticaC';
import { CaretCircleLeft } from 'phosphor-react';

const PregledRacunov = ({ props, jeStranka }) => {
	const PORT = 3005; // !!!
	const [iskalniKriterij, setIskalniKriterij] = useState('ID_racuna');
	const [iskalniNiz, setIskalniNiz] = useState(null);
	const [razvrstiPo, setRazvrstiPo] = useState('ID_narocila');
	const [razvrsti, setRazvrsti] = useState('asc');

	if (jeStranka) {
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
								<option value='ID_racuna'>ID-ju računa</option>
								<option value='ID_narocila'>ID-ju naročila</option>
								<option value='kupec'>Kupcu</option>
								<option value='placano'>Datumu placila</option>
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
									iskalniKriterij === 'placano' ? 'LLLL-MM-DD' : 'Vnesite iskalni niz'
								}></input>
							<br />
							<label>Razvrsti po: </label>
							<select
								onClick={(e) => {
									e.preventDefault();
									setRazvrstiPo(e.target.value);
								}}>
								<option value={null}>-</option>
								<option value='ID_racuna'>ID-ju računa</option>
								<option value='datum'>datumu</option>
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
								onClick={async (e) => {
									e.preventDefault();
									try {
										if (iskalniNiz === null) {
											let r = await axios.get(`http://localhost:${PORT}/api/admin/racuni`, {
												params: {
													iskalniKriterij: 1,
													iskalniNiz: 1,
													razvrscanje_po: razvrstiPo,
													razvrscanje_razvrsti: razvrsti,
												},
											});
											props.setTabela(r.data);
										} else {
											let r = await axios.get(`http://localhost:${PORT}/api/admin/racuni`, {
												params: {
													iskalniKriterij: iskalniKriterij,
													iskalniNiz: iskalniNiz,
													razvrscanje_po: razvrstiPo,
													razvrscanje_razvrsti: razvrsti,
												},
											});
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
											<td>Ni računov</td>
										</tr>
									) : (
										<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
											{props.naslovnaVrstica.map((he) => {
												return <th key={he}>{he}</th>;
											})}
										</tr>
									)}
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

export default PregledRacunov;
