import { Response } from './Response';

export class BadRequestResponse<T> extends Response {
  constructor(public data: T) {
    super(400);
  }
}
