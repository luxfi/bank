import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, SuccessResponseV2 } from '@luxbank/tools-misc';
import { ManagerRoles, User, UserRole } from '@luxbank/tools-models';
import { Roles } from '../../auth/roles.decorator';
import {
  CommerceClient,
  COMMERCE_CLIENT,
} from '@luxbank/iam';
import {
  CreateCryptoPaymentRequestDto,
  CaptureCryptoPaymentRequestDto,
  RefundCryptoPaymentRequestDto,
} from './dto/crypto-payment.request.dto';

@ApiTags('Crypto Payments')
@ApiBearerAuth()
@Controller({path: 'payments/crypto', version: '2'})
export class CryptoPaymentsController {
  constructor(
    @Inject(COMMERCE_CLIENT) private readonly commerce: CommerceClient,
  ) {}

  @Post('charge')
  @Roles(...ManagerRoles, UserRole.TeamMember)
  async charge(
    @Body() dto: CreateCryptoPaymentRequestDto,
    @GetUser() _user: User,
  ) {
    const result = await this.commerce.charge({
      amount: dto.amount,
      currency: dto.currency,
      source: dto.source,
      description: dto.description,
      metadata: dto.metadata,
    });
    return new SuccessResponseV2(result);
  }

  @Post('authorize')
  @Roles(...ManagerRoles, UserRole.TeamMember)
  async authorize(
    @Body() dto: CreateCryptoPaymentRequestDto,
    @GetUser() _user: User,
  ) {
    const result = await this.commerce.authorize({
      amount: dto.amount,
      currency: dto.currency,
      source: dto.source,
      description: dto.description,
      metadata: dto.metadata,
    });
    return new SuccessResponseV2(result);
  }

  @Post(':id/capture')
  @Roles(...ManagerRoles)
  async capture(
    @Param('id') transactionId: string,
    @Body() dto: CaptureCryptoPaymentRequestDto,
    @GetUser() _user: User,
  ) {
    const result = await this.commerce.capture(transactionId, dto.amount);
    return new SuccessResponseV2(result);
  }

  @Post(':id/refund')
  @Roles(...ManagerRoles)
  async refund(
    @Param('id') transactionId: string,
    @Body() dto: RefundCryptoPaymentRequestDto,
    @GetUser() _user: User,
  ) {
    const result = await this.commerce.refund(transactionId, dto.amount);
    return new SuccessResponseV2(result);
  }

  @Get(':id')
  @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
  async getTransaction(
    @Param('id') transactionId: string,
    @GetUser() _user: User,
  ) {
    const result = await this.commerce.getTransaction(transactionId);
    return new SuccessResponseV2(result);
  }

  @Get('processors')
  @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
  async listProcessors(@GetUser() _user: User) {
    const result = await this.commerce.listProcessors();
    return new SuccessResponseV2(result);
  }
}
