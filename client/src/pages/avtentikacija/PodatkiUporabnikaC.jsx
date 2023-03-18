const PodatkiUporabnika = ({ props }) => {
	return (
		<table className='tabelaPodatkovUporabnika'>
			<tbody>
				{Object.keys(props.updatedUser).map((key) => {
					if (key === 'geslo') {
						return (
							<tr key={key}>
								<td>{key}: </td>
								<td>
									<input
										className='vnosnoPolje'
										type='password'
										disabled='disabled'
										value={props.edit ? null : props.updatedUser[key]}
										defaultValue={props.updatedUser[key]}
										onChange={(e) => {
											props.setUpdatedUser({ ...props.updatedUser, geslo: e.target.value });
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
										value={props.edit ? null : props.updatedUser[key]}
										defaultValue={props.updatedUser[key]}></input>
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
										disabled={!props.edit}
										value={props.edit ? null : props.updatedUser[key]}
										defaultValue={props.updatedUser[key]}
										onChange={(e) => {
											props.setUpdatedUser({ ...props.updatedUser, [key]: e.target.value });
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
