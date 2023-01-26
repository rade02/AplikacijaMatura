import SignUpComponent from './SignUpComponent';
import SignInComponent from './SignInComponent';
import { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import Profile from './ProfileComponent';

const AuthWindowComponent = ({ props }) => {
	const { isAuth } = useContext(UserContext);

	if (isAuth) {
		return <Profile />;
	} else if (props.loggingMode === 'signin') {
		return <SignInComponent />;
	} else if (props.loggingMode === 'signup') {
		return <SignUpComponent />;
	} else {
		return <></>;
	}
};

export default AuthWindowComponent;
