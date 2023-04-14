import { createContext, useState } from 'react';

export const NakupovalniKontekst = createContext(null);

export const NakupovalniKontekstProvider = ({ children }) => {
	const [kosarica, setKosarica] = useState([]);

	const contextValue = { kosarica, setKosarica };

	return <NakupovalniKontekst.Provider value={contextValue}>{children}</NakupovalniKontekst.Provider>;
};
