import { Module } from '@nestjs/common';
import { MikroOrmRegisteredForClients, MikroOrmRegisteredForDocumentsManager } from '@cdaxfx/tools-models';
import { DocumentsController } from './documents-controller/documents.controller';
import { DocumentsManagerService } from './documents-manager.service';

@Module({
    imports: [
        MikroOrmRegisteredForDocumentsManager(),
        MikroOrmRegisteredForClients()
    ],
    providers: [DocumentsManagerService],
    controllers: [DocumentsController],
    exports: [DocumentsManagerService]
})
export class DocumentsManagerModule { }
