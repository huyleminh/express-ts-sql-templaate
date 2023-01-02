import { Server as HttpServer } from "http";
import { Namespace, Server, Socket } from "socket.io";
import { Logger } from "./common/utils/logger";
import { AppConfig } from "./infrastructure/configs/index";

type SocketLogInfo = {
	socketId: string;
	namespace?: string;
	room?: string;
};

export class ServerSocket {
	public static instance: ServerSocket;
	public io: Server;
	public groupNamespace: Namespace;

	private readonly LOG_CONTEXT = "Socket";

	constructor(server: HttpServer) {
		ServerSocket.instance = this;

		this.io = new Server(server, {
			serveClient: false,
			pingInterval: 10000,
			pingTimeout: 5000,
			cookie: false,
			cors: { origin: "*" },
		});

		this.io.on("connection", this.handleConnection.bind(this));

		// establish a namespace connection
		this.groupNamespace = this.io.of("/groups");
		this.groupNamespace.on("connection", this.handleGroupNamespaceConnection.bind(this));
	}

	handleConnection(socket: Socket) {
		const defaultInfo = { socketId: socket.id };
		this._logInfo("connection", defaultInfo);

		socket.on("error", (error) => {
			this._logError("error", defaultInfo, { error });
		});

		socket.on("disconnecting", (reason) => {
			this._logInfo("disconnecting", defaultInfo, { reason, rooms: socket.rooms });
		});

		socket.on("disconnect", (reason) => {
			this._logInfo("disconnect", defaultInfo, { reason });
		});
	}

	handleGroupNamespaceConnection(socket: Socket) {
		const defaultInfo = { socketId: socket.id, namespace: "groups" };
		this._logInfo("connection", defaultInfo);

		socket.on("error", (error) => {
			this._logError("error", defaultInfo, { error });
		});

		socket.on("disconnecting", (reason) => {
			this._logInfo("disconnecting", defaultInfo, { reason, rooms: socket.rooms });
		});

		socket.on("disconnect", (reason) => {
			this._logInfo("disconnect", defaultInfo, { reason });
		});
	}

	private _logInfo(event: string, info: SocketLogInfo, metadata?: object) {
		Logger.info(JSON.stringify({ event, info, metadata }), this.LOG_CONTEXT);
	}

	private _logError(event: string, info: SocketLogInfo, metadata?: object) {
		Logger.error(JSON.stringify({ event, info, metadata }), this.LOG_CONTEXT);
	}
}
