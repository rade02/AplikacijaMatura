import axios from 'axios';
import { useState } from 'react';
import TabelskaVrstica from './TabelskaVrsticaC';
import { CaretCircleLeft } from 'phosphor-react';
import KroznoNalaganje from '@mui/material/CircularProgress';
import Skatla from '@mui/material/Box';

const PregledPB = ({ props }) => {
	const [potrjevanje, setPotrjevanje] = useState(false);

	const izvedi = async () => {
		try {
			let odziv = await axios.post(`http://localhost:${global.config.port}/api/administrator/PB`, {
				poizvedba: props.SQLstavek,
			});
			props.setTabela(odziv.data.data);
			props.setGlava(odziv.data.keys.filter((key) => key !== 'informacije'));
		} catch (napaka) {
			console.log(`Prišlo je do napake: ${napaka}`);
		}
	};

	if (potrjevanje) {
		return (
			<div style={{ border: '2px solid red', padding: '35px', margin: '20px', maxWidth: '900px' }}>
				<label className='opozorilo'>
					Vnesli ste ukaz
					<br />
					<b>
						<i>{props.SQLstavek}</i>
					</b>
					<br /> ki lahko spremeni vsebino podatkovne baze. Ali želite nadaljevati?
				</label>
				<br />
				<button
					className='izvedi'
					onClick={(e) => {
						e.preventDefault();
						izvedi();
						setPotrjevanje(false);
					}}>
					Izvedi
				</button>
				<button
					className='preklici'
					onClick={(e) => {
						e.preventDefault();
						props.setSQLstavek(null);
						setPotrjevanje(false);
					}}>
					Prekliči
				</button>
			</div>
		);
	}
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
									props.setSQLstavek(null);
									props.setGlava([]);
								}}>
								<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
								<div>Nazaj</div>
							</button>
							<div className='filtriIskanja'>
								<label className='oznaka'>Vnesite stavek SQL: </label>
								<textarea
									defaultValue={props.SQLstavek !== null ? props.SQLstavek : ''}
									onChange={(e) => {
										e.preventDefault();
										props.setSQLstavek(e.target.value);
									}}></textarea>
								<button
									className='potrdi'
									onClick={async (e) => {
										e.preventDefault();
										let nadaljuj = true;
										let ukazi = [
											'create',
											'drop',
											'alter',
											'truncate',
											'comment',
											'rename',
											'insert',
											'update',
											'delete',
											'lock',
											'grant',
											'revoke',
											'begin',
											'commit',
											'rollback',
											'savepoint',
											'set transaction',
										];
										ukazi.forEach((ukaz) => {
											if (props.SQLstavek.includes(ukaz)) {
												setPotrjevanje(true);
												nadaljuj = false;
											}
										});
										if (nadaljuj) {
											izvedi();
										}
									}}>
									Izvedi
								</button>
							</div>
							<table className='tabela'>
								<tbody>
									<tr style={{ backgroundColor: 'rgba(240, 240, 240, 0.727)' }}>
										{props.glava.map((element) => {
											return <th key={element}>{element}</th>;
										})}
									</tr>
									{props.tabela.map((element) => {
										console.log(element);
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
