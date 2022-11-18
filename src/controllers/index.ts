import { BaseController } from "./base.controller";
import { DemoController } from "./demo.controller";
import { HealthCheckController } from "./health-check.controller";

export const ControllerList: BaseController[] = [new DemoController(), new HealthCheckController()];
