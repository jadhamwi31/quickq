import { useEffect } from "react";
import { useSocketIoContext } from "../context/SocketIoContext";
import { Outlet } from "react-router-dom";

type Props = {};

const SocketConnect = (props: Props) => {
	const { socket, connectSocket } = useSocketIoContext();
	useEffect(() => {
		if (!socket) {
			connectSocket();
		}

	}, []);
	return <>{socket ? <Outlet /> : <div>Loading...</div>}</>;
};

export default SocketConnect;
