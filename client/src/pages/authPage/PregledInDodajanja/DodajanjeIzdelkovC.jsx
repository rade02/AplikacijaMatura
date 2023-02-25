import axios from 'axios';
import { CaretCircleLeft } from 'phosphor-react';
import { useState, useRef } from 'react';

const DodajanjeIzdelkov = ({ props }) => {
	const PORT = 3005; // !!!
	const [vneseniPodatki, setVneseniPodatki] = useState({
		ime: null,
		kategorija: null,
		cena_za_kos: null,
		kosov_na_voljo: true,
		kratek_opis: null,
		informacije: null,
		popust: 0,
		slika: null,
	});
	const [sporociloONapaki, setSporociloONapaki] = useState({
		ime: '',
		kategorija: '',
		cenaZaKos: '',
		kosovNaVoljo: '',
		kratekOpis: '',
		popust: '',
	});

	console.log(props);
	console.log(typeof props.setStanjeAdmin);

	return (
		<div>
			<h2 className='naslov'>{props.naslov}</h2>
			<button
				className='backBtn'
				onClick={(e) => {
					e.preventDefault();
					props.setStanjeAdmin(0);
				}}>
				<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
				<div>Nazaj</div>
			</button>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					const posodobiVlogo = async () => {
						let res;
						try {
							res = await axios.post(`http://localhost:${PORT}/api/admin/dodajIzdelek`, {
								ime: vneseniPodatki.ime,
								kategorija: vneseniPodatki.kategorija,
								cena_za_kos: vneseniPodatki.cena_za_kos,
								kosov_na_voljo: vneseniPodatki.kosov_na_voljo,
								kratek_opis: vneseniPodatki.kratek_opis,
								informacije: vneseniPodatki.informacije,
								popust: vneseniPodatki.popust,
								slika: vneseniPodatki.slika,
							});
						} catch (error) {
							setSporociloONapaki({
								...sporociloONapaki,
								dbS: 'Napaka pri vnosu v bazo podatkov',
							});
							console.log('Prišlo je do napake: ' + error.toString());
						}
					};
					posodobiVlogo();
					e.target.reset();
				}}
				className='obrazecZaVnosUporabnika'>
				<table>
					<tbody>
						<tr>
							<td className='opisPodatka'>Ime izdelka</td>
							<td className='podatek'>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, ime: e.target.value });
										if (e.target.value.length > 40) {
											setSporociloONapaki({
												...sporociloONapaki,
												ime: 'Ime sme vsebovati največ 40 znakov',
											});
										} else {
											setSporociloONapaki({ ...sporociloONapaki, ime: '' });
										}
									}}
									placeholder=''
									className='tekstovnoPolje'></input>
								{sporociloONapaki.ime === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.ime}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Kategorija izdelka</td>
							<td className='podatek'>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, kategorija: e.target.value });
										if (e.target.value.length > 20) {
											setSporociloONapaki({
												...sporociloONapaki,
												kategorija: 'Kategorija sme vsebovati največ 20 znakov',
											});
										} else {
											setSporociloONapaki({ ...sporociloONapaki, kategorija: '' });
										}
									}}
									placeholder=''
									className='tekstovnoPolje'></input>
								{sporociloONapaki.kategorija === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.kategorija}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Cena za kos</td>
							<td className='podatek'>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, cena_za_kos: e.target.value });
										try {
											parseInt(e.target.value);
											setSporociloONapaki({ ...sporociloONapaki, cenaZaKos: '' });
										} catch {
											setSporociloONapaki({
												...sporociloONapaki,
												cenaZaKos: 'Cena za kos mora biti število',
											});
										}
									}}
									placeholder='decimalna pika'
									className='tekstovnoPolje'></input>
								{sporociloONapaki.cenaZaKos === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.cenaZaKos}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Kosov na voljo</td>
							<td className='podatek'>
								<input
									required
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, kosov_na_voljo: e.target.value });
										try {
											parseInt(e.target.value);
											setSporociloONapaki({ ...sporociloONapaki, kosovNaVoljo: '' });
										} catch {
											setSporociloONapaki({
												...sporociloONapaki,
												kosovNaVoljo: 'Kosov na voljo mora biti število',
											});
										}
									}}
									placeholder=''
									className='tekstovnoPolje'></input>
								{sporociloONapaki.kosovNaVoljo === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.kosovNaVoljo}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Kratek opis</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, kratek_opis: e.target.value });
										if (e.target.value.length > 40) {
											setSporociloONapaki({
												...sporociloONapaki,
												kratekOpis: 'Kratek opis sme vsebovati največ 40 znakov',
											});
										} else {
											setSporociloONapaki({ ...sporociloONapaki, kratekOpis: '' });
										}
									}}
									placeholder=''
									className='tekstovnoPolje'></input>
								{sporociloONapaki.kratekOpis === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.kratekOpis}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Informacije</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, informacije: e.target.value });
									}}
									placeholder='Podrobnosti'
									className='tekstovnoPolje'></input>
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Popust</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										setVneseniPodatki({ ...vneseniPodatki, popust: e.target.value });
										try {
											console.log(parseFloat(e.target.value));
											if (isNaN(parseFloat(e.target.value))) {
												setSporociloONapaki({
													...sporociloONapaki,
													popust: 'Popust mora biti število',
												});
											} else if (parseFloat(e.target.value) >= 100) {
												setSporociloONapaki({
													...sporociloONapaki,
													popust: 'Popust mora biti manjši od 100',
												});
											} else if (parseFloat(e.target.value) <= 0) {
												setSporociloONapaki({
													...sporociloONapaki,
													popust: 'Popust mora biti med 0 in 100',
												});
											} else {
												setSporociloONapaki({ ...sporociloONapaki, popust: '' });
											}
										} catch {
											setSporociloONapaki({
												...sporociloONapaki,
												popust: 'Napačen vnos popusta - mora biti število med 0 in 100',
											});
										}
									}}
									placeholder='decimalna pika'
									className='tekstovnoPolje'></input>
								{sporociloONapaki.popust === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.popust}</div>
								)}
							</td>
						</tr>
						<tr>
							<td className='opisPodatka'>Slika</td>
							<td className='podatek'>
								<input
									type='text'
									onChange={(e) => {
										e.preventDefault();
										//setVneseniPodatki({ ...vneseniPodatki, slika: e.target.value });
									}}
									className='tekstovnoPolje'></input>
							</td>
						</tr>
					</tbody>
				</table>
				<button type='submit'>Vnesi</button>
				{sporociloONapaki.dbS !== null ? <div>{sporociloONapaki.dbS}</div> : <></>}
			</form>
		</div>
	);
	/*{napakaPriVnosu !== null ? <div>{napakaPriVnosu}</div> : <></>}
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

		
	*/
};

export default DodajanjeIzdelkov;
