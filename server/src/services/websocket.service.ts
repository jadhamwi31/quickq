import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { IUserTokenPayload } from "../ts/interfaces/user.interfaces";
import {
	IClientToServerEvents,
	IServerToClientEvents,
	InterServerEvents,
} from "../ts/interfaces/websocket.interfaces";
import { UserRoleType } from "../ts/types/user.types";
import { JwtService } from "./jwt.service";
import { TablesService } from "./tables.service";

declare module "socket.io" {
	interface Socket {
		user: IUserTokenPayload;
	}
}

export default class WebsocketService {
	private static _io: Server<
		IClientToServerEvents,
		IServerToClientEvents,
		InterServerEvents
	>;

	private static numberOfClients: number = 0;
	public static init(httpServer: HttpServer) {
		this._io = new Server(httpServer);

		this._io.use(async (socket, next) => {
			try {
				const token = socket.handshake.auth.token;
				const user: IUserTokenPayload = await JwtService.validate(token);
				if (user.role === "client") {
					const tableClientId = await TablesService.getTableSessionClientId(
						user.tableId
					);
					if (tableClientId !== user.clientId) {
						throw new Error();
					}
				}
				socket.user = user;
			} catch (e: any) {
				next(new Error("unauthorized"));
			}
		});
		this._io.on("connection", (socket) => {
			this.numberOfClients++;
			if (socket.user.role === "client") {
				socket.join(String(socket.user.tableId));
			} else {
				socket.join(socket.user.role);
			}

			socket.on("disconnect", () => {
				this.numberOfClients--;
				console.log(this.numberOfClients);
			});
			socket.on("checkout_finished", (tableId) => {
				socket
					.to(["cashier"] as UserRoleType[])
					.emit("checkout_request", tableId);
			});
		});
	}

	public static getIo() {
		return this._io;
	}
}
