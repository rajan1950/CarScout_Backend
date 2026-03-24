const cloudinary = require("cloudinary").v2;
require("dotenv").config(); 


const uploadToCloudinary = async (filePath) => {

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    if (!filePath) {
        throw new Error("File path is required for Cloudinary upload");
    }

    const response = await cloudinary.uploader.upload(filePath);
    return response;
};

module.exports = {
    uploadToCloudinary
};