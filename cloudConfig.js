 const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");
require("dotenv").config();

// 🔹 Cloudinary Config
cloudinary.config(); // automatically uses process.env.CLOUDINARY_URL

// 🔹 Multer memory storage (same for all routes)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔹 Reusable function to upload to Cloudinary
const uploadToCloudinary = (fileBuffer, folderName, publicId = undefined) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        public_id: publicId,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };
