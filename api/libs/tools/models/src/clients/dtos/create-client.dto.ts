import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class CreateClientDto {
  static fromAdminDto(dto: CreateClientDto) {
    const client = new CreateClientDto();
    return client;
  }
}
