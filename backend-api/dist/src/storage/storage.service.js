"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const storage_1 = require("@google-cloud/storage");
let StorageService = class StorageService {
    constructor(configService) {
        this.configService = configService;
        this.storage = new storage_1.Storage({
            projectId: this.configService.get('GCP_PROJECT_ID'),
            keyFilename: this.configService.get('GCP_KEY_FILE'),
        });
        this.bucketName = this.configService.get('GCS_BUCKET_NAME', 'siraop-storage');
    }
    async uploadFile(file, destination) {
        try {
            const fileName = `${destination}`;
            const bucket = this.storage.bucket(this.bucketName);
            const fileUpload = bucket.file(fileName);
            const stream = fileUpload.createWriteStream({
                metadata: {
                    contentType: file.mimetype,
                    metadata: {
                        originalName: file.originalname,
                        uploadedAt: new Date().toISOString(),
                    },
                },
            });
            return new Promise((resolve, reject) => {
                stream.on('error', (error) => {
                    reject(error);
                });
                stream.on('finish', () => {
                    const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
                    resolve(publicUrl);
                });
                stream.end(file.buffer);
            });
        }
        catch (error) {
            throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
        }
    }
    async deleteFile(fileName) {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            await bucket.file(fileName).delete();
        }
        catch (error) {
            throw new Error(`Erro ao deletar arquivo: ${error.message}`);
        }
    }
    async getSignedUrl(fileName, expiresIn = 3600) {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            const file = bucket.file(fileName);
            const [signedUrl] = await file.getSignedUrl({
                action: 'read',
                expires: Date.now() + expiresIn * 1000,
            });
            return signedUrl;
        }
        catch (error) {
            throw new Error(`Erro ao gerar URL assinada: ${error.message}`);
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map