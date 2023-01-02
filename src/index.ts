import cors from "cors";
import express from "express";
import "reflect-metadata";
import SwaggerUi from "swagger-ui-express";
import { errorHandler } from "./common/middlewares/error-handler";
import { loggingMiddleware } from "./common/middlewares/logging.middleware";
import { Logger } from "./common/utils/logger";
import { ControllerList } from "./controllers";
import { BaseController } from "./controllers/base.controller";
import { AppConfig } from "./infrastructure/configs";
import http from "http";
import { ServerSocket } from "./socket";

async function bootstrap() {
	const app = express();

	app.use(express.json()); // parsing application/json
	app.use(express.urlencoded({ extended: true }));
	app.use(
		cors({
			origin: "*",
			credentials: true,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
			allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
		})
	);
	app.use((req, res, next) => {
		res.setHeader("X-Powered-By", AppConfig.POWER_BY);
		next();
	});
	app.use(loggingMiddleware);

	// init routes
	ControllerList.forEach((controller: BaseController) => {
		app.use(controller.basePath(), controller.router());
	});

	app.use("/swagger", SwaggerUi.serve, SwaggerUi.setup(require("../swagger.json")));

	// handle not found route
	app.use((req, res, next) => {
		res.status(404).send();
	});

	// handle error
	app.use(errorHandler);

	// start server
	const PORT = AppConfig.PORT;

	const httpServer = http.createServer(app);
	new ServerSocket(httpServer);

	httpServer.listen(PORT, () => {
		Logger.info(`Server is ready on port ${PORT}`, "Bootstrap");
	});

	// app.listen(PORT, () => {
	// 	Logger.info(`Server is ready on port ${PORT}`, "Bootstrap");
	// });
}
bootstrap();
