import multer from "multer";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { IFileUpload, TFile } from "../app/interfaces/file";

cloudinary.config({
  cloud_name: "dmltobgnv",
  api_key: "498448324621232",
  api_secret: "yZ7KPQiHOHjP219sjBXAPKcpXxY",
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Upload an image
export const uploadToCloudinary = async (file: TFile): Promise<IFileUpload> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: IFileUpload) => {
        fs.unlinkSync(file.path);
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const upload = multer({ storage: storage });

export const fileUploader = {
  upload,
  uploadToCloudinary,
};
