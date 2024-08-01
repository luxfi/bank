import { SetMetadata } from '@nestjs/common';

export const ANONYMOUS_ENDPOINT_KEY = 'anonymous-endpoint';
export const Anonymous = () => SetMetadata(ANONYMOUS_ENDPOINT_KEY, true);
