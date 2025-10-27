import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private configService;
    private storage;
    private bucketName;
    constructor(configService: ConfigService);
    uploadFile(file: Express.Multer.File, destination: string): Promise<string>;
    deleteFile(fileName: string): Promise<void>;
    getSignedUrl(fileName: string, expiresIn?: number): Promise<string>;
}
