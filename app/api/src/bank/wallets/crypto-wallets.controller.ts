import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, SuccessResponseV2 } from '@luxbank/tools-misc';
import { ManagerRoles, User, UserRole } from '@luxbank/tools-models';
import { Roles } from '../../auth/roles.decorator';
import { TradingService } from '../../trading/trading.service';
import { CreateCryptoWalletRequestDto } from './dto/create-crypto-wallet.request.dto';
import { SignMessageRequestDto } from './dto/sign-message.request.dto';
import { SendTransactionRequestDto } from './dto/send-transaction.request.dto';

@ApiTags('Crypto Wallets')
@ApiBearerAuth()
@Controller({path: 'wallets/crypto', version: '2'})
export class CryptoWalletsController {
  constructor(private readonly tradingService: TradingService) {}

  @Post()
  @Roles(...ManagerRoles, UserRole.TeamMember)
  async createWallet(
    @Body() dto: CreateCryptoWalletRequestDto,
    @GetUser() _user: User,
  ) {
    const wallet = await this.tradingService.createWallet(
      dto.chain,
      dto.threshold,
      dto.parties,
    );
    return new SuccessResponseV2(wallet);
  }

  @Get()
  @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
  async listWallets(
    @Query('chain') chain: string | undefined,
    @GetUser() _user: User,
  ) {
    const wallets = await this.tradingService.listWallets(chain);
    return new SuccessResponseV2(wallets);
  }

  @Get(':id/balance')
  @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
  async getBalance(
    @Param('id') walletId: string,
    @Query('tokenAddress') tokenAddress: string | undefined,
    @GetUser() _user: User,
  ) {
    const balance = await this.tradingService.getBalance(walletId, tokenAddress);
    return new SuccessResponseV2(balance);
  }

  @Post(':id/sign')
  @Roles(...ManagerRoles)
  async signMessage(
    @Param('id') walletId: string,
    @Body() dto: SignMessageRequestDto,
    @GetUser() _user: User,
  ) {
    const result = await this.tradingService.signTransaction(walletId, dto.message, dto.chain);
    return new SuccessResponseV2(result);
  }

  @Post(':id/send')
  @Roles(...ManagerRoles)
  async sendTransaction(
    @Param('id') walletId: string,
    @Body() dto: SendTransactionRequestDto,
    @GetUser() _user: User,
  ) {
    const result = await this.tradingService.sendTransaction({
      walletId,
      to: dto.to,
      amount: dto.amount,
      chain: dto.chain,
      tokenAddress: dto.tokenAddress,
      data: dto.data,
    });
    return new SuccessResponseV2(result);
  }
}
