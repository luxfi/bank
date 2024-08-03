import { HttpException, HttpStatus } from "@nestjs/common";

export class BusinessErrorException extends HttpException {
    constructor(error: any) {
        super(`Error from API: ${error.message}`, HttpStatus.BAD_REQUEST);
    }
}