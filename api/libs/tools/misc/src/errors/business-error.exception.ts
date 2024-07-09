import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessErrorException extends HttpException {
  constructor(error: any) {
    // Assume que 'error' tem uma propriedade 'message' com a mensagem de erro da API externa
    super(`Error from API: ${error.message}`, HttpStatus.BAD_REQUEST);
  }
}
