import { useState, createContext, useEffect } from 'react';

export const UserContext = createContext(null);

export const UserContextProvider = ({ children }) => {
	const [user, setUser] = useState({ uporabnisko_ime: 'gost' });
	const [isAuth, setIsAuth] = useState(false);

	// user profile picture

	useEffect(() => {
		if (!isAuth) {
			setUser({ uporabnisko_ime: 'gost' });
		}
	}, [isAuth]);

	const contextValue = { user, setUser, isAuth, setIsAuth };

	return <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>;
};
