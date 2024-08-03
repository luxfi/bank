import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
    private logger = new Logger('RequestLoggingMiddleware');

    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(`[${req.method}] ${req.baseUrl}`);
        next();
    }
}