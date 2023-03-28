import axios from 'axios';
import { CaretCircleLeft } from 'phosphor-react';
import { useState } from 'react';

const DodajanjeIzdelkov = ({ props, datoteka, setDatoteka }) => {
	const [vneseniPodatki, setVneseniPodatki] = useState({
		ime: null,
		kategorija: null,
		cena_za_kos: null,
		kosov_na_voljo: true,
		kratek_opis: null,
		informacije: null,
		popust: 0,
	});
	const [sporociloONapaki, setSporociloONapaki] = useState({
		ime: '',
		kategorija: '',
		cenaZaKos: '',
		kosovNaVoljo: '',
		kratekOpis: '',
		popust: '',
	});

	return (
		<div>
			<h2 className='naslov'>{props.naslov}</h2>
			<button
				className='gumbNazaj'
				onClick={(e) => {
					e.preventDefault();
					props.setStanjeAdmin(0);
				}}>
				<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
				<div>Nazaj</div>
			</button>
			<form
				className='obrazecZaVnos'
				action='/dodajIzdelek'
				method='post'
				encType='multipart/form-data'
				onSubmit={async (e) => {
					e.preventDefault();
					if (
						sporociloONapaki.ime === '' &&
						sporociloONapaki.kategorija === '' &&
						sporociloONapaki.cenaZaKos === '' &&
						sporociloONapaki.kosovNaVoljo === '' &&
						sporociloONapaki.kratekOpis === '' &&
						sporociloONapaki.popust === '' &&
						sporociloONapaki.dbS === ''
					) {
						const formData = new FormData();
						formData.append('slika', datoteka);
						formData.append('ime', vneseniPodatki.ime);
						formData.append('kategorija', vneseniPodatki.kategorija);
						formData.append('cena_za_kos', vneseniPodatki.cena_za_kos);
						formData.append('kosov_na_voljo', vneseniPodatki.kosov_na_voljo);
						formData.append('kratek_opis', vneseniPodatki.kratek_opis);
						formData.append('informacije', vneseniPodatki.informacije);
						formData.append('popust', vneseniPodatki.popust);

						const posodobiVlogo = async () => {
							try {
								await axios.post(
									`http://localhost:${global.config.port}/api/administrator/dodajIzdelek`,
									formData,
									{
										headers: { 'Content-Type': 'multipart/form-data' },
									}
								);
							} catch (napaka) {
								setSporociloONapaki({
									...sporociloONapaki,
									dbS: 'Napaka pri vnosu v bazo podatkov',
								});
								console.log('Prišlo je do napake: ' + napaka.toString());
							}
						};

						posodobiVlogo();
						e.target.reset();
					} else {
						setSporociloONapaki({
							...sporociloONapaki,
							dbS: 'Neustrezni podatki',
						});
					}
				}}>
				<table>
					<tbody>
						<tr>
							<td className='opisPodatka'>Naložite sliko:</td>
							<input
								style={{ minWidth: '300px' }}
								type='file'
								encType='multipart/form-data'
								name='image'
								accept='image/gif, image/jpeg, image/png'
								onChange={(e) => {
									setDatoteka(e.target.files[0]);
								}}
							/>
						</tr>
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
											setSporociloONapaki({ ...sporociloONapaki, ime: '', dbS: '' });
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
											setSporociloONapaki({ ...sporociloONapaki, kategorija: '', dbS: '' });
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
										if (isNaN(parseInt(e.target.value))) {
											setSporociloONapaki({
												...sporociloONapaki,
												cenaZaKos: 'Cena za kos mora biti število',
											});
										} else {
											setSporociloONapaki({ ...sporociloONapaki, cenaZaKos: '', dbS: '' });
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
										if (isNaN(parseInt(e.target.value))) {
											setSporociloONapaki({
												...sporociloONapaki,
												kosovNaVoljo: 'Kosov na voljo mora biti število',
											});
										} else if (parseFloat(e.target.value) - parseInt(e.target.value) !== 0) {
											setSporociloONapaki({
												...sporociloONapaki,
												kosovNaVoljo: 'Kosov na voljo mora biti celo število',
											});
										} else {
											setSporociloONapaki({ ...sporociloONapaki, kosovNaVoljo: '', dbS: '' });
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
											setSporociloONapaki({ ...sporociloONapaki, kratekOpis: '', dbS: '' });
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
											if (isNaN(parseFloat(e.target.value))) {
												setSporociloONapaki({
													...sporociloONapaki,
													popust: 'Popust mora biti število',
												});
											} else if (parseFloat(e.target.value) - parseInt(e.target.value) !== 0) {
												setSporociloONapaki({
													...sporociloONapaki,
													popust: 'Popust mora biti celo število med 0 in 100',
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
												setSporociloONapaki({ ...sporociloONapaki, popust: '', dbS: '' });
											}
										} catch {
											setSporociloONapaki({
												...sporociloONapaki,
												popust: 'Napačen vnos popusta - mora biti število med 0 in 100',
											});
										}
									}}
									placeholder=''
									className='tekstovnoPolje'></input>
								{sporociloONapaki.popust === '' ? (
									<></>
								) : (
									<div className='sporociloONapaki'>{sporociloONapaki.popust}</div>
								)}
							</td>
						</tr>
					</tbody>
				</table>
				<button type='submit' className='posiljanje'>
					Vnesi
				</button>
				{sporociloONapaki.dbS !== null ? <div>{sporociloONapaki.dbS}</div> : <></>}
			</form>
		</div>
	);
};

export default DodajanjeIzdelkov;
