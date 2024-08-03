import { ApprovePaymentUseCase, CreatePaymentUseCase, GetPurposeCodesUseCase, RejectPaymentDomainUseCase } from '../../use-cases';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, SuccessResponseV2 } from '@luxbank/tools-misc';
import { ManagerRoles, User, UserRole } from '@luxbank/tools-models';
import { Roles } from '../../auth/roles.decorator';
import { CreatePaymentRequestDto } from './dto/create-payment.request.dto';
import { CreatePaymentResponseDto } from './dto/create-payment.response.dto';
import { PurposeCodeRequestDto } from './dto/purpose-codes.request.dto';
import { PurposeCodeResponseDto } from './dto/purpose-codes.response.dto';
import { TransactionDescriptionDto } from './dto/approve-payment.request.dto';
import { ApprovePaymentResponseDto } from './dto/approve-payment.response.dto';
import { RejectPaymentResponseDto } from './dto/reject-payment.response.dto';

@ApiTags('Payments')
@Controller({path: 'payments', version: '2'})
@ApiBearerAuth()
export class PaymentsController {
    constructor(
        private readonly createPaymentUseCase: CreatePaymentUseCase,
        private readonly approvePaymentUseCase: ApprovePaymentUseCase,
        private readonly rejectPaymentUseCase: RejectPaymentDomainUseCase,
        private readonly getPurposeCodesUseCase: GetPurposeCodesUseCase,
    ) { }

    @Get('purpose-codes')
    @Roles(...ManagerRoles, UserRole.TeamMember)
    getPurposeCodes(@Query() purposeCodeRequestDto: PurposeCodeRequestDto, @GetUser() user: User): Promise<PurposeCodeResponseDto> {
        return this.getPurposeCodesUseCase.handle(purposeCodeRequestDto, user);
    }

    @Post()
    @Roles(...ManagerRoles, UserRole.TeamMember)
    async create(@Body() createPaymentDto: CreatePaymentRequestDto, @GetUser() user: User): Promise<CreatePaymentResponseDto> {
        const { id } = await this.createPaymentUseCase.handle(createPaymentDto, user);
        return new SuccessResponseV2({ id });
    }

    @Post('approve_payment/:id')
    @Roles(...ManagerRoles)
    async approve_payment(@Param('id') id: string, @GetUser() user: User): Promise<ApprovePaymentResponseDto> {
        const payment = await this.approvePaymentUseCase.handle({id}, user);
        return new SuccessResponseV2(payment);
    }

    @Post('reject_payment/:id')
    @Roles(...ManagerRoles)
    async reject_payment(@Param('id') id: string, @Body() body: TransactionDescriptionDto, @GetUser() user: User): Promise<RejectPaymentResponseDto> {
        const { description } = body;
        const payment = await this.rejectPaymentUseCase.handle({ id, description }, user);
        return new SuccessResponseV2(payment);
    }
}
