import { useState } from 'react';
import axios from 'axios';
import TabelskaVrstica from './TabelskaVrsticaC';
import { CaretCircleLeft } from 'phosphor-react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const PregledPB = ({ props }) => {
	const [stavek, setStavek] = useState(null);
	const [naslovnaVrstica, setNaslovnaVrstica] = useState([]);

	return (
		<>
			<h2>{props.naslov}</h2>
			<div>
				{props.tabela === null ? (
					<Box sx={{ display: 'flex' }} className='nalaganje'>
						<CircularProgress color='inherit' />
					</Box>
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
							<label>Vnesite stavek SQL: </label>
							<textarea
								onChange={(e) => {
									e.preventDefault();
									setStavek(e.target.value);
								}}></textarea>
							<button
								onClick={async (e) => {
									e.preventDefault();
									try {
										let r = await axios.get(`http://localhost:${global.config.port}/api/admin/PB`, {
											params: { poizvedba: stavek },
										});
										props.setTabela(r.data.data);
										setNaslovnaVrstica(r.data.keys);
									} catch (error) {
										console.log(`Prišlo je do napake: ${error}`);
									}
								}}>
								Izvedi
							</button>
							<table>
								<tbody>
									<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
										{naslovnaVrstica.map((he) => {
											return <th key={he}>{he}</th>;
										})}
									</tr>
									{props.tabela.map((el) => {
										console.log('el');
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

export default PregledPB;
