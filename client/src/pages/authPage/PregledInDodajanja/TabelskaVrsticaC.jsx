import axios from 'axios';
import { CircleWavyCheck, UserCircleMinus, XCircle, UserCirclePlus } from 'phosphor-react';
import '../AuthPage.css';

const TabelskaVrstica = ({ props }) => {
	const PORT = 3005; // !!!
	console.log(props.element);
	if (props.naslov === 'Pregled oseb') {
		return (
			<tr
				key={props.element.uporabnisko_ime}
				className='vrstica'
				onClick={(e) => {
					e.preventDefault();
					props.setOseba(props.element);
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
	}
	return (
		<tr
			key={props.element.uporabnisko_ime}
			className='vrstica'
			onClick={(e) => {
				e.preventDefault();
				props.setOseba(props.element);
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
						disabled={props.element.vloga === 0 ? 'disabled' : ''}
						onClick={(e) => {
							e.preventDefault();
							e.stopPropagation();
						}}
						onChange={async (e) => {
							e.preventDefault();
							e.stopPropagation();
							if (e.target.value !== '' && typeof parseInt(e.target.value) === 'number') {
								try {
									let res = await axios.post(`http://localhost:${PORT}/api/admin/updtVloga`, {
										uporabnisko_ime: props.element.uporabnisko_ime,
										vloga: e.target.value,
									});
									if (res.data === 'success') props.setTabela(null);
								} catch (error) {
									console.log(error);
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
									let res = await axios.post(`http://localhost:${PORT}/api/admin/omogoci`, {
										uporabnisko_ime: props.element.uporabnisko_ime,
										omogoci: !props.element.omogocen,
									});
									if (res.data === 'success') props.setTabela(null);
								} catch (error) {
									console.log(error);
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
								let res = await axios.post(`http://localhost:${PORT}/api/admin/omogoci`, {
									uporabnisko_ime: props.element.uporabnisko_ime,
									omogoci: !props.element.omogocen,
								});
								if (res.data === 'success') props.setTabela(null);
							} catch (error) {
								console.log(error);
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
