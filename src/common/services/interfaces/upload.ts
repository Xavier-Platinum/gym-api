export interface ImageService {
  uploadImage(file: Express.Multer.File, folder: string): Promise<any>;
  deleteImage(publicId: string): Promise<any>;
}
