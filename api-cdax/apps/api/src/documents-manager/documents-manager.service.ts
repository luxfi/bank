import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Document, DocumentType, DocumentsRepository, ClientDocumentsRepository, User, S3Object, ClientDocument, Client } from '@cdaxfx/tools-models';
import * as AWS from 'aws-sdk';

@Injectable()
export class DocumentsManagerService {
    private s3: AWS.S3;
    private logger: Logger = new Logger(DocumentsManagerService.name);

    constructor(
        private readonly documentsRepository: DocumentsRepository,
        private readonly clientDocumentsRepository: ClientDocumentsRepository
    ) {
        this.s3 = new AWS.S3({
            region: 'us-east-1',
            endpoint: process.env.AWS_IS_LOCAL ? 'http://localstack:4566' : undefined,
            credentials: process.env.AWS_IS_LOCAL ? { accessKeyId: 'test', secretAccessKey: 'test' } : undefined
        });
    }

    async uploadImage(user: User, file: Express.Multer.File): Promise<string> {
        try {
            this.logger.log(`:: uploadImage ::`);
            const bucketName = process.env.S3_BUCKET_NAME_IMAGES ?? '';
            const fileName = `image-${user.uuid}-${Date.now()}.${file.mimetype.split('/')[1]}`;

            this.logger.log(`:: uploadImage ${file.originalname} to ${bucketName} ::`,);

            await this.s3.upload({Bucket: bucketName, Key: `images/${fileName}`, Body: file.buffer}).promise();

            return fileName;
        } 
        catch (error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('File was not uploaded.');
        }
    }

    async getDocumentFromBucket(key: string): Promise<S3Object> {
        try {
            const params = {
                Bucket: process.env.S3_BUCKET_NAME ?? '',
                Key: key
            };
            const data = await this.s3.getObject(params).promise();
            return data as S3Object;
        } 
        catch (error) {
            throw new BadRequestException(`Failed to retrieve image from S3: ${(error as any).message}`);
        }
    }

    async upload(user: User, file: Express.Multer.File): Promise<Document> {
        console.log('Upload:');
        const bucketName = process.env.S3_BUCKET_NAME ?? '';
        const path = `uploads/${user.username}`;
        const destinationFilename = `${path}/${Date.now()} - ${file.originalname}`;

        const params = {
            Bucket: bucketName,
            Key: destinationFilename,
            Body: file.buffer
        };

        try {
            console.log(`Uploading ${file.originalname} to ${bucketName}...`);
            await this.s3.upload(params).promise();
            console.log('File uploaded to S3');
            const document = Document.create(file.originalname, destinationFilename, user);

            await this.documentsRepository.getEntityManager().persistAndFlush(document);
            console.log('Document saved to database');

            return document;
        } 
        catch (error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('File was not uploaded.');
        }
    }

    async addDocumentToClient(client: Client, type: DocumentType, document: Document): Promise<ClientDocument> {
        const exist = await this.clientDocumentsRepository.findByDocument(document);

        if (exist)
            throw new BadRequestException('Document already added.');

        try {
            if (type !== DocumentType.Other) {
                const exixtingDocumentType = await this.clientDocumentsRepository.findByDocumentType(client, type);
                if (exixtingDocumentType) {
                    await this.remove(exixtingDocumentType.document);
                    await this.removeClientDocument(exixtingDocumentType);
                }
            }

            const clientDocument = ClientDocument.create(document, client, type);

            await this.clientDocumentsRepository.getEntityManager().persistAndFlush(clientDocument);

            return clientDocument;
        } 
        catch (error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('Failed to add document to client.');
        }
    }

    async finalize(document: Document, type: DocumentType): Promise<Document> {
        const bucketName = process.env.S3_BUCKET_NAME ?? '';
        const oldKey = document.ownCloudPath;

        const newPath = `finalized/${document.creator.username} (${document.creator.uuid})/${type} - ${new Date().toISOString()} - ${document.originalFilename}`;
        const newKey = `${newPath}/${document.originalFilename}`;

        try {
            console.log(`Copying ${oldKey} to ${newKey} into bucket ${bucketName}`);

            await this.s3.copyObject({Bucket: bucketName, CopySource: encodeURIComponent(`${bucketName}/${oldKey}`), Key: newKey}).promise();

            console.log('File copied to new location');

            await this.s3.deleteObject({Bucket: bucketName, Key: oldKey}).promise();
            console.log('File deleted from old location');

            document.ownCloudPath = newKey;
            await this.documentsRepository.getEntityManager().persistAndFlush(document);
            console.log('Document saved to database');

            return document;
        } 
        catch (error) {
            this.logger.error(`Error finalizing document: ${(error as any).message}`, (error as any).stack);
            throw new BadRequestException('Document could not be finalized.');
        }
    }

    async remove(document: Document) {
        const bucketName = process.env.S3_BUCKET_NAME ?? '';
        const params = {
            Bucket: bucketName,
            Key: document.ownCloudPath
        };

        try {
            await this.s3.deleteObject(params).promise();
        } 
        catch (error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('File could not be deleted.');
        }
    }

    async removeClientDocument(clientDocument: ClientDocument) {
        try {
            await this.clientDocumentsRepository.getEntityManager().removeAndFlush(clientDocument);
        } 
        catch (error) {
            this.logger.error((error as any).message, (error as any).stack);
            throw new BadRequestException('File could not be deleted from client.');
        }
    }

    async findByUuid(uuid: string): Promise<Document | null> {
        try {
            const document = await this.documentsRepository.findOne({ uuid: uuid });
            if (!document)
                throw new BadRequestException(`Document with UUID ${uuid} not found.`);
            return document;
        } 
        catch (error) {
            this.logger.error(`Error finding document by UUID: ${(error as any).message}`, (error as any).stack);
            throw new BadRequestException('Document not found.');
        }
    }

    async findClientDocumentByDocument(document: Document): Promise<ClientDocument | null> {
        try {
            const clientDocument = await this.clientDocumentsRepository.findByDocument(document);
            return clientDocument;
        } 
        catch (error) {
            this.logger.error(`Error finding document by UUID: ${(error as any).message}`, (error as any).stack);
            throw new BadRequestException('Client document not found.');
        }
    }
}