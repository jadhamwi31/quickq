import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { createContext, useState, useContext, useEffect } from "react";
import { useSocketIoContext } from "./SocketIoContext";
import { useNavigate } from "react-router-dom";

interface IAuthContext {
	authenticated: boolean;
	role: string | null;
	loggedIn: () => void;
	loggedOut: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface Props {
	children: React.ReactNode;
}

export const AuthContextProvider = ({ children }: Props) => {
	const { connectSocket, disconnectSocket } = useSocketIoContext();

	const [auth, setAuth] = useState<
		Pick<IAuthContext, "authenticated" | "role">
	>(() => {
		const token = Cookies.get("jwt");
		if (token) {
			const { role }: { role: string } = jwtDecode(token);
			return { authenticated: true, role };
		} else {
			return { authenticated: false, role: null };
		}
	});
	const loggedIn = () => {
		const token = Cookies.get("jwt");
		const { role }: { role: string } = jwtDecode(token!);
		setAuth({ authenticated: true, role });
	};

	const loggedOut = () => {
		setAuth({ authenticated: false, role: null });
		disconnectSocket();
	};

	return (
		<AuthContext.Provider value={{ ...auth, loggedIn, loggedOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);
