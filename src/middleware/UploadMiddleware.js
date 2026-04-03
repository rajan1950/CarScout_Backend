const multer = require("multer");

const storage = multer.memoryStorage();

const imageFileFilter = (req, file, cb) => {
    if (!file || !file.mimetype || !file.mimetype.startsWith("image/")) {
        return cb(new Error("Only image files are allowed"), false);
    }

    return cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

module.exports = upload;