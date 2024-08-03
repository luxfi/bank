import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, IsString, IsInstance } from 'class-validator';

export class CredentialsIfxLinkDataDto {
  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty()
  @IsString()
  clientSecret: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}

export class IfxLinkDataDto {
  @ApiProperty()
  @IsUUID()
  clientId: string;

  @ApiProperty({ type: CredentialsIfxLinkDataDto })
  @Type(() => CredentialsIfxLinkDataDto)
  @IsInstance(CredentialsIfxLinkDataDto)
  credentials: CredentialsIfxLinkDataDto;
}
