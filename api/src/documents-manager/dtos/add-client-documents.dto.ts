import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { DocumentType } from '@cdaxfx/tools-models';

export class AddClientDocumentDto {
    @ApiProperty()
    @IsUUID()
    documentUuid: string;

    @ApiProperty()
    @IsEnum(DocumentType)
    type: DocumentType;
}
