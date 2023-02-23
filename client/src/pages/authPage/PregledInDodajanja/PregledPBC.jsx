import { useState } from 'react';
import axios from 'axios';
import TabelskaVrstica from './TabelskaVrsticaC';

const PregledPB = ({ props }) => {
	const PORT = 3005; // !!!
	const [stavek, setStavek] = useState(null);
	const [naslovnaVrstica, setNaslovnaVrstica] = useState([]);

	return (
		<>
			<h2>{props.naslov}</h2>
			<div>
				{props.tabela === null ? (
					<>Nalaganje...</>
				) : (
					<>
						<div>
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
										let r = await axios.get(`http://localhost:${PORT}/api/admin/PB`, {
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
