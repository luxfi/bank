import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class ImpersonateDto {
    @IsUUID()
    @ApiProperty()
    userUuid: string;

    @IsUUID()
    @ApiProperty()
    clientUuid: string;
}
