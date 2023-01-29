const PodatkiOOsebi = ({ oseba, prejsnjeStanjeAdmin, setStanjeAdmin }) => {
	if (oseba === null) {
		return (
			<div>
				<div>Prišlo je do napake pri prikazu osebe</div>
				<button
					onClick={(e) => {
						e.preventDefault();
						setStanjeAdmin(prejsnjeStanjeAdmin);
					}}>
					Nazaj
				</button>
			</div>
		);
	}

	return (
		<div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					margin: '20px',
					padding: '10px',
					border: '1px solid black',
				}}>
				<div
					style={{
						padding: '10px',
					}}>
					{Object.keys(oseba).map((pr) => {
						return <div>{pr}:</div>;
					})}
				</div>
				<div
					style={{
						padding: '10px',
					}}>
					{Object.keys(oseba).map((pr) => {
						return <div>{oseba[pr]}</div>;
					})}
				</div>
			</div>
			<button
				onClick={(e) => {
					e.preventDefault();
					setStanjeAdmin(prejsnjeStanjeAdmin);
				}}>
				Nazaj
			</button>
		</div>
	);
};

export default PodatkiOOsebi;
