import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID } from 'class-validator';
import { DocumentType } from '@tools/models';

export class RemoveClientDocumentDto {
  @ApiProperty()
  @IsUUID()
  documentUuid: string;
}
