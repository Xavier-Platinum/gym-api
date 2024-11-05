import { ConfigService } from '@nestjs/config';
import { ImageService } from '../interfaces/upload';
export declare class CloudinaryService implements ImageService {
    private configService;
    constructor(configService: ConfigService);
    uploadImage(file: Express.Multer.File, folder: string): Promise<any>;
    deleteImage(publicId: string): Promise<any>;
}
