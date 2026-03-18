import { Body, Controller, Get, Inject, Logger, Optional, Param, Post, ServiceUnavailableException } from '@nestjs/common';
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
  private readonly logger = new Logger(CryptoPaymentsController.name);

  constructor(
    @Optional() @Inject(COMMERCE_CLIENT) private readonly commerce: CommerceClient | null,
  ) {
    if (!commerce) {
      this.logger.warn('COMMERCE_CLIENT not configured — crypto payments disabled');
    }
  }

  private requireCommerce(): CommerceClient {
    if (!this.commerce) {
      throw new ServiceUnavailableException('Crypto payments not configured');
    }
    return this.commerce;
  }

  @Post('charge')
  @Roles(...ManagerRoles, UserRole.TeamMember)
  async charge(
    @Body() dto: CreateCryptoPaymentRequestDto,
    @GetUser() _user: User,
  ) {
    const result = await this.requireCommerce().charge({
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
    const result = await this.requireCommerce().authorize({
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
    const result = await this.requireCommerce().capture(transactionId, dto.amount);
    return new SuccessResponseV2(result);
  }

  @Post(':id/refund')
  @Roles(...ManagerRoles)
  async refund(
    @Param('id') transactionId: string,
    @Body() dto: RefundCryptoPaymentRequestDto,
    @GetUser() _user: User,
  ) {
    const result = await this.requireCommerce().refund(transactionId, dto.amount);
    return new SuccessResponseV2(result);
  }

  @Get(':id')
  @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
  async getTransaction(
    @Param('id') transactionId: string,
    @GetUser() _user: User,
  ) {
    const result = await this.requireCommerce().getTransaction(transactionId);
    return new SuccessResponseV2(result);
  }

  @Get('processors')
  @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
  async listProcessors(@GetUser() _user: User) {
    const result = await this.requireCommerce().listProcessors();
    return new SuccessResponseV2(result);
  }
}
