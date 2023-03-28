const PodatkiUporabnika = ({ props }) => {
	return (
		<table className='tabelaPodatkovUporabnika'>
			<tbody>
				{Object.keys(props.posodobljenUporabnik).map((key) => {
					if (key === 'geslo') {
						return (
							<tr key={key}>
								<td>{key}: </td>
								<td>
									<input
										className='vnosnoPolje'
										type='password'
										disabled='disabled'
										value={props.uredi ? null : props.posodobljenUporabnik[key]}
										defaultValue={props.posodobljenUporabnik[key]}
										onChange={(e) => {
											props.setPosodobljenUporabnik({
												...props.posodobljenUporabnik,
												geslo: e.target.value,
											});
										}}></input>
								</td>
							</tr>
						);
					} else if (
						key === 'uporabnisko_ime' ||
						key === 'elektronski_naslov' ||
						key === 'placa' ||
						key === 'podjetje'
					) {
						return (
							<tr key={key}>
								<td>{key}: </td>
								<td>
									<input
										className='vnosnoPolje'
										type='text'
										disabled='disabled'
										value={props.uredi ? null : props.posodobljenUporabnik[key]}
										defaultValue={props.posodobljenUporabnik[key]}></input>
								</td>
							</tr>
						);
					} else if (key !== 'response') {
						return (
							<tr key={key}>
								<td>{key}: </td>
								<td>
									<input
										className='vnosnoPolje'
										type='text'
										disabled={!props.uredi}
										value={props.uredi ? null : props.posodobljenUporabnik[key]}
										defaultValue={props.posodobljenUporabnik[key]}
										onChange={(e) => {
											props.setPosodobljenUporabnik({
												...props.posodobljenUporabnik,
												[key]: e.target.value,
											});
										}}></input>
								</td>
							</tr>
						);
					}
					return <></>;
				})}
			</tbody>
		</table>
	);
};

export default PodatkiUporabnika;
