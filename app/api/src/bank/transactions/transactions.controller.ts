import { GetTotalTransactionsDomainUseCase, GetTransactionDomainUseCase, GetTransactionsDomainUseCase } from '../../use-cases';
import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { GetUser, SuccessResponseV2 } from '@luxbank/tools-misc';
import { User, UserRole, UserRoles } from '@luxbank/tools-models';
import { Roles } from '../../auth/roles.decorator';
import { GetTransactionTotalResponseDto } from './dto/get-transaction-total.response.dto';
import { ListTransactionsRequestDto } from './dto/list-transactions.request.dto';
import { ListTransactionsResponseDto } from './dto/list-transactions.response.dto';
import { GetTransactionResponseWithDataDto } from './dto/transaction-detail.response.dto';

@ApiTags('Transactions')
@ApiBearerAuth()
@Controller({path: 'transactions', version: '2'})
export class TransactionsController {
    constructor(
        private readonly getTransactionsUseCase: GetTransactionsDomainUseCase,
        private readonly getTransactionUseCase: GetTransactionDomainUseCase,
        private readonly getTotalTransactionsDomainUseCase: GetTotalTransactionsDomainUseCase
    ) { }

    @Get()
    @Roles(...UserRoles, UserRole.SuperAdmin)
    @UsePipes(new ValidationPipe({ transform: true }))
    async findAll(@Query() query: ListTransactionsRequestDto, @GetUser() user: User): Promise<ListTransactionsResponseDto> {
        const { data, pagination } = await this.getTransactionsUseCase.handle(query, user);
        return new SuccessResponseV2(data, pagination);
    }

    @Get('/total')
    @Roles(...UserRoles, UserRole.SuperAdmin)
    async getTotalTransactions(@GetUser() user: User): Promise<GetTransactionTotalResponseDto> {
        const total = await this.getTotalTransactionsDomainUseCase.handle(user);
        return new SuccessResponseV2(total);
    }

    @Get(':id')
    @ApiNotFoundResponse()
    @Roles(UserRole.SuperAdmin, ...UserRoles)
    async findOne(@Param('id') id: string, @GetUser() user: User): Promise<GetTransactionResponseWithDataDto> {
        const transaction = await this.getTransactionUseCase.handle(id, user);
        return new SuccessResponseV2(transaction);
    }
}
