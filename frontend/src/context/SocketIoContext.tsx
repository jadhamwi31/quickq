import { Socket, io } from "socket.io-client";
import { createContext, useState, useContext, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthContext } from "./AuthContext";

export type TableStatus = "Busy" | "Available";

export interface IOrderDish {
	name: string;
	quantity: number;
	price: number;
}

export type OrderDishType<T extends keyof IOrderDish = keyof IOrderDish> = Pick<
	IOrderDish,
	T
>;

export type OrderStatusType = "Pending" | "In Cook" | "Ready" | "Cancelled";
export type OrderDishesType<T extends keyof IOrderDish = keyof IOrderDish> =
	OrderDishType<T>[];

export interface IServerToClientEvents {
	update_table_status: (tableId: number, status: TableStatus) => void;
	update_order_status: (orderId: number, status: OrderStatusType) => void;
	update_order: (
		orderId: number,
		update: {
			dishesToMutate?: OrderDishesType<"name" | "quantity">;
			dishesToRemove?: OrderDishesType<"name">;
		}
	) => void;

	update_inventory_item: (
		ingredientName: string,
		update: Partial<{ available: number; needed: number, thresh_hold: number }>
	) => void;
	increment_payins: (amount: number) => void;
	new_order: (order: any) => void;
	new_payment: (payment: any) => void;
	authorized: (msg: string) => void;
	notification: (title: string, content: string) => void;
}

export interface IClientToServerEvents {
	request_checkout: () => void;
	request_help: () => void;
}


// export const socket: Socket<IServerToClientEvents, IClientToServerEvents> = io({
// 	query: {
// 		auth: Cookies.get("jwt"),
// 	},
// });

interface ISocketIoContext {
	socket: Socket<IServerToClientEvents, IClientToServerEvents> | null;
	connectSocket: () => void;
	disconnectSocket: () => void;
}

const SocketIoContext = createContext<ISocketIoContext>({} as ISocketIoContext);

interface Props {
	children: React.ReactNode;
}

export const SocketIoContextProvider = ({ children }: Props) => {
	const [socket, setSocket] = useState<ISocketIoContext["socket"]>(null);
	const isConnected = useRef(false)
	const connectSocket = () => {
		const jwt = Cookies.get("jwt");
		if (jwt && isConnected.current === false) {
			console.log("connect attempt")
			isConnected.current = true
			const socket: Socket<IServerToClientEvents, IClientToServerEvents> = io({
				extraHeaders: {
					token: jwt,
				},
			});


			socket.on("authorized", (msg) => {
				console.log(msg)
				setSocket(socket);
			});

			socket.on("disconnect", () => {
				setSocket(null)
			})
			console.log("connect")
		}
	};

	const disconnectSocket = () => {
		if (socket) {


			isConnected.current = false;
			console.log("disconnect")
			socket.close();
		}
	};

	useEffect(() => {
		window.onbeforeunload = () => {
			disconnectSocket();
		}
	}, [])
	return (
		<SocketIoContext.Provider
			value={{ socket, connectSocket, disconnectSocket }}
		>
			{children}
		</SocketIoContext.Provider>
	);
};

export const useSocketIoContext = () => useContext(SocketIoContext);