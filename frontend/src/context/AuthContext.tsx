import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import { createContext, useState, useContext, useEffect } from "react";
import { useSocketIoContext } from "./SocketIoContext";
import { useNavigate } from "react-router-dom";

interface IAuthContext {
	authenticated: boolean;
	role: string | null;
	username: string | null;
	tableId: string | null;
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
		Pick<IAuthContext, "authenticated" | "role" | 'username' | "tableId">
	>(() => {
		const token = Cookies.get("jwt");
		if (token) {
			const { role, username, tableId }: { role: string, username?: string, tableId: string } = jwtDecode(token);
			return { authenticated: true, role, username: username ?? null, tableId: tableId ?? null };
		} else {
			return { authenticated: false, role: null, username: null, tableId: null };
		}
	});

	useEffect(() => {
		if (auth.authenticated) {
			connectSocket(); // Connect the socket when authentication state changes to authenticated
		} else {
			disconnectSocket(); // Disconnect the socket when authentication state changes to unauthenticated
		}
	}, [auth.authenticated, connectSocket, disconnectSocket]);
	const loggedIn = () => {
		const token = Cookies.get("jwt");
		const { role, username, tableId }: { role: string, username?: string, tableId: string } = jwtDecode(token!);
		setAuth({ authenticated: true, role, username: username ?? null, tableId: tableId ?? null });
	};

	const loggedOut = () => {
		setAuth({ authenticated: false, role: null, username: null, tableId: null });
		disconnectSocket();
	};

	return (
		<AuthContext.Provider value={{ ...auth, loggedIn, loggedOut }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuthContext = () => useContext(AuthContext);
