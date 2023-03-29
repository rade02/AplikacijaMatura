import { useLocation } from 'react-router-dom';

const Domov = () => {
	const location = useLocation();

	if (location.state !== null) return <div>{location.state.sporocilo}</div>;
	return (
		<div className='domov'>
			<h2 className='naslov' style={{ textDecoration: 'underline' }}>
				Podjetje d. o. o.
			</h2>
			<p>
				Pozdravljeni na strani podjetja d.o.o. Na njej lahko opravite spletni nakup kot gost ali pa se
				prijavite in tako pridobite možnost spletnega plačila in pregleda opravljenih nakupov.
			</p>
			<p>
				Če še nimate računa, ga ustvarite pod oknom <i>registracija</i>, sicer se lahko prijavite prek okna{' '}
				<i>prijava</i> v navigacijski vrstici.
			</p>
			<p>
				Pod zavihkom <i>trgovina</i> lahko pregledujete izdelke in jih dodajate v košarico. V tej
				spreminjate količine izbranih izdelkov in iz nje nadaljujete na blagajno, kjer zaključite nakup z
				oddajo naročila. Če ste nakup opravili s svojim računom, si lahko na njem ogledate svoja naročila
				in po odpremi tudi račune.
			</p>
		</div>
	);
};

export default Domov;
