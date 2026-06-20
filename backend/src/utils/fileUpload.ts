import { uploadOnCloudinary } from "./cloudinary.js";

interface CloudinaryFile {
  url: string;
  publicId: string;
  filename: string;
  mimeType: string;
  size: number;
}

export const uploadOneToCloudinary = async (file: Express.Multer.File): Promise<CloudinaryFile | null> => {
  if (!file) return null;

  const result = await uploadOnCloudinary(file.path);
  if (!result) return null;

  return {
    url: result.secure_url,
    publicId: result.public_id,
    filename: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};

export const uploadManyToCloudinary = async (files: Express.Multer.File[] = []): Promise<CloudinaryFile[]> => {
  if (!files.length) return [];

  const results = await Promise.all(
    files.map((file) => uploadOnCloudinary(file.path))
  );

  return results
    .map((result, index) => {
      if (!result) return null;

      return {
        url: result.secure_url,
        publicId: result.public_id,
        filename: files[index].originalname,
        mimeType: files[index].mimetype,
        size: files[index].size,
      };
    })
    .filter((res): res is CloudinaryFile => res !== null);
};
