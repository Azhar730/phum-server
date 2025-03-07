import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import multer from 'multer';
import config from '../config';
import { unlink } from 'fs';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const sendImageToCloudinary = async (
  imageName: string,
  path: string,
) => {
  (await cloudinary.uploader.upload(path, {
    public_id: imageName,
  })) as UploadApiResponse;
  unlink(path, (err) => {
    if (err) throw err;
    console.log(`successfully deleted ${path}`);
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});
export const upload = multer({ storage: storage });
