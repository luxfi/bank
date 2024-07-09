import { CreateConversionUseCase } from '@domain/use-cases/create-conversion';
import { GetPreviewUseCase } from '@domain/use-cases/get-conversion-preview';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '@tools/misc';
import { ManagerRoles, User, UserRole, UserRoles } from '@tools/models';
import { Roles } from '../../auth/roles.decorator';
import { CreateConversionRequestDto } from './dto/create-conversion.request.dto';
import { CreateConversionResponseDto } from './dto/create-conversion.response.dto';
import { PreviewConversionRequestDto } from './dto/preview-conversion.request.dto';
import { PreviewConversionResponseDto } from './dto/preview-conversion.response.dto';

@ApiTags('Conversions')
@ApiBearerAuth()
@Controller({
  path: 'conversions',
  version: '2',
})
export class ConversionsController {
  constructor(
    private readonly createConversionUseCase: CreateConversionUseCase,
    private readonly getPreviewUseCase: GetPreviewUseCase,
  ) {}

  @Post()
  @Roles(...ManagerRoles, UserRole.TeamMember)
  create(
    @Body() createConversionRequestDto: CreateConversionRequestDto,
    @GetUser() user: User,
  ): Promise<CreateConversionResponseDto> {
    return this.createConversionUseCase.handle(
      createConversionRequestDto,
      user,
    );
  }

  @Post('preview')
  @Roles(...UserRoles)
  getQuote(
    @Body() previewConversionRequestDto: PreviewConversionRequestDto,
    @GetUser() user: User,
  ): Promise<PreviewConversionResponseDto> {
    return this.getPreviewUseCase.handle(previewConversionRequestDto, user);
  }
}
