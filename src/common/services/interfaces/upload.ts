export interface ImageService {
  uploadImage(file: string, folder: string): Promise<any>;
  deleteImage(publicId: string): Promise<any>;
}
