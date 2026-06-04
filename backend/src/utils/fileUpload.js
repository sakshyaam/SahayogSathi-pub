import { uploadOnCloudinary } from "./cloudinary.js";

export const uploadOneToCloudinary = async (file) => {
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

export const uploadManyToCloudinary = async (files = []) => {
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
    .filter(Boolean);
};