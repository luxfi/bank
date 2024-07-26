import {ApproveBeneficiaryDomainUseCase, ArchiveBeneficiaryDomainUseCase, DisapproveBeneficiaryDomainUseCase, CreateBeneficiaryDomainUseCase,
        GetBeneficiariesDomainUseCase, GetBeneficiaryDetailDomainUseCase, GetCurrentBeneficiaryDomainUseCase, UpdateBeneficiaryDomainUseCase } from '../../use-cases';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser, SuccessResponseV2, UseErrorHandler } from '@cdaxfx/tools-misc';
import { ManagerRoles, User, UserRole } from '@cdaxfx/tools-models';
import { Roles } from '../../auth/roles.decorator';
import { CreateBeneficiaryDto, GetBeneficiariesDto, GetBeneficiariesSelectDto, UpdateBeneficiaryDto } from './dto/beneficiary.request.dto';
import { ApproveAndDisapproveBeneficiaryResponseDto, BeneficiaryUpdateResponse, GetBeneficiariesPaginatedResponse, GetBeneficiariesSelectPaginatedResponse,
        GetBeneficiaryDetailResponse } from './dto/beneficiary.response.dto';
import { CreateBeneficiaryResponseDto } from './dto/create-beneficiary.response.dto';
import { DeleteBeneficiaryResponseDto } from './dto/delete-beneficiary.response.dto';

@ApiTags('Beneficiaries')
@ApiBearerAuth()
@UseErrorHandler()
@Controller({path: 'beneficiaries', version: '2'})
export class BeneficiariesController {
    constructor(
        private getCurrentBeneficiaryUseCase: GetCurrentBeneficiaryDomainUseCase,
        private getBeneficiariesUseCase: GetBeneficiariesDomainUseCase,
        private getBeneficiaryDetailUseCase: GetBeneficiaryDetailDomainUseCase,
        private createBeneficiaryDomainUseCase: CreateBeneficiaryDomainUseCase,
        private updateBeneficiaryDomainUseCase: UpdateBeneficiaryDomainUseCase,
        private approveBeneficiaryDomainUseCase: ApproveBeneficiaryDomainUseCase,
        private archiveBeneficiaryDomainUseCase: ArchiveBeneficiaryDomainUseCase,
        private disapproveBeneficiaryDomainUseCase: DisapproveBeneficiaryDomainUseCase
    ) { }

    @Post()
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.SuperAdmin)
    async create(@Body() body: CreateBeneficiaryDto, @GetUser() user: User): Promise<CreateBeneficiaryResponseDto> {
        const bene = await this.createBeneficiaryDomainUseCase.handle(body, user);
        return new SuccessResponseV2({ beneficiary: bene });
    }

    @Delete(':id')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.SuperAdmin)
    async delete(@Param('id') id: string, @GetUser() user: User): Promise<DeleteBeneficiaryResponseDto> {
        await this.archiveBeneficiaryDomainUseCase.handle(id, user);
        return new SuccessResponseV2({message: 'Beneficiary deleted successfully'});
    }

    @Post('/approve/:id')
    @Roles(UserRole.SuperAdmin)
    async approve(@Param('id') id: string, @GetUser() user: User): Promise<ApproveAndDisapproveBeneficiaryResponseDto> {
        const result = await this.approveBeneficiaryDomainUseCase.handle({ id }, user);
        return new SuccessResponseV2(result);
    }

    @Post('/disapprove/:id')
    @Roles(UserRole.SuperAdmin)
    async disapprove(@Param('id') id: string, @GetUser() user: User): Promise<ApproveAndDisapproveBeneficiaryResponseDto> {
        const result = await this.disapproveBeneficiaryDomainUseCase.handle({ id }, user);
        return new SuccessResponseV2(result);
    }

    @Get('recent-paid')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser)
    async getCurrent(@GetUser() user: User): Promise<GetBeneficiariesPaginatedResponse> {
        const { pagination, beneficiaries } = await this.getCurrentBeneficiaryUseCase.handle(user);
        return new SuccessResponseV2(beneficiaries, pagination);
    }

    @Get()
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser, UserRole.SuperAdmin)
    async list(@Query() params: GetBeneficiariesDto, @GetUser() user: User): Promise<GetBeneficiariesPaginatedResponse> {
        const { pagination, beneficiaries } = await this.getBeneficiariesUseCase.handle(params, user);
        return new SuccessResponseV2(beneficiaries, pagination);
    }

    @Get('select')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser, UserRole.SuperAdmin)
    async listSelect(@Query() params: GetBeneficiariesSelectDto, @GetUser() user: User): Promise<GetBeneficiariesSelectPaginatedResponse> {
        const { pagination, beneficiaries } = await this.getBeneficiariesUseCase.handle(params, user);
        return new SuccessResponseV2(beneficiaries, pagination);
    }

    @Get(':id')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser, UserRole.SuperAdmin)
    async detail(@Param('id') id: string, @GetUser() user: User): Promise<GetBeneficiaryDetailResponse> {
        const benefiary = await this.getBeneficiaryDetailUseCase.handle({ id }, user);
        return new SuccessResponseV2(benefiary);
    }

    @Put(':id')
    @Roles(UserRole.SuperAdmin, ...ManagerRoles, UserRole.TeamMember)
    async update(@Param('id') id: string, @Body() body: UpdateBeneficiaryDto, @GetUser() user: User): Promise<BeneficiaryUpdateResponse> {
        const beneficiary = await this.updateBeneficiaryDomainUseCase.handle(id, body, user);
        return new SuccessResponseV2(beneficiary);
    }
}