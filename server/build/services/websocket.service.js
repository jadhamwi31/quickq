"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const jwt_service_1 = require("./jwt.service");
const tables_service_1 = require("./tables.service");
const express_http_context_1 = __importDefault(require("express-http-context"));
class WebsocketService {
    static init(httpServer) {
        this._io = new socket_io_1.Server(httpServer);
        this._io.use((socket, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const token = socket.handshake.headers.token;
                const user = yield jwt_service_1.JwtService.validate(token);
                if (user.role === "client") {
                    const tableClientId = yield tables_service_1.TablesService.getTableSessionClientId(user.tableId);
                    if (tableClientId !== user.clientId) {
                        throw new Error();
                    }
                }
                socket.user = user;
                next();
            }
            catch (e) {
                next(new Error("unauthorized"));
            }
        }));
        this._io.on("connection", (socket) => {
            console.log("connected", socket.user);
            if (socket.user.role === "client") {
                socket.join(String(socket.user.tableId));
                this.map.set(String(socket.user.tableId), socket.id);
            }
            else {
                socket.join(socket.user.role);
                this.map.set(String(socket.user.username), socket.id);
            }
            socket.emit("authorized", `you're authorized as ${socket.user.username || socket.user.role}`);
            socket.on("request_checkout", () => {
                socket
                    .to(["cashier"])
                    .emit("notification", "Table Checkout Request", `Table Number : ${socket.user.tableId}`);
            });
            socket.on("request_help", () => {
                socket.to(["cashier"]).emit("notification", "Table Help Call", `Table Number : ${socket.user.tableId}`);
            });
            socket.on("disconnect", () => {
                console.log("disconnected client", socket.user);
                if (socket.user.tableId) {
                    this.map.delete(socket.user.tableId);
                }
                else {
                    this.map.delete(socket.user.username);
                }
            });
        });
    }
    static publishEvent(rooms, ev, ...params) {
        console.log("emitted to ", rooms);
        const httpRequestClientSocket = this.getHttpRequestClientSocket();
        if (httpRequestClientSocket)
            httpRequestClientSocket.to(rooms).emit(ev, ...params);
    }
    static getHttpRequestClientSocket() {
        var _a;
        const key = (_a = express_http_context_1.default.get("username")) !== null && _a !== void 0 ? _a : express_http_context_1.default.get("tableId");
        const socketId = this.map.get(key);
        return this._io.sockets.sockets.get(socketId);
    }
}
WebsocketService.map = new Map();
exports.default = WebsocketService;
