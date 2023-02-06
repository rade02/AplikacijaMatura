import axios from 'axios';
import { useState } from 'react';

const DodajanjeUporabnikov = ({ props }) => {
	const PORT = 3005; // !!!
	const [vneseniPodatki, setVneseniPodatki] = useState({
		uporabnisko_ime: null,
		geslo: null,
		vloga: null,
		omogocen: null,
		elektronski_naslov: null,
		ime: null,
		priimek: null,
		ulica_in_hisna_stevilka: null,
		kraj: null,
		postna_stevilka: null,
		telefonska_stevilka: null,
		podjetje: null,
		oddelek: null,
		placa: null,
	});

	return (
		<div>
			<h2>{props.naslov}</h2>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const posodobiVlogo = async () => {
						let res;
						try {
							res = await axios.post(`http://localhost:${PORT}/api/admin/dodajUporabnika`, {
								uporabnisko_ime: vneseniPodatki.uporabnisko_ime,
								geslo: vneseniPodatki.geslo,
								vloga: vneseniPodatki.vloga,
								omogocen: vneseniPodatki.omogocen,
								elektronski_naslov: vneseniPodatki.elektronski_naslov,
								ime: vneseniPodatki.ime,
								priimek: vneseniPodatki.priimek,
								ulica_in_hisna_stevilka: vneseniPodatki.ulica_in_hisna_stevilka,
								kraj: vneseniPodatki.kraj,
								postna_stevilka: vneseniPodatki.postna_stevilka,
								telefonska_stevilka: vneseniPodatki.telefonska_stevilka,
								podjetje: vneseniPodatki.podjetje,
								oddelek: vneseniPodatki.oddelek,
								placa: vneseniPodatki.placa,
							});
						} catch (error) {
							res.data = 'Prišlo je do napake';
						}
					};
					alert('Vnesen uporabnik: ' + JSON.stringify(vneseniPodatki));
					posodobiVlogo();
				}}>
				<table style={{ border: '1px solid black' }}>
					<tbody style={{ border: '1px solid black' }}>
						<tr>
							<td>Uporabniško ime</td>
							<td>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, uporabnisko_ime: e.target.value });
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Geslo</td>
							<td>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, geslo: e.target.value });
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Vloga</td>
							<td>
								<input
									required
									type='radio'
									name='vloga'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, vloga: 0 });
									}}></input>
								<label>Admin</label>
								<br />
								<input
									required
									type='radio'
									name='vloga'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, vloga: 1 });
									}}></input>
								<label>Zaposleni</label>
								<br />
								<input
									required
									type='radio'
									name='vloga'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, vloga: 2 });
									}}></input>
								<label>Stranka</label>
								<br />
								<input
									required
									type='radio'
									name='vloga'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, vloga: 3 });
									}}></input>
								<label>Računovodja</label>
								<br />
							</td>
						</tr>
						<tr>
							<td>Omogočen</td>
							<td>
								<input
									required
									type='radio'
									name='omogocen'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, omogocen: true });
									}}></input>
								<label>Da</label>
								<br />
								<input
									required
									type='radio'
									name='omogocen'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, omogocen: false });
									}}></input>
								<label>Ne</label>
								<br />
							</td>
						</tr>
						<tr>
							<td>Elektronski naslov</td>
							<td>
								<input
									required
									type='email'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, elektronski_naslov: e.target.value });
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Ime</td>
							<td>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, ime: e.target.value });
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Priimek</td>
							<td>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, priimek: e.target.value });
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Ulica in hišna št.</td>
							<td>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											ulica_in_hisna_stevilka: e.target.value,
										});
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Kraj</td>
							<td>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											kraj: e.target.value,
										});
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Poštna št.</td>
							<td>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											postna_stevilka: e.target.value,
										});
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Telefonska št.</td>
							<td>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											telefonska_stevilka: e.target.value,
										});
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Podjetje</td>
							<td>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											podjetje: e.target.value,
										});
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Oddelek</td>
							<td>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											oddelek: e.target.value,
										});
									}}></input>
							</td>
						</tr>
						<tr>
							<td>Plača</td>
							<td>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({
											...vneseniPodatki,
											placa: e.target.value,
										});
									}}></input>
							</td>
						</tr>
					</tbody>
				</table>
				<button type='submit'>Vnesi</button>
			</form>
		</div>
	);
	/*
		<div>
			:
			{Object.keys(vneseniPodatki).map((key) => {
				return <div>{vneseniPodatki[key]}</div>;
			})}
			:
		</div>
	*/
	/*
<table style={{ border: '1px solid black' }}>
						<tbody style={{ border: '1px solid black' }}>
							<tr>
								<td>a</td>
								<td>b</td>
							</tr>
							<tr>
								<td>rieuwofdshouwqjbsafuewbsduihfbsdvbzauichsdi</td>
							</tr>
						</tbody>
					</table>

		if(geslo & vloga & omogocen & e-n & ime & priimek)
	*/
};

export default DodajanjeUporabnikov;
