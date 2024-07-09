import { Module } from '@nestjs/common';
import {
  MikroOrmRegisteredForClients,
  MikroOrmRegisteredForDocumentsManager,
} from '@tools/models';
import { DocumentsController } from './documents-controller/documents.controller';
import { DocumentsManagerService } from './documents-manager.service';
import { ClientsModule } from '../clients/clients.module';

@Module({
  imports: [
    MikroOrmRegisteredForDocumentsManager(),
    MikroOrmRegisteredForClients(),
  ],
  providers: [DocumentsManagerService],
  controllers: [DocumentsController],
  exports: [DocumentsManagerService],
})
export class DocumentsManagerModule {}
