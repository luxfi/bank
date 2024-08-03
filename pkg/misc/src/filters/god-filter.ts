import { UseFilters } from "@nestjs/common";
import { HttpExceptionFilter } from "./http-exception.filter";

export function UseErrorHandler() {
    return UseFilters(HttpExceptionFilter);
}