import { createContext, useState } from 'react';

export const ShopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
	const [cart, setCart] = useState([]);
	const [state, setState] = useState({ active: 'shopping', infos: null, fromCart: false });
	// props - za prikaz informacij o izdelku ce pridemo iz carta
	const contextValue = { cart, setCart, state, setState };

	return <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>;
};
