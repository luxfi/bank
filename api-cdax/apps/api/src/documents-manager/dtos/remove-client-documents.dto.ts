import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveClientDocumentDto {
    @ApiProperty()
    @IsUUID()
    documentUuid: string;
}
