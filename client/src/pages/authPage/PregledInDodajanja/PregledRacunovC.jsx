import { useState } from 'react';
import axios from 'axios';

const PregledRacunov = ({ props }) => {
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
						{JSON.stringify(props.tabela)}
						<div>
							<label>Iskanje po: </label>
							<select
								onClick={(e) => {
									e.preventDefault();
									setIskalniKriterij(e.target.value);
								}}>
								<option value='ID_racuna'>ID-ju računa</option>
								<option value='ID_narocila'>ID-ju naročila</option>
								<option value='datum_valute'>Datumu valute</option>
								<option value='placano'>Plačilu</option>
							</select>
							<input
								type='text'
								onChange={(e) => {
									e.preventDefault();

									setIskalniNiz(e.target.value);
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
					</>
				)}
			</div>
		</>
	);
};

export default PregledRacunov;
