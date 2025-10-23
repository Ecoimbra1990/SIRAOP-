import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    this.storage = new Storage({
      projectId: this.configService.get<string>('GCP_PROJECT_ID'),
      keyFilename: this.configService.get<string>('GCP_KEY_FILE'), // Para desenvolvimento local
    });
    
    this.bucketName = this.configService.get<string>('GCS_BUCKET_NAME', 'siraop-storage');
  }

  async uploadFile(file: Express.Multer.File, destination: string): Promise<string> {
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
    } catch (error) {
      throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      await bucket.file(fileName).delete();
    } catch (error) {
      throw new Error(`Erro ao deletar arquivo: ${error.message}`);
    }
  }

  async getSignedUrl(fileName: string, expiresIn: number = 3600): Promise<string> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(fileName);
      
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresIn * 1000,
      });

      return signedUrl;
    } catch (error) {
      throw new Error(`Erro ao gerar URL assinada: ${error.message}`);
    }
  }
}
