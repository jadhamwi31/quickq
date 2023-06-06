import server, { Server } from "socket.io";
import { Express } from "express";
import { Server as HttpServer } from "http";
import {
	IClientToServerEvents,
	IServerToClientEvents,
	InterServerEvents,
} from "../ts/interfaces/websocket.interfaces";

export default class WebsocketService {
	private static _io: Server<
		IClientToServerEvents,
		IServerToClientEvents,
		InterServerEvents
	>;

	private static numberOfClients: number = 0;
	public static init(httpServer: HttpServer) {
		this._io = new Server(httpServer);

		this._io.on("connection", (socket) => {
			this.numberOfClients++;

			socket.on("disconnect", () => {
				this.numberOfClients--;
				console.log(this.numberOfClients);
			});
		});
	}

	public static getIo() {
		return this._io;
	}
}
