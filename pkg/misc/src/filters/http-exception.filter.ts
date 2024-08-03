import { ValidationError } from "@mikro-orm/core";
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Response } from "express";

@Catch(HttpException, ValidationError)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException | ValidationError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception instanceof HttpException ? exception.getStatus() : 400;

        let messages = 'An unexpected error occurred';
        if(exception instanceof ValidationError) {
            messages = exception.message;
            if('errors' in exception && Array.isArray((exception as any).errors)) {
                const validationErrors = (exception as any).errors;

                response.status(status).json({
                    data: validationErrors.map((err: any) => ({
                        property: err.property,
                        message: err.constraints ? Object.values(err.constraints)[0] : 'Validation error'
                    }))
                });
            }
        }
        else if(exception instanceof HttpException) {
            const exceptionResponse = exception.getResponse();
            messages = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any)['message'] ?? (exceptionResponse as any)['messages'];
            response.status(status).json({messages});
        }
        else {
            response.status(status).json({data: [{messages}]});
        }
    }
}