import {Server as HttpServer} from "http";
import {Server, Socket} from "socket.io";
import {IUserTokenPayload} from "../ts/interfaces/user.interfaces";
import {
    IClientToServerEvents,
    IServerToClientEvents,
    InterServerEvents,
} from "../ts/interfaces/websocket.interfaces";
import {UserRoleType} from "../ts/types/user.types";
import {JwtService} from "./jwt.service";
import {TablesService} from "./tables.service";
import requestContext from "express-http-context";

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
    private static map = new Map<string | number, string>();

    public static init(httpServer: HttpServer) {
        this._io = new Server(httpServer);

        this._io.use(async (socket, next) => {
            try {
                const token = socket.handshake.headers.token as string;
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

                next();
            } catch (e: any) {
                next(new Error("unauthorized"));
            }
        });
        this._io.on("connection", (socket) => {
            console.log("connected",socket.user)
            if (socket.user.role === "client") {
                socket.join(String(socket.user.tableId));
                this.map.set(String(socket.user.tableId), socket.id);
            } else {
                socket.join(socket.user.role);
                this.map.set(String(socket.user.username), socket.id);
            }
            socket.emit("authorized", `you're authorized as ${socket.user.username || socket.user.role
            }`);

            socket.on("request_checkout", () => {
                socket
                    .to(["cashier"])
                    .emit(
                        "notification",
                        "Table Checkout Request",
                        `Table Number : ${socket.user.tableId}`
                    );
            });
            socket.on("request_help", () => {
                socket.to(["cashier"]).emit("notification", "Table Help Call", `Table Number : ${socket.user.tableId}`)
            })
            socket.on("disconnect", () => {
                console.log("disconnected client",socket.user)
                if (socket.user.tableId) {

                    this.map.delete(socket.user.tableId)
                } else {

                    this.map.delete(socket.user.username)
                }
            })
        });
    }

    public static publishEvent(
        rooms: string[],
        ev: keyof IServerToClientEvents,
        ...params: Parameters<IServerToClientEvents[typeof ev]>
    ) {
        console.log("emitted to ",rooms)
        const httpRequestClientSocket = this.getHttpRequestClientSocket();


        if (httpRequestClientSocket)
            httpRequestClientSocket.to(rooms).emit(ev, ...params)

    }

    private static getHttpRequestClientSocket() {
        const key = requestContext.get("username") ?? requestContext.get("tableId");

        const socketId = this.map.get(key);

        return this._io.sockets.sockets.get(socketId);
    }
}
