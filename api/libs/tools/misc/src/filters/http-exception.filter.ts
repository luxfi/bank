import { ValidationError } from '@mikro-orm/core'; // Importação do tipo de erro de validação do Mikro-ORM
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException, ValidationError) // Captura múltiplos tipos de erro
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 400; // Status padrão para outros erros

    let messages = 'An unexpected error occurred';

    if (exception instanceof ValidationError) {
      // Formato de erro do Mikro-ORM
      messages = exception.message;
      // Transforma os erros de validação do Mikro-ORM
      if ('errors' in exception && Array.isArray((exception as any).errors)) {
        // Agora tratamos `exception` como tendo uma propriedade `errors` para fins de tipagem
        const validationErrors = (exception as any).errors;

        response.status(status).json({
          data: validationErrors.map((err: any) => ({
            property: err.property,
            message: err.constraints
              ? Object.values(err.constraints)[0]
              : 'Validation error',
          })),
        });
      }
    } else if (exception instanceof HttpException) {
      console.log('exception', exception);
      // Erros HTTP padrão do NestJS
      const exceptionResponse = exception.getResponse();
      messages =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse['message'] ?? exceptionResponse['messages'];
      response.status(status).json({
        messages,
      });
    } else {
      // Tratamento padrão para outros tipos de erro
      response.status(status).json({ data: [{ messages }] });
    }
  }
}
