const UserDataComponent = ({ props }) => {
	return (
		<div>
			{Object.keys(props.updatedUser).map((key) => {
				if (key === 'geslo') {
					return (
						<div key={key}>
							<label>{key}: </label>
							<input
								type='password'
								disabled='disabled'
								value={props.edit ? null : props.updatedUser[key]}
								defaultValue={props.updatedUser[key]}
								onChange={(e) => {
									props.setUpdatedUser({ ...props.updatedUser, geslo: e.target.value });
								}}></input>
							<br />
						</div>
					);
				} else if (key === 'uporabnisko_ime' || key === 'elektronski_naslov') {
					return (
						<div key={key}>
							<label>{key}: </label>
							<input
								type='text'
								disabled='disabled'
								value={props.edit ? null : props.updatedUser[key]}
								defaultValue={props.updatedUser[key]}></input>

							<br />
						</div>
					);
				} else if (key !== 'response') {
					return (
						<div key={key}>
							<label>{key}: </label>
							<input
								type='text'
								disabled={!props.edit}
								value={props.edit ? null : props.updatedUser[key]}
								defaultValue={props.updatedUser[key]}
								onChange={(e) => {
									props.setUpdatedUser({ ...props.updatedUser, [key]: e.target.value });
								}}></input>
							<br />
						</div>
					);
				}
				return <></>;
			})}
		</div>
	);
};

export default UserDataComponent;
