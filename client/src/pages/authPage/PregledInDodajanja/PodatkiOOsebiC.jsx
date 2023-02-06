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
						textAlign: 'left',
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
						if (pr === 'vloga') {
							let imeVloge =
								oseba[pr] === 0
									? 'administrator'
									: oseba[pr] === 1
									? 'zaposleni'
									: oseba[pr] === 2
									? 'stranka'
									: oseba[pr] === 3
									? 'računovodja'
									: 'nedoločeno';
							return (
								<>
									<input
										type='text'
										value={imeVloge}
										style={{ border: 'none', userSelect: 'none', pointerEvents: 'none' }}></input>
									<br />
								</>
							);
						} else if (pr === 'omogocen') {
							return (
								<>
									<input
										type='text'
										value={oseba[pr] === 1 ? 'omogočen' : 'onemogočen'}
										style={{ border: 'none', userSelect: 'none', pointerEvents: 'none' }}></input>
									<br />
								</>
							);
						} else if (pr === 'geslo') {
							return (
								<>
									<input
										type='password'
										value={oseba[pr]}
										style={{ border: 'none', userSelect: 'none', pointerEvents: 'none' }}></input>
									<br />
								</>
							);
						}
						return (
							<>
								<input
									type='text'
									value={oseba[pr]}
									style={{ border: 'none', userSelect: 'none', pointerEvents: 'none' }}></input>
								<br />
							</>
						);
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
