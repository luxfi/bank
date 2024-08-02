export class CreateClientDto {
  static fromAdminDto(dto: CreateClientDto) {
    const client = new CreateClientDto();
    return client;
  }
}
