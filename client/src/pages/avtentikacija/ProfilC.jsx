import axios from 'axios';
import {
	CaretCircleLeft,
	Database,
	MagnifyingGlass,
	AddressBook,
	ArchiveBox,
	ChalkboardTeacher,
	FileText,
	UserPlus,
	ListBullets,
	ListDashes,
} from 'phosphor-react';
import { useContext, useEffect, useState } from 'react';
import { UporabniskiKontekst } from '../../contexts/UporabniskiKontekst';
import Obvestilo from './ObvestiloC';
import UrejanjeProfila from './UrejanjeProfilaC';
import Pregled from './pregledi_in_dodajanja/PregledC';
import Podrobnosti from './pregledi_in_dodajanja/PodrobnostiC';
import DodajanjeUporabnikov from './pregledi_in_dodajanja/DodajanjeUporabnikovC';
import PregledRacunov from './pregledi_in_dodajanja/PregledRacunovC';
import PregledNarocil from './pregledi_in_dodajanja/PregledNarocilC';
import PregledPB from './pregledi_in_dodajanja/PregledPBC';
import DodajanjeIzdelkov from './pregledi_in_dodajanja/DodajanjeIzdelkovC';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Profil = () => {
	const { uporabnik } = useContext(UporabniskiKontekst);
	const [vloga, setVloga] = useState(null);
	const [sporocilo, setSporocilo] = useState('');
	const [stanjeAdmin, setStanjeAdmin] = useState(0);
	const [prejsnjeStanjeAdmin, setPrejsnjeStanjeAdmin] = useState(0);
	const [tabela, setTabela] = useState(null);
	const [filter, setFilter] = useState(-1);
	const [predmet, setPredmet] = useState(null); // podatki o osebi
	const [datoteka, setDatoteka] = useState(null); // za dodajanjeIzdelkov in datotekaUpload
	const [SQLstavek, setSQLstavek] = useState(null);
	const [glava, setGlava] = useState([]);
	const [spreminjanjeAliBrisanje, setSpreminjanjeAliBrisanje] = useState(false);

	const naloziDatoteko = async (e, ID_izdelka) => {
		const podatki = new FormData();
		podatki.append('slika', datoteka);
		podatki.append('ID_izdelka', predmet.ID_izdelka);

		try {
			await axios.post(`http://localhost:${global.config.port}/api/administrator/naloziSliko`, podatki, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		} catch (napaka) {
			console.log(napaka);
		}
	};

	useEffect(() => {
		const pridobiVlogo = async () => {
			try {
				let odziv = await axios.get(`http://localhost:${global.config.port}/api/avtentikacija/vloga`, {
					params: {
						uporabnisko_ime: uporabnik.uporabnisko_ime,
					},
				});
				setVloga(parseInt(odziv.data));
			} catch (napaka) {
				console.log(napaka);
			}
		};
		pridobiVlogo();
	}, [uporabnik.uporabnisko_ime]);

	if (vloga === null) {
		// pridobivanje vloge profila
		return (
			<>
				<label>Nalaganje profila ...</label>
				<Box sx={{ display: 'flex' }} className='nalaganje'>
					<CircularProgress color='inherit' />
				</Box>
			</>
		);
	}
	// ################################################ ADMIN ######################################################
	else if (parseInt(vloga) === 0) {
		// admin
		if (parseInt(stanjeAdmin) === 0) {
			return (
				<>
					<Obvestilo besedilo={'Pozdravljeni admin'} />
					<h2>
						Profil: {uporabnik.uporabnisko_ime}{' '}
						{vloga !== 2
							? vloga === 0
								? '(administrator)'
								: vloga === 1
								? '(zaposleni)'
								: vloga === 3
								? '(računovodja)'
								: ''
							: ''}
					</h2>
					<div className='moznostiProfila'>
						{spreminjanjeAliBrisanje ? (
							<></>
						) : (
							<div className='funkcije'>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(1);
									}}>
									<AddressBook size={22} style={{ marginRight: '5px' }} />
									<div>Pregled uporabnikov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(2);
									}}>
									<ChalkboardTeacher size={22} style={{ marginRight: '5px' }} />
									<div>Pregled oseb</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(3);
									}}>
									<UserPlus size={22} style={{ marginRight: '5px' }} />
									<div>Dodajanje uporabnikov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(4);
									}}>
									<ArchiveBox size={22} style={{ marginRight: '5px' }} />
									<div>Dodajanje izdelkov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(5);
									}}>
									<ListBullets size={22} style={{ marginRight: '5px' }} />
									<div>Pregled izdelkov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(7);
									}}>
									<MagnifyingGlass size={22} style={{ marginRight: '5px' }} />
									<div>Pregled naročil</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(6);
									}}>
									<FileText size={22} style={{ marginRight: '5px' }} />
									<div>Pregled računov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(8);
									}}>
									<Database size={22} style={{ marginRight: '5px' }} />
									<div>Upravljanje s PB</div>
								</button>
							</div>
						)}
						<UrejanjeProfila vloga={vloga} setSpreminjanjeAliBrisanje={setSpreminjanjeAliBrisanje} />
					</div>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 1) {
			// pregled uporabnikov
			const pridobiInfoOUporabnikih = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/uporabniki`
					);
					setTabela(odziv.data);
				} catch (napaka) {
					console.log('Prišlo je do napake');
					console.log(napaka);
				}
			};
			if (tabela === null) pridobiInfoOUporabnikih();
			return (
				<Pregled
					props={{
						naslov: 'Pregled uporabnikov',
						naslovnaVrstica: ['Uporabniško ime', 'Geslo', 'Vloga', 'Omogocen', 'Spremeni'],
						tabela: tabela,
						setTabela: setTabela,
						filter: filter,
						setFilter: setFilter,
						moznosti: [
							{ ime: 'Vsi', vrednost: -1 },
							{ ime: 'Administratorji', vrednost: 0 },
							{ ime: 'Računovodje', vrednost: 3 },
							{ ime: 'Zaposleni', vrednost: 1 },
							{ ime: 'Stranke', vrednost: 2 },
						],
						setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
						stanjeAdmin: stanjeAdmin,
						setStanjeAdmin: setStanjeAdmin,
						setPredmet: setPredmet,
					}}
				/>
			);
		} else if (parseInt(stanjeAdmin) === 2) {
			// pregled oseb
			const pridobiInfoOpredmeth = async () => {
				try {
					let odziv = await axios.get(`http://localhost:${global.config.port}/api/administrator/osebe`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(odziv.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
				}
			};
			if (tabela === null) pridobiInfoOpredmeth();
			return (
				<Pregled
					props={{
						naslov: 'Pregled oseb',
						naslovnaVrstica: ['ID', 'Uporabniško ime', 'Elektronski naslov', 'Ime', 'Priimek'],
						tabela: tabela,
						setTabela: setTabela,
						filter: filter,
						setFilter: setFilter,
						moznosti: null,
						setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
						stanjeAdmin: stanjeAdmin,
						setStanjeAdmin: setStanjeAdmin,
						setPredmet: setPredmet,
					}}
				/>
			);
		} else if (parseInt(stanjeAdmin) === 3) {
			return (
				<>
					<DodajanjeUporabnikov
						props={{
							naslov: 'Dodajanje uporabnikov',
							setStanjeAdmin: setStanjeAdmin,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 4) {
			// DODAJANJE IZDELKOV
			return (
				<>
					<DodajanjeIzdelkov
						props={{
							naslov: 'Dodajanje izdelkov',
							setStanjeAdmin: setStanjeAdmin,
						}}
						datoteka={datoteka}
						setDatoteka={setDatoteka}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 5) {
			// PREGLED IZDELKOV
			const pridobiInfoOIzdelkih = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/izdelki`,
						{
							params: { iskalniKriterij: 1, iskalniNiz: 1 },
						}
					);
					odziv.data.forEach(async (element) => {
						let odziv1 = await axios.get(
							`http://localhost:${global.config.port}/api/administrator/pridobiSliko`,
							{
								method: 'get',
								responseType: 'blob',
								params: {
									ID_izdelka: element.ID_izdelka,
								},
							}
						);
						if (odziv1.data.size === 0) {
							element.slika = null;
						} else {
							element.slika = URL.createObjectURL(odziv1.data);
						}
					});
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};

			if (tabela === null) {
				pridobiInfoOIzdelkih();
			}

			return (
				<>
					<Pregled
						props={{
							naslov: 'Pregled izdelkov',
							naslovnaVrstica: ['ID', 'Ime', 'Kategorija', 'Cena za kos', 'Kosov', 'popust'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
						}}
					/>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 6) {
			// PREGLED RAČUNOV
			const pridobiInfoORacunih = async () => {
				try {
					let odziv = await axios.get(`http://localhost:${global.config.port}/api/administrator/racuni`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiInfoORacunih();
			return (
				<>
					<PregledRacunov
						props={{
							naslov: 'Pregled računov',
							naslovnaVrstica: ['ID', 'ID naročila', 'Kupec', 'Za plačilo', 'Datum izdaje'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
							jeStranka: false,
							uporabnik: uporabnik.uporabnisko_ime,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 7) {
			// PREGLED NAROČIL
			const pridobiInfoONarocilih = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/narocila`,
						{
							params: { iskalniKriterij: 1, iskalniNiz: 1 },
						}
					);
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiInfoONarocilih();
			return (
				<>
					<PregledNarocil
						props={{
							naslov: 'Pregled naročil',
							naslovnaVrstica: [
								'ID',
								'Datum',
								'ID stranke',
								'Opravljeno',
								'Ime stranke',
								'Priimek stranke',
								'Naslov dostave',
							],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
							jeStranka: false,
							uporabnik: uporabnik.uporabnisko_ime,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 8) {
			const pridobiInfoOPB = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/PBzacetna`
					);
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiInfoOPB();
			return (
				<>
					<PregledPB
						props={{
							naslov: 'Upravljanje z bazo podatkov',
							naslovnaVrstica: ['tabele'],
							tabela: tabela,
							setTabela: setTabela,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
							setFilter: setFilter,
							jeStranka: false,
							SQLstavek: SQLstavek,
							setSQLstavek: setSQLstavek,
							glava: glava,
							setGlava: setGlava,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
							setSQLstavek(null);
							setGlava([]);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 9) {
			// prikazi osebo
			var niIzbrisa = false;
			if (prejsnjeStanjeAdmin === 8) {
				niIzbrisa = true;
			}
			return (
				<Podrobnosti
					niIzbrisa={niIzbrisa}
					setDatoteka={setDatoteka}
					naloziDatoteko={naloziDatoteko}
					jeStranka={false}
					predmet={predmet}
					prejsnjeStanjeAdmin={prejsnjeStanjeAdmin}
					setStanjeAdmin={setStanjeAdmin}
					tabela={tabela}
					setTabela={setTabela}
					SQLstavek={SQLstavek}
				/>
			);
		}
	}
	// ################################################ STRANKA ######################################################
	else if (parseInt(vloga) === 2) {
		// stranka
		if (parseInt(stanjeAdmin) === 0) {
			return (
				<>
					<Obvestilo besedilo={'Pozdravljena stranka'} />
					<h2>
						Profil: {uporabnik.uporabnisko_ime}{' '}
						{vloga !== 2
							? vloga === 0
								? '(administrator)'
								: vloga === 1
								? '(zaposleni)'
								: vloga === 3
								? '(računovodja)'
								: ''
							: ''}
					</h2>
					<div className='moznostiProfila'>
						{spreminjanjeAliBrisanje ? (
							<></>
						) : (
							<div className='funkcije'>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(1);
									}}>
									<ListDashes size={22} style={{ marginRight: '5px' }} />
									<div>Pregled naročil</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(3);
									}}>
									<FileText size={22} style={{ marginRight: '5px' }} />
									<div>Pregled računov</div>
								</button>
							</div>
						)}
						<UrejanjeProfila vloga={vloga} setSpreminjanjeAliBrisanje={setSpreminjanjeAliBrisanje} />
					</div>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 1) {
			// PREGLED NAROČIL STRANKE
			const pridobiInfoONarocilih = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/idUporabnika`,
						{
							params: {
								uporabnisko_ime: uporabnik.uporabnisko_ime,
							},
						}
					);
					let odziv1 = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/narocila`,
						{
							params: {
								iskalniKriterij: 'ID_stranke',
								iskalniNiz: odziv.data,
							},
						}
					);
					setTabela(odziv1.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};

			if (tabela === null) pridobiInfoONarocilih();
			return (
				<>
					<PregledNarocil
						props={{
							naslov: 'Pregled naročil',
							naslovnaVrstica: [
								'ID',
								'Datum',
								'ID stranke',
								'Opravljeno',
								'Ime stranke',
								'Priimek stranke',
								'Naslov dostave',
							],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
							jeStranka: true,
							uporabnik: uporabnik.uporabnisko_ime,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 3) {
			// PREGLED RAČUNOV STRANKE
			const pridobiRacuneUporabnika = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/racuniUporabnika`,
						{
							params: { uporabnisko_ime: uporabnik.uporabnisko_ime },
						}
					);
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiRacuneUporabnika();
			return (
				<>
					<PregledRacunov
						props={{
							naslov: 'Pregled računov',
							naslovnaVrstica: ['ID', 'ID naročila', 'Kupec', 'Za plačilo', 'Datum izdaje'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
							jeStranka: true,
							uporabnik: uporabnik.uporabnisko_ime,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 9) {
			// prikazi osebo
			return (
				<Podrobnosti
					setDatoteka={setDatoteka}
					naloziDatoteko={naloziDatoteko}
					jeStranka={true}
					predmet={predmet}
					prejsnjeStanjeAdmin={prejsnjeStanjeAdmin}
					setStanjeAdmin={setStanjeAdmin}
					tabela={tabela}
					setTabela={setTabela}
				/>
			);
		}
	}
	// ################################################ ZAPOSLENI ######################################################
	else if (parseInt(vloga) === 1) {
		// zaposleni
		if (parseInt(stanjeAdmin) === 0) {
			return (
				<>
					<Obvestilo besedilo={'Pozdravljen zaposleni'} />
					<h2>
						Profil: {uporabnik.uporabnisko_ime}{' '}
						{vloga !== 2
							? vloga === 0
								? '(administrator)'
								: vloga === 1
								? '(zaposleni)'
								: vloga === 3
								? '(računovodja)'
								: ''
							: ''}
					</h2>
					<div className='moznostiProfila'>
						{spreminjanjeAliBrisanje ? (
							<></>
						) : (
							<div className='funkcije'>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(1);
									}}>
									<ArchiveBox size={22} style={{ marginRight: '5px' }} />
									<div>Dodajanje izdelkov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(2);
									}}>
									<ListBullets size={22} style={{ marginRight: '5px' }} />
									<div>Pregled izdelkov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(3);
									}}>
									<MagnifyingGlass size={22} style={{ marginRight: '5px' }} />
									<div>Pregled naročil</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(6);
									}}>
									<FileText size={22} style={{ marginRight: '5px' }} />
									<div>Pregled računov</div>
								</button>
							</div>
						)}
						<UrejanjeProfila vloga={vloga} setSpreminjanjeAliBrisanje={setSpreminjanjeAliBrisanje} />
					</div>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 1) {
			// DODAJANJE IZDELKOV
			return (
				<>
					<DodajanjeIzdelkov
						props={{
							naslov: 'Dodajanje izdelkov',
							setStanjeAdmin: setStanjeAdmin,
						}}
						datoteka={datoteka}
						setDatoteka={setDatoteka}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 2) {
			// PREGLED IZDELKOV
			const pridobiInfoOIzdelkih = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/izdelki`,
						{
							params: { iskalniKriterij: 1, iskalniNiz: 1 },
						}
					);
					odziv.data.forEach(async (element) => {
						let odziv1 = await axios.get(
							`http://localhost:${global.config.port}/api/administrator/pridobiSliko`,
							{
								method: 'get',
								responseType: 'blob',
								params: {
									ID_izdelka: element.ID_izdelka,
								},
							}
						);
						if (odziv1.data.size === 0) {
							element.slika = null;
						} else {
							element.slika = URL.createObjectURL(odziv1.data);
						}
					});
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiInfoOIzdelkih();
			return (
				<>
					<Pregled
						props={{
							naslov: 'Pregled izdelkov',
							naslovnaVrstica: ['ID', 'Ime', 'Kategorija', 'Cena za kos', 'Kosov', 'popust'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 3) {
			// PREGLED NAROČIL
			const pridobiInfoONarocilih = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/narocila`,
						{
							params: { iskalniKriterij: 1, iskalniNiz: 1 },
						}
					);
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiInfoONarocilih();
			return (
				<>
					<PregledNarocil
						props={{
							naslov: 'Pregled naročil',
							naslovnaVrstica: [
								'ID',
								'Datum',
								'ID stranke',
								'Opravljeno',
								'Ime stranke',
								'Priimek stranke',
								'Naslov dostave',
							],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
							jeStranka: false,
							uporabnik: uporabnik.uporabnisko_ime,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 6) {
			// PREGLED RAČUNOV ZAPOSLENEGA
			const pridobiRacuneUporabnika = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/racuniUporabnika`,
						{
							params: { uporabnisko_ime: uporabnik.uporabnisko_ime },
						}
					);
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiRacuneUporabnika();
			return (
				<>
					<PregledRacunov
						props={{
							naslov: 'Pregled računov',
							naslovnaVrstica: ['ID', 'ID naročila', 'Kupec', 'Za plačilo', 'Datum izdaje'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
							jeStranka: true,
							uporabnik: uporabnik.uporabnisko_ime,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 9) {
			// prikazi osebo
			return (
				<Podrobnosti
					setDatoteka={setDatoteka}
					naloziDatoteko={naloziDatoteko}
					jeStranka={true}
					predmet={predmet}
					prejsnjeStanjeAdmin={prejsnjeStanjeAdmin}
					setStanjeAdmin={setStanjeAdmin}
					tabela={tabela}
					setTabela={setTabela}
				/>
			);
		}
	}
	// ################################################ RAČUNOVODJA ######################################################
	else if (parseInt(vloga) === 3) {
		// računovodja
		if (parseInt(stanjeAdmin) === 0) {
			return (
				<>
					<Obvestilo />
					<h2>
						Profil: {uporabnik.uporabnisko_ime}{' '}
						{vloga !== 2
							? vloga === 0
								? '(administrator)'
								: vloga === 1
								? '(zaposleni)'
								: vloga === 3
								? '(računovodja)'
								: ''
							: ''}
					</h2>
					<div className='moznostiProfila'>
						{spreminjanjeAliBrisanje ? (
							<></>
						) : (
							<div className='funkcije'>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(5);
									}}>
									<ChalkboardTeacher size={22} style={{ marginRight: '5px' }} />
									<div>Pregled oseb</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(1);
									}}>
									<ArchiveBox size={22} style={{ marginRight: '5px' }} />
									<div>Dodajanje izdelkov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(2);
									}}>
									<ListBullets size={22} style={{ marginRight: '5px' }} />
									<div>Pregled izdelkov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(3);
									}}>
									<FileText size={22} style={{ marginRight: '5px' }} />
									<div>Pregled računov</div>
								</button>
								<button
									className='gumbZaFunkcije'
									onClick={(e) => {
										e.preventDefault();
										setStanjeAdmin(4);
									}}>
									<MagnifyingGlass size={22} style={{ marginRight: '5px' }} />
									<div>Pregled naročil</div>
								</button>
							</div>
						)}
						<UrejanjeProfila vloga={vloga} setSpreminjanjeAliBrisanje={setSpreminjanjeAliBrisanje} />
					</div>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 1) {
			// DODAJANJE IZDELKOV
			return (
				<>
					<DodajanjeIzdelkov
						props={{
							naslov: 'Dodajanje izdelkov',
							setStanjeAdmin: setStanjeAdmin,
						}}
						datoteka={datoteka}
						setDatoteka={setDatoteka}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 2) {
			// PREGLED IZDELKOV
			const pridobiInfoOIzdelkih = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/izdelki`,
						{
							params: { iskalniKriterij: 1, iskalniNiz: 1 },
						}
					);
					odziv.data.forEach(async (element) => {
						let odziv1 = await axios.get(
							`http://localhost:${global.config.port}/api/administrator/pridobiSliko`,
							{
								method: 'get',
								responseType: 'blob',
								params: {
									ID_izdelka: element.ID_izdelka,
								},
							}
						);
						if (odziv1.data.size === 0) {
							element.slika = null;
						} else {
							element.slika = URL.createObjectURL(odziv1.data);
						}
					});
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiInfoOIzdelkih();
			return (
				<>
					<Pregled
						props={{
							naslov: 'Pregled izdelkov',
							naslovnaVrstica: ['ID', 'Ime', 'Kategorija', 'Cena za kos', 'Kosov', 'popust'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 3) {
			// PREGLED RAČUNOV
			const pridobiInfoORacunih = async () => {
				try {
					let odziv = await axios.get(`http://localhost:${global.config.port}/api/administrator/racuni`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiInfoORacunih();
			return (
				<>
					<PregledRacunov
						props={{
							naslov: 'Pregled računov',
							naslovnaVrstica: ['ID', 'ID naročila', 'Kupec', 'Za plačilo', 'Plačano'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
							jeStranka: false,
							uporabnik: uporabnik.uporabnisko_ime,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 4) {
			// PREGLED NAROČIL
			const pridobiInfoONarocilih = async () => {
				try {
					let odziv = await axios.get(
						`http://localhost:${global.config.port}/api/administrator/narocila`,
						{
							params: { iskalniKriterij: 1, iskalniNiz: 1 },
						}
					);
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiInfoONarocilih();
			return (
				<>
					<PregledNarocil
						props={{
							naslov: 'Pregled naročil',
							naslovnaVrstica: [
								'ID',
								'Datum',
								'ID stranke',
								'Opravljeno',
								'Ime stranke',
								'Priimek stranke',
								'Naslov dostave',
							],
							tabela: tabela,
							setTabela: setTabela,
							filter: filter,
							setFilter: setFilter,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setPredmet: setPredmet,
							jeStranka: false,
							uporabnik: uporabnik.uporabnisko_ime,
						}}
					/>
					<button
						className='gumbNazaj'
						onClick={(e) => {
							e.preventDefault();
							setStanjeAdmin(0);
							setTabela(null);
						}}>
						<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
						<div>Nazaj</div>
					</button>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 5) {
			// pregled oseb
			const pridobiInfoOpredmeth = async () => {
				try {
					let odziv = await axios.get(`http://localhost:${global.config.port}/api/administrator/osebe`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(odziv.data);
				} catch (napaka) {
					console.log(`Prišlo je do napake: ${napaka}`);
				}
			};
			if (tabela === null) pridobiInfoOpredmeth();
			return (
				<Pregled
					props={{
						naslov: 'Pregled oseb',
						naslovnaVrstica: ['ID', 'Uporabniško ime', 'Elektronski naslov', 'Ime', 'Priimek'],
						tabela: tabela,
						setTabela: setTabela,
						filter: filter,
						setFilter: setFilter,
						moznosti: null,
						setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
						stanjeAdmin: stanjeAdmin,
						setStanjeAdmin: setStanjeAdmin,
						setPredmet: setPredmet,
					}}
				/>
			);
		} else if (parseInt(stanjeAdmin) === 9) {
			// prikazi osebo
			return (
				<Podrobnosti
					setDatoteka={setDatoteka}
					naloziDatoteko={naloziDatoteko}
					jeStranka={true}
					predmet={predmet}
					prejsnjeStanjeAdmin={prejsnjeStanjeAdmin}
					setStanjeAdmin={setStanjeAdmin}
					tabela={tabela}
					setTabela={setTabela}
				/>
			);
		}
	}
	// ################################################ NAPAČNA VLOGA ######################################################
	else {
		// napacna vloga (profilu dodamo vlogo stranke)
		const posodobiVlogo = async () => {
			let odziv;
			try {
				odziv = await axios.post(`http://localhost:${global.config.port}/api/avtentikacija/vloga`, {
					uporabnisko_ime: uporabnik.uporabnisko_ime,
				});
			} catch (error) {
				odziv.data = 'Prišlo je do napake';
			}
			setVloga(2);
			setSporocilo(odziv.data);
		};

		posodobiVlogo();

		return (
			<>
				<div>Napaka pri prijavi (napačna vloga uporabnika)</div>
				<div>{sporocilo}</div>
				<button
					className='gumbNazaj'
					onClick={(e) => {
						e.preventDefault();
						setStanjeAdmin(0);
						setTabela(null);
					}}>
					<CaretCircleLeft size={25} style={{ marginRight: '5px' }} />
					<div>Nazaj</div>
				</button>
			</>
		);
	}
};

export default Profil;
