import { useState } from 'react';

const PregledIzdelkov = ({ props }) => {
	const [predmet, setPredmet] = useState('izdelki');

	return (
		<>
			<h2>{props.naslov}</h2>
		</>
	);
};

export default PregledIzdelkov;
