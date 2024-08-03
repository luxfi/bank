import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Pagination } from '../types/pagination.type';

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<T, {data: T; pagination?: Pagination}> {
    intercept(context: ExecutionContext, next: CallHandler<T>) : Observable<{data: T, pagination?: Pagination}> {
        return next.handle().pipe(
            map((data) => {
                const pagination = (data as any)['pagination'] ? (data as any)['pagination'] : undefined;
                if(pagination)
                    delete (data as any)['pagination'];

                return {data, pagination};
            })
        );
    }
}