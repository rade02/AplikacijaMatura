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

const Profile = () => {
	const PORT = 3005; // !!!
	const { user, setUser, setIsAuth } = useContext(UserContext);

	const [vloga, setVloga] = useState(null);
	const [msg, setMsg] = useState('');
	const [stanjeAdmin, setStanjeAdmin] = useState(0);
	const [prejsnjeStanjeAdmin, setPrejsnjeStanjeAdmin] = useState(0);
	const [tabela, setTabela] = useState(null);
	const [filterUporabniki, setFilterUporabniki] = useState(-1);
	// TODO: ime je link in lahko si ogledamo vse podatke ki so shranjeni v bazi o osebah
	const [oseba, setOseba] = useState(null); // podatki o osebi

	// TODO: na domaci strani naredi okno ki se pojavi ob izbrisu profila
	// TODO: PREVERI CE JE VNOS PRAVILEN (int, date ...)
	// TODO: ne dela ce refreshamo na profile page in gremo nazaj na prijavo (isAuth se ponastavi, ostalo pa ne)
	// TODO: ne dela ce refreshamo - prikaze napacne podatke
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
		return <>Nalaganje profila ...</>;
	} else if (parseInt(vloga) === 0) {
		// admin
		if (parseInt(stanjeAdmin) === 0) {
			return (
				<>
					<NotificationCard />
					<div className='moznostiProfila'>
						<UrediProfil uporabnisko_ime={user.uporabnisko_ime} vloga={vloga} />
						<div className='funkcije'>
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
							naslovnaVrstica: ['ID', 'Datum', 'ID stranke', 'Opravljeno'],
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
			return (
				<PodatkiOOsebi
					oseba={oseba}
					prejsnjeStanjeAdmin={prejsnjeStanjeAdmin}
					setStanjeAdmin={setStanjeAdmin}
					tabela={tabela}
					setTabela={setTabela}
				/>
			);
		}
	} else if (parseInt(vloga) === 2) {
		// stranka
		if (parseInt(stanjeAdmin) === 0) {
			return (
				<>
					<NotificationCard />
					<div className='moznostiProfila'>
						<UrediProfil uporabnisko_ime={user.uporabnisko_ime} vloga={vloga} />
						<div className='funkcije'>
							<button
								className='actionBtn'
								onClick={(e) => {
									e.preventDefault();
									setStanjeAdmin(1);
								}}>
								<ListDashes size={22} style={{ marginRight: '5px' }} />
								<div>Pregled naročil</div>
							</button>
						</div>
					</div>
				</>
			);
		} else if (parseInt(stanjeAdmin) === 1) {
			// PREGLED NAROČIL STRANKE
			const pridobiIDuporabnika = async () => {
				try {
					let r = await axios.get(`http://localhost:${PORT}/api/admin/idUporabnika`, {
						params: { uporabnisko_ime: user.uporabnisko_ime },
					});
					return r.data;
				} catch (error) {
					console.log('Prišlo je do napake');
				}
			};
			const pridobiInfoONarocilih = async () => {
				try {
					let r = await axios.get(`http://localhost:${PORT}/api/admin/narocila`, {
						params: { iskalniKriterij: 'ID_stranke', iskalniNiz: await pridobiIDuporabnika() },
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
							naslovnaVrstica: ['ID', 'Datum', 'ID stranke', 'Opravljeno'],
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
		} else if (parseInt(stanjeAdmin) === 9) {
			// prikazi osebo
			return (
				<PodatkiOOsebi
					oseba={oseba}
					prejsnjeStanjeAdmin={prejsnjeStanjeAdmin}
					setStanjeAdmin={setStanjeAdmin}
					tabela={tabela}
					setTabela={setTabela}
				/>
			);
		}
	} else if (parseInt(vloga) === 1) {
		// zaposleni
		if (parseInt(stanjeAdmin) === 0) {
			return (
				<>
					<NotificationCard />
					<div className='moznostiProfila'>
						<UrediProfil uporabnisko_ime={user.uporabnisko_ime} vloga={vloga} />
						<div className='funkcije'>
							<label>Funkcije</label>
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
							naslovnaVrstica: ['ID', 'Datum', 'ID stranke', 'Opravljeno'],
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
		} else if (parseInt(stanjeAdmin) === 9) {
			// prikazi osebo
			return (
				<PodatkiOOsebi
					oseba={oseba}
					prejsnjeStanjeAdmin={prejsnjeStanjeAdmin}
					setStanjeAdmin={setStanjeAdmin}
					tabela={tabela}
					setTabela={setTabela}
				/>
			);
		}
	} else if (parseInt(vloga) === 3) {
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
							naslovnaVrstica: [
								'ID',
								'ID naročila',
								'Kupec',
								'Prejemnik',
								'Datum valute',
								'Za plačilo',
								'Plačano',
							],
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
							naslovnaVrstica: ['ID', 'Datum', 'ID stranke', 'Opravljeno'],
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
					oseba={oseba}
					prejsnjeStanjeAdmin={prejsnjeStanjeAdmin}
					setStanjeAdmin={setStanjeAdmin}
					tabela={tabela}
					setTabela={setTabela}
				/>
			);
		}
	} else {
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
