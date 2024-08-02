import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { DocumentType } from '../enums';
import { UserDto } from './user-dto';

export class ClientDocumentDto {
  @ApiProperty()
  @IsUUID()
  uuid: string;

  @ApiProperty()
  @IsEnum(DocumentType)
  type: DocumentType;

  @ApiProperty()
  @IsString()
  originalFilename: string;

  @ApiProperty()
  @IsString()
  ownCloudPath: string;

  @ApiProperty({ type: UserDto })
  @Type(() => UserDto)
  creator: UserDto;
}
