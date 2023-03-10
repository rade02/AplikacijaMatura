import axios from 'axios';
import {
	Pencil,
	Password,
	FloppyDisk,
	ClockCounterClockwise,
	SignOut,
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
import { UserContext } from '../../contexts/UserContext';
import NotificationCard from './NotificationCardComponent';
import UrediProfil from './UrediProfilC';
import Pregled from './PregledInDodajanja/PregledC';
import PodatkiOOsebi from './PregledInDodajanja/PodatkiOOsebiC';
import DodajanjeUporabnikov from './PregledInDodajanja/DodajanjeUporabnikovC';
import PregledRacunov from './PregledInDodajanja/PregledRacunovC';
import PregledIzdelkov from './PregledInDodajanja/PregledIzdelkovC';
import PregledNarocil from './PregledInDodajanja/PregledNarocilC';
import PregledPB from './PregledInDodajanja/PregledPBC';
import DodajanjeIzdelkov from './PregledInDodajanja/DodajanjeIzdelkovC';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Profile = () => {
	const PORT = 3005; // !!!
	const { user, setUser, setIsAuth } = useContext(UserContext);

	const [vloga, setVloga] = useState(null);
	const [msg, setMsg] = useState('');
	const [stanjeAdmin, setStanjeAdmin] = useState(0);
	const [prejsnjeStanjeAdmin, setPrejsnjeStanjeAdmin] = useState(0);
	const [tabela, setTabela] = useState(null);
	const [filterUporabniki, setFilterUporabniki] = useState(-1);
	const [oseba, setOseba] = useState(null); // podatki o osebi

	const [file, setFile] = useState(null); // za dodajanjeIzdelkov in FileUpload
	// ----------- fileupload -------------------
	const uploadFile = async (e, ID_izdelka) => {
		const formData = new FormData();
		formData.append('slika', file);
		formData.append('ID_izdelka', oseba.ID_izdelka);

		try {
			const res = await axios.post(`http://localhost:${PORT}/api/admin/naloziSliko`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			//console.log(res);
		} catch (ex) {
			console.log(ex);
		}
	};
	// ----------- fileupload -------------------

	// TODO: na domaci strani naredi okno ki se pojavi ob izbrisu profila
	// TODO: PREVERI CE JE VNOS PRAVILEN (int, date ...)
	// TODO: ne dela ce refreshamo na profile page in gremo nazaj na prijavo (isAuth se ponastavi, ostalo pa ne)
	// TODO: ne dela ce refreshamo - prikaze napacne
	// ce vnesemo nove podatke v prazno polje in nato pritisnemo Ponastavi, se ne izbriše vsebina
	useEffect(() => {
		const pridobiVlogo = async () => {
			try {
				let response = await axios.get(`http://localhost:${PORT}/api/login/vloga`, {
					params: {
						uporabnisko_ime: user.uporabnisko_ime,
					},
				});
				setVloga(parseInt(response.data));
			} catch (error) {
				console.log(error);
			}
		};
		pridobiVlogo();
	}, [user.uporabnisko_ime]);

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
					<NotificationCard />
					<div className='moznostiProfila'>
						<UrediProfil uporabnisko_ime={user.uporabnisko_ime} vloga={vloga} />
						<div className='funkcije'>
							<h4>Funkcije</h4>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(1);
								}}>
								<AddressBook size={22} style={{ marginRight: '5px' }} />
								<div>Pregled uporabnikov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(2);
								}}>
								<ChalkboardTeacher size={22} style={{ marginRight: '5px' }} />
								<div>Pregled oseb</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(3);
								}}>
								<UserPlus size={22} style={{ marginRight: '5px' }} />
								<div>Dodajanje uporabnikov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(4);
								}}>
								<ArchiveBox size={22} style={{ marginRight: '5px' }} />
								<div>Dodajanje izdelkov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(5);
								}}>
								<ListBullets size={22} style={{ marginRight: '5px' }} />
								<div>Pregled izdelkov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(7);
								}}>
								<MagnifyingGlass size={22} style={{ marginRight: '5px' }} />
								<div>Pregled naročil</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(6);
								}}>
								<FileText size={22} style={{ marginRight: '5px' }} />
								<div>Pregled računov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(8);
								}}>
								<Database size={22} style={{ marginRight: '5px' }} />
								<div>Upravljanje s PB</div>
							</button>
						</div>
					</div>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 1) {
			// pregled uporabnikov
			const pridobiInfoOUporabnikih = async () => {
				try {
					let r = await axios.get(`http://localhost:${PORT}/api/admin/uporabniki`);
					setTabela(r.data);
				} catch (error) {
					console.log('Prišlo je do napake');
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
						filter: filterUporabniki,
						setFilter: setFilterUporabniki,
						opcije: [
							{ ime: 'Vsi', vrednost: -1 },
							{ ime: 'Administratorji', vrednost: 0 },
							{ ime: 'Računovodje', vrednost: 3 },
							{ ime: 'Zaposleni', vrednost: 1 },
							{ ime: 'Stranke', vrednost: 2 },
						],
						setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
						stanjeAdmin: stanjeAdmin,
						setStanjeAdmin: setStanjeAdmin,
						setOseba: setOseba,
					}}
				/>
			);
		} else if (parseInt(stanjeAdmin) === 2) {
			// pregled oseb
			const pridobiInfoOOsebah = async () => {
				try {
					let r = await axios.get(`http://localhost:${PORT}/api/admin/osebe`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
				}
			};
			if (tabela === null) pridobiInfoOOsebah();
			return (
				<Pregled
					props={{
						naslov: 'Pregled oseb',
						naslovnaVrstica: ['ID', 'Uporabniško ime', 'Elektronski naslov', 'Ime', 'Priimek'],
						tabela: tabela,
						setTabela: setTabela,
						filter: filterUporabniki,
						setFilter: setFilterUporabniki,
						opcije: null,
						setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
						stanjeAdmin: stanjeAdmin,
						setStanjeAdmin: setStanjeAdmin,
						setOseba: setOseba,
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
						className='backBtn'
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
						file={file}
						setFile={setFile}
					/>
					<button
						className='backBtn'
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
					let r = await axios.get(`http://localhost:${PORT}/api/admin/izdelki`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					r.data.forEach(async (element) => {
						let res = await axios.get(`http://localhost:${PORT}/api/admin/pridobiSliko`, {
							method: 'get',
							responseType: 'blob',
							params: {
								ID_izdelka: element.ID_izdelka,
							},
						});
						if (res.data.size === 0) {
							element.slika = null;
						} else {
							element.slika = URL.createObjectURL(res.data);
						}
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
				}
			};

			if (tabela === null) {
				pridobiInfoOIzdelkih();
			}
			return (
				<>
					<PregledIzdelkov
						props={{
							naslov: 'Pregled izdelkov',
							naslovnaVrstica: ['ID', 'Ime', 'Kategorija', 'Cena za kos', 'Kosov', 'popust'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
						}}
					/>
					<button
						className='backBtn'
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
			// PREGLED RAČUNOV
			const pridobiInfoORacunih = async () => {
				try {
					let r = await axios.get(`http://localhost:${PORT}/api/admin/racuni`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
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
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
						}}
					/>
					<button
						className='backBtn'
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
					let r = await axios.get(`http://localhost:${PORT}/api/admin/narocila`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
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
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
							stranka: false,
						}}
					/>
					<button
						className='backBtn'
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
					let r = await axios.get(`http://localhost:${PORT}/api/admin/PBzacetna`);
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
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
							setOseba: setOseba,
						}}
					/>
					<button
						className='backBtn'
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
			var niIzbrisa = false;
			if (prejsnjeStanjeAdmin === 8) {
				niIzbrisa = true;
			}
			return (
				<PodatkiOOsebi
					niIzbrisa={niIzbrisa}
					file={file}
					setFile={setFile}
					uploadFile={uploadFile}
					stranka={false}
					oseba={oseba}
					setOseba={setOseba}
					prejsnjeStanjeAdmin={prejsnjeStanjeAdmin}
					setStanjeAdmin={setStanjeAdmin}
					tabela={tabela}
					setTabela={setTabela}
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
					<NotificationCard />
					<div className='moznostiProfila'>
						<UrediProfil uporabnisko_ime={user.uporabnisko_ime} vloga={vloga} />
						<div className='funkcije'>
							<h4>Funkcije</h4>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(1);
								}}>
								<ListDashes size={22} style={{ marginRight: '5px' }} />
								<div>Pregled naročil</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(3);
								}}>
								<FileText size={22} style={{ marginRight: '5px' }} />
								<div>Pregled računov</div>
							</button>
						</div>
					</div>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 1) {
			// PREGLED NAROČIL STRANKE
			const pridobiInfoONarocilih = async () => {
				try {
					let r1 = await axios.get(`http://localhost:${PORT}/api/admin/idUporabnika`, {
						params: {
							uporabnisko_ime: user.uporabnisko_ime,
						},
					});
					let r = await axios.get(`http://localhost:${PORT}/api/admin/narocila`, {
						params: {
							iskalniKriterij: 'ID_stranke',
							iskalniNiz: r1.data,
						},
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
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
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
							stranka: true,
							uporabnisko_ime: user.uporabnisko_ime,
						}}
					/>
					<button
						className='backBtn'
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
					let r = await axios.get(`http://localhost:${PORT}/api/admin/racuniUporabnika`, {
						params: { uporabnisko_ime: user.uporabnisko_ime },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
				}
			};
			if (tabela === null) pridobiRacuneUporabnika();
			return (
				<>
					<PregledRacunov
						props={{
							naslov: 'Pregled računov',
							naslovnaVrstica: ['ID', 'ID naročila', 'Kupec', 'Za plačilo', 'Plačano'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
						}}
					/>
					<button
						className='backBtn'
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
				<PodatkiOOsebi
					file={file}
					setFile={setFile}
					uploadFile={uploadFile}
					stranka={true}
					oseba={oseba}
					setOseba={setOseba}
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
					<NotificationCard />
					<div className='moznostiProfila'>
						<UrediProfil uporabnisko_ime={user.uporabnisko_ime} vloga={vloga} />
						<div className='funkcije'>
							<h4>Funkcije</h4>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(1);
								}}>
								<ArchiveBox size={22} style={{ marginRight: '5px' }} />
								<div>Dodajanje izdelkov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(2);
								}}>
								<ListBullets size={22} style={{ marginRight: '5px' }} />
								<div>Pregled izdelkov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(3);
								}}>
								<MagnifyingGlass size={22} style={{ marginRight: '5px' }} />
								<div>Pregled naročil</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(6);
								}}>
								<FileText size={22} style={{ marginRight: '5px' }} />
								<div>Pregled računov</div>
							</button>
						</div>
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
						file={file}
						setFile={setFile}
					/>
					<button
						className='backBtn'
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
					let r = await axios.get(`http://localhost:${PORT}/api/admin/izdelki`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
				}
			};
			if (tabela === null) pridobiInfoOIzdelkih();
			return (
				<>
					<PregledIzdelkov
						props={{
							naslov: 'Pregled izdelkov',
							naslovnaVrstica: ['ID', 'Ime', 'Kategorija', 'Cena za kos', 'Kosov', 'popust'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
						}}
					/>
					<button
						className='backBtn'
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
					let r = await axios.get(`http://localhost:${PORT}/api/admin/narocila`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
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
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
							stranka: false,
						}}
					/>
					<button
						className='backBtn'
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
			const pridobiInfoORacunih = async () => {
				try {
					let r = await axios.get(`http://localhost:${PORT}/api/admin/racuni`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
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
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
						}}
					/>
					<button
						className='backBtn'
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
				<PodatkiOOsebi
					file={file}
					setFile={setFile}
					uploadFile={uploadFile}
					stranka={false}
					oseba={oseba}
					setOseba={setOseba}
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
					<NotificationCard />
					<div className='moznostiProfila'>
						<UrediProfil uporabnisko_ime={user.uporabnisko_ime} vloga={vloga} />
						<div className='funkcije'>
							<h4>Funkcije</h4>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(5);
								}}>
								<ChalkboardTeacher size={22} style={{ marginRight: '5px' }} />
								<div>Pregled oseb</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(1);
								}}>
								<ArchiveBox size={22} style={{ marginRight: '5px' }} />
								<div>Dodajanje izdelkov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(2);
								}}>
								<ListBullets size={22} style={{ marginRight: '5px' }} />
								<div>Pregled izdelkov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(3);
								}}>
								<FileText size={22} style={{ marginRight: '5px' }} />
								<div>Pregled računov</div>
							</button>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(4);
								}}>
								<MagnifyingGlass size={22} style={{ marginRight: '5px' }} />
								<div>Pregled naročil</div>
							</button>
						</div>
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
						file={file}
						setFile={setFile}
					/>
					<button
						className='backBtn'
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
					let r = await axios.get(`http://localhost:${PORT}/api/admin/izdelki`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
				}
			};
			if (tabela === null) pridobiInfoOIzdelkih();
			return (
				<>
					<PregledIzdelkov
						props={{
							naslov: 'Pregled izdelkov',
							naslovnaVrstica: ['ID', 'Ime', 'Kategorija', 'Cena za kos', 'Kosov', 'popust'],
							tabela: tabela,
							setTabela: setTabela,
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
						}}
					/>
					<button
						className='backBtn'
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
					let r = await axios.get(`http://localhost:${PORT}/api/admin/racuni`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
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
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
						}}
					/>
					<button
						className='backBtn'
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
					let r = await axios.get(`http://localhost:${PORT}/api/admin/narocila`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
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
							filter: filterUporabniki,
							setFilter: setFilterUporabniki,
							setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
							stanjeAdmin: stanjeAdmin,
							setStanjeAdmin: setStanjeAdmin,
							setOseba: setOseba,
							stranka: false,
						}}
					/>
					<button
						className='backBtn'
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
			const pridobiInfoOOsebah = async () => {
				try {
					let r = await axios.get(`http://localhost:${PORT}/api/admin/osebe`, {
						params: { iskalniKriterij: 1, iskalniNiz: 1 },
					});
					setTabela(r.data);
				} catch (error) {
					console.log(`Prišlo je do napake: ${error}`);
				}
			};
			if (tabela === null) pridobiInfoOOsebah();
			return (
				<Pregled
					props={{
						naslov: 'Pregled oseb',
						naslovnaVrstica: ['ID', 'Uporabniško ime', 'Elektronski naslov', 'Ime', 'Priimek'],
						tabela: tabela,
						setTabela: setTabela,
						filter: filterUporabniki,
						setFilter: setFilterUporabniki,
						opcije: null,
						setPrejsnjeStanjeAdmin: setPrejsnjeStanjeAdmin,
						stanjeAdmin: stanjeAdmin,
						setStanjeAdmin: setStanjeAdmin,
						setOseba: setOseba,
					}}
				/>
			);
		} else if (parseInt(stanjeAdmin) === 9) {
			// prikazi osebo
			return (
				<PodatkiOOsebi
					file={file}
					setFile={setFile}
					uploadFile={uploadFile}
					stranka={true}
					oseba={oseba}
					setOseba={setOseba}
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
			let res;
			try {
				res = await axios.post(`http://localhost:${PORT}/api/login/vloga`, {
					uporabnisko_ime: user.uporabnisko_ime,
				});
			} catch (error) {
				res.data = 'Prišlo je do napake';
			}
			setVloga(2);
			setMsg(res.data);
		};

		posodobiVlogo();

		return (
			<>
				<div>Napaka pri prijavi (napačna vloga uporabnika)</div>
				<div>{msg}</div>
				<button
					className='backBtn'
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

export default Profile;
