import { PartialType } from '@nestjs/swagger';
import { CreateMiscDto } from './create-misc.dto';

export class UpdateMiscDto extends PartialType(CreateMiscDto) {}
