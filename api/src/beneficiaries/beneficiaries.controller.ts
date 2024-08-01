import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Query, Request, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/roles.decorator';
import { SwiftCodeService } from '../swift-code/swift-code.service';
import { SuccessResponse } from '@cdaxfx/tools-misc';
import { BeneficiariesService } from './services/beneficiaries.service';
import { CreateBeneficiaryDto, UserRole, ManagerRoles, FilterBeneficiariesDTO, FilterBeneficiariesAccountDTO } from '@cdaxfx/tools-models';
import { ClientsService } from '../clients/clients.service';

@ApiTags('Beneficiaries')
@ApiBearerAuth()
@Controller('beneficiaries')
export class BeneficiariesController {
    constructor(
        private readonly beneficiariesService: BeneficiariesService,
        private readonly swiftCodeService: SwiftCodeService,
        private readonly clientsService: ClientsService,
    ) { }

    @Post('')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.SuperAdmin)
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Request() req, @Body() createBeneficiaryDto: CreateBeneficiaryDto) {
        const { beneficiary, errors } = await this.beneficiariesService.create(createBeneficiaryDto, req.user);
        if (beneficiary)
            return new SuccessResponse({ beneficiary, errors });
        else
            throw new BadRequestException({ errors });
    }

    @Get('')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser, UserRole.SuperAdmin)
    async list(@Request() req, @Query() query: FilterBeneficiariesDTO) {
        const data = await this.beneficiariesService.getActiveBeneficiaries(req.user, query);
        return new SuccessResponse(data);
    }

    @Post('review')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.SuperAdmin)
    @UsePipes(new ValidationPipe({ transform: true }))
    async review(@Body() createBeneficiaryDto: CreateBeneficiaryDto, @Request() req) {
        const bankDetails = await this.swiftCodeService.getBankDetails(createBeneficiaryDto, req.user);
        if (!bankDetails)
            throw new BadRequestException();
        else
            return new SuccessResponse(bankDetails);
    }

    @Get(':uuid')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.ViewerUser, UserRole.SuperAdmin)
    async fetch(@Param('uuid') uuid: string, @Request() req) {
        const beneficiary = await this.beneficiariesService.getOneForUser(req.user, uuid);
        if (beneficiary)
            return new SuccessResponse({ beneficiary });
        else
            throw new NotFoundException('Beneficiary was not found.');
    }

    @Post(':uuid')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.SuperAdmin)
    async update(@Param('uuid') uuid: string, @Request() req, @Body() beneficiaryDto: CreateBeneficiaryDto) {
        const beneficiaryDB = await this.beneficiariesService.getOneForUser(req.user, uuid);
        if (beneficiaryDB) {
            const { beneficiary, errors } = await this.beneficiariesService.update(
                beneficiaryDB,
                beneficiaryDto,
                req.user
            );

            if (beneficiary)
                return new SuccessResponse({ beneficiary, errors });
            else
                throw new BadRequestException({ errors });
        } 
        else {
            throw new NotFoundException('Beneficiary was not found.');
        }
    }

    @Delete(':uuid')
    @Roles(...ManagerRoles, UserRole.TeamMember, UserRole.SuperAdmin)
    async delete(@Param('uuid') uuid: string, @Request() req) {
        const beneficiary = await this.beneficiariesService.getOneForUser(req.user, uuid);

        if (beneficiary) {
            await this.beneficiariesService.deleteBeneficiary(beneficiary, req.user);
            return new SuccessResponse({ beneficiary });
        } 
        else {
            throw new NotFoundException('Beneficiary was not found.');
        }
    }

    @Post(':uuid/approve')
    @Roles(UserRole.SuperAdmin)
    async approve(@Param('uuid') uuid: string, @Request() req) {
        const beneficiary = await this.beneficiariesService.getOneForUser(req.user, uuid);

        if (beneficiary) {
            const updatedBeneficiary = await this.beneficiariesService.approveBeneficiary(beneficiary, req.user);
            return new SuccessResponse({ beneficiary: updatedBeneficiary });
        } 
        else {
            throw new NotFoundException('Beneficiary was not found.');
        }
    }

    @Get('client/:clientUuid')
    @Roles(UserRole.SuperAdmin)
    async listByClient(@Request() req, @Param('clientUuid') clientUuid: string, @Query() query: FilterBeneficiariesAccountDTO) {
        const client = await this.clientsService.findByUuidWithMetadata(clientUuid);

        if (!client?.account)
            throw new NotFoundException('Client was not found.');

        const data = await this.beneficiariesService.getActiveBeneficiariesByAccount(client.account.uuid, query);

        return new SuccessResponse(data);
    }
}
