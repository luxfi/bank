import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SkipAccountSetup } from '../../auth/skip-account-setup.decorator';
import { SuccessResponse } from '@tools/misc';
import { DocumentsManagerService } from '../documents-manager.service';
import {
  AdminRoles,
  ClientsRepository,
  DocumentsRepository,
} from '@tools/models';
import { Roles } from '../../auth/roles.decorator';
import { AddClientDocumentDto } from '../dtos/add-client-documents.dto';
import { RemoveClientDocumentDto } from '../dtos/remove-client-documents.dto';

import { Response } from 'express';
import { getContentType } from '../utils/file-utils';

@ApiTags('Uploads')
@Controller('documents')
@SkipAccountSetup()
@Roles(...AdminRoles)
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsManagerService,
    private readonly clientsRepository: ClientsRepository,
    private readonly documentsRepository: DocumentsRepository,
  ) {}

  @ApiBearerAuth()
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (!file) {
      throw new BadRequestException();
    }

    const document = await this.documentsService.upload(req.user, file);
    return new SuccessResponse({ document });
  }

  @ApiBearerAuth()
  @Post('/client/:uuid')
  @UseInterceptors(FileInterceptor('file'))
  async addDocumentToClient(
    @Param('uuid') uuid: string,
    @Body() data: AddClientDocumentDto,
    @Request() req,
  ) {
    const client = await this.clientsRepository.findOne({ uuid });

    if (!client) {
      throw new BadRequestException({ message: 'Client not found.' });
    }

    const document = await this.documentsRepository.findOne({
      uuid: data.documentUuid,
    });

    if (!document) {
      throw new BadRequestException({ message: 'Document not found.' });
    }

    const clientDocument = await this.documentsService.addDocumentToClient(
      client,
      data.type,
      document,
    );

    return new SuccessResponse({ clientDocument });
  }

  @ApiBearerAuth()
  @Delete('client/:uuid')
  async deleteDocument(@Body() data: RemoveClientDocumentDto) {
    const doc = await this.documentsService.findByUuid(data.documentUuid);

    if (!doc) {
      throw new BadRequestException({ message: 'Document not found.' });
    }

    const clientDocument =
      await this.documentsService.findClientDocumentByDocument(doc);

    if (!clientDocument) {
      throw new BadRequestException({ message: 'Client Document not found.' });
    }

    await this.documentsService.remove(doc);
    await this.documentsService.removeClientDocument(clientDocument);

    return new SuccessResponse({ message: 'Document deleted.' });
  }

  @ApiBearerAuth()
  @Get(':uuid')
  async getDocument(@Param('uuid') uuid: string, @Res() res: Response) {
    const doc = await this.documentsService.findByUuid(uuid);

    if (!doc) {
      throw new BadRequestException({ message: 'Document not found.' });
    }

    const s3Data = await this.documentsService.getDocumentFromBucket(
      doc.ownCloudPath,
    );

    const fileExtension = doc.originalFilename.split('.').pop() as string;

    const contentType = getContentType(fileExtension);

    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${doc.originalFilename}`,
    );
    res.setHeader('Content-Type', contentType);

    res.send(s3Data.Body);
  }
}
