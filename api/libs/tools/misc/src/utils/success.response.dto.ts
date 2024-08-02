import { Pagination } from '../types/pagination.type';
import { Response } from './Response';

export class SuccessResponse<T> extends Response {
    constructor(public data: T) {
        super(200);
    }
}

export class SuccessResponseV2<T> {
    data: T;
    pagination?: Pagination;
    constructor(data: T, pagination?: Pagination) {
        this.data = data;
        this.pagination = pagination;
    }
}
