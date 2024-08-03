import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsUUID } from 'class-validator';
import { DocumentType } from '../enums';

export class UserDocumentDto {
  @ApiProperty()
  @IsUUID()
  uuid: string;

  @ApiProperty()
  @IsEnum(DocumentType)
  type: DocumentType;
}

export class UserDocumentsDto {
  @ApiProperty()
  @Type(() => UserDocumentDto)
  @IsArray()
  documents: UserDocumentDto[];
}
