import { NextFunction, Request, Response } from "express";
import { DataResponse } from "../core/responses/data.response";
import { BaseController } from "./base.controller";
import { AppConfig } from "../infrastructure/configs";

export class HealthCheckController extends BaseController {
	constructor() {
		super("/health-check");
	}

	protected registerMiddlewares(): void {
		this._router.use((req: Request, res: Response, next: NextFunction) => {
			next();
		});
	}

	protected registerRouterHandler(): void {
		this._router.get("/env", this.checkEnvironment);
	}

	checkEnvironment(req: Request, res: Response) {
		const dataRes = new DataResponse(200, "Env information must be removed from this controller when you start coding", AppConfig);
		res.json(dataRes.toJSON());
	}
}
