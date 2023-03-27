import axios from 'axios';
import { CircleWavyCheck, UserCircleMinus, XCircle, UserCirclePlus } from 'phosphor-react';
import '../Avtentikacija.css';

const TabelskaVrstica = ({ props }) => {
	if (props.naslov === 'Pregled oseb') {
		return (
			<tr
				key={props.element.uporabnisko_ime}
				className='vrstica'
				onClick={(e) => {
					e.preventDefault();
					props.setPredmet(props.element);
					props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
					props.setStanjeAdmin(9);
				}}>
				<td>{props.element.ID}</td>
				<td>{props.element.uporabnisko_ime}</td>
				<td>{props.element.elektronski_naslov}</td>
				<td>{props.element.ime}</td>
				<td>{props.element.priimek}</td>
			</tr>
		);
	} else if (props.naslov === 'Pregled računov') {
		return (
			<tr
				key={props.element.ID_racuna}
				className='vrstica'
				onClick={(e) => {
					e.preventDefault();
					props.setPredmet(props.element);
					props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
					props.setStanjeAdmin(9);
				}}>
				<td>{props.element.ID_racuna}</td>
				<td>{props.element.ID_narocila}</td>
				<td>{props.element.kupec}</td>
				<td>{props.element.za_placilo}</td>
				<td>{props.element.datumIzdaje}</td>
			</tr>
		);
	} else if (props.naslov === 'Pregled izdelkov') {
		return (
			<tr
				key={props.element.ID_izdelka}
				className='vrstica'
				onClick={(e) => {
					e.preventDefault();
					props.setPredmet(props.element);
					props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
					props.setStanjeAdmin(9);
				}}>
				<td>{props.element.ID_izdelka}</td>
				<td>{props.element.ime}</td>
				<td>{props.element.kategorija}</td>
				<td>{props.element.cena_za_kos}</td>
				<td>{props.element.kosov_na_voljo}</td>
				<td>{props.element.popust}</td>
			</tr>
		);
	} else if (props.naslov === 'Pregled naročil') {
		const pridobiIzdelke = async (IDNarocila) => {
			try {
				let rezultat = await axios.get(
					`http://localhost:${global.config.port}/api/administrator/izdelkiPriNarocilu`,
					{
						params: { ID_narocila: IDNarocila },
					}
				);
				props.setTabela(rezultat.data);
			} catch (napaka) {
				console.log(`Prišlo je do napake: ${napaka}`);
			}
		};

		return (
			<tr
				key={props.element.ID_narocila}
				className='vrstica'
				onClick={async (e) => {
					e.preventDefault();
					props.setPredmet(props.element);
					await pridobiIzdelke(props.element.ID_narocila);
					props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
					props.setStanjeAdmin(9);
				}}>
				<td>{props.element.ID_narocila}</td>
				<td>{props.element.datum}</td>
				<td>{props.element.ID_stranke}</td>
				<td>{props.element.opravljeno}</td>
				<td>{props.element.imeStranke}</td>
				<td>{props.element.priimekStranke}</td>
				<td>{props.element.naslovDostave}</td>
			</tr>
		);
	} else if (props.naslov === 'Upravljanje z bazo podatkov') {
		return (
			<tr
				key={props.element}
				className='vrstica'
				onClick={(e) => {
					e.preventDefault();
					props.setPredmet(props.element);
					props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
					props.setStanjeAdmin(9);
				}}>
				{Object.keys(props.element).map((key) => {
					if (key === 'slika') {
						return <td></td>;
					}
					return <td>{props.element[key]}</td>;
				})}
			</tr>
		);
	}
	return (
		<tr
			key={props.element.uporabnisko_ime}
			className='vrstica'
			onClick={(e) => {
				e.preventDefault();
				props.setPredmet(props.element);
				props.setPrejsnjeStanjeAdmin(props.stanjeAdmin);
				props.setStanjeAdmin(9);
			}}>
			<td>{props.element.uporabnisko_ime}</td>
			<td>{props.element.geslo}</td>
			<td
				className={
					props.element.vloga === 0
						? 'admin'
						: props.element.vloga === 3
						? 'racunovodja'
						: props.element.vloga === 1
						? 'zaposleni'
						: 'stranka'
				}>
				<div>
					<input
						disabled={props.element.uporabnisko_ime === 'admin' ? 'disabled' : ''} // komu ne moremo spremeniti vloge
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onChange={async (e) => {
							e.preventDefault();
							e.stopPropagation();
							if (e.target.value !== '' && typeof parseInt(e.target.value) === 'number') {
								try {
									let odziv = await axios.post(
										`http://localhost:${global.config.port}/api/administrator/updtVloga`,
										{
											uporabnisko_ime: props.element.uporabnisko_ime,
											vloga: e.target.value,
										}
									);
									if (odziv.data === 'success') props.setTabela(null);
								} catch (napaka) {
									console.log(napaka);
								}
							}
						}}
						type='text'
						defaultValue={props.element.vloga}
						maxLength='1'></input>
					<div>
						{props.element.vloga === 0
							? '(admin)'
							: props.element.vloga === 3
							? '(racunovodja)'
							: props.element.vloga === 1
							? '(zaposleni)'
							: '(stranka)'}
					</div>
				</div>
			</td>
			{props.element.omogocen === 1 ? (
				<>
					<td>
						<CircleWavyCheck size={22} style={{ color: 'greenyellow' }} />
						Omogočen
					</td>
					{props.element.vloga !== 0 ? (
						<td
							className='omogocanje'
							onClick={async (e) => {
								e.preventDefault();
								e.stopPropagation();
								try {
									let rezultat = await axios.post(
										`http://localhost:${global.config.port}/api/administrator/omogoci`,
										{
											uporabnisko_ime: props.element.uporabnisko_ime,
											omogoci: !props.element.omogocen,
										}
									);
									if (rezultat.data === 'success') props.setTabela(null);
								} catch (napaka) {
									console.log(napaka);
								}
							}}>
							<UserCircleMinus size={22} />
							Onemogoči
						</td>
					) : (
						<td style={{ textAlign: 'center' }}>/</td>
					)}
				</>
			) : props.element.omogocen === 0 ? (
				<>
					<td>
						<XCircle size={22} />
						Onemogočen
					</td>
					<td
						className='omogocanje'
						onClick={async (e) => {
							e.preventDefault();
							e.stopPropagation();
							try {
								let odziv = await axios.post(
									`http://localhost:${global.config.port}/api/administrator/omogoci`,
									{
										uporabnisko_ime: props.element.uporabnisko_ime,
										omogoci: !props.element.omogocen,
									}
								);
								if (odziv.data === 'success') props.setTabela(null);
							} catch (napaka) {
								console.log(napaka);
							}
						}}>
						<UserCirclePlus size={22} />
						Omogoči
					</td>
				</>
			) : (
				<></>
			)}
		</tr>
	);
};

export default TabelskaVrstica;
