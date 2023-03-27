import { useState } from 'react';
import axios from 'axios';
import TabelskaVrstica from './TabelskaVrsticaC';
import { CaretCircleLeft } from 'phosphor-react';
import KroznoNalaganje from '@mui/material/CircularProgress';
import Skatla from '@mui/material/Box';

const PregledPB = ({ props }) => {
	const [stavek, setStavek] = useState(null);
	const [naslovnaVrstica, setNaslovnaVrstica] = useState([]);

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
							<div className='filtriIskanja'>
								<label className='oznaka'>Vnesite stavek SQL: </label>
								<textarea
									onChange={(e) => {
										e.preventDefault();
										setStavek(e.target.value);
									}}></textarea>
								<button
									className='potrdi'
									onClick={async (e) => {
										e.preventDefault();
										try {
											let odziv = await axios.get(
												`http://localhost:${global.config.port}/api/administrator/PB`,
												{
													params: { poizvedba: stavek },
												}
											);
											props.setTabela(odziv.data.data);
											setNaslovnaVrstica(odziv.data.keys);
										} catch (napaka) {
											console.log(`Prišlo je do napake: ${napaka}`);
										}
									}}>
									Izvedi
								</button>
							</div>
							<table className='tabela'>
								<tbody>
									<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
										{naslovnaVrstica.map((element) => {
											return <th key={element}>{element}</th>;
										})}
									</tr>
									{props.tabela.map((element) => {
										return (
											<TabelskaVrstica
												props={{
													naslov: props.naslov,
													element: element,
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
