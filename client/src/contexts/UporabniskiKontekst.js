import { useState, createContext, useEffect } from 'react';

export const UporabniskiKontekst = createContext(null);

export const UporabniskiKontekstProvider = ({ children }) => {
	const [uporabnik, setUporabnik] = useState({ uporabnisko_ime: 'gost' });
	const [jeAvtenticiran, setJeAvtenticiran] = useState(false);

	// user profile picture

	useEffect(() => {
		if (!jeAvtenticiran) {
			setUporabnik({ uporabnisko_ime: 'gost' });
		}
	}, [jeAvtenticiran]);

	const vrednostKonteksta = { uporabnik, setUporabnik, jeAvtenticiran, setJeAvtenticiran };

	return <UporabniskiKontekst.Provider value={vrednostKonteksta}>{children}</UporabniskiKontekst.Provider>;
};
