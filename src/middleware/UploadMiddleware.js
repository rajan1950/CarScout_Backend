const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, uploadDir);
    },
    filename:(req,file,cb)=>{
        const safeOriginalName = file.originalname.replace(/\s+/g, "-");
        cb(null, `${Date.now()}-${safeOriginalName}`); 
    }
})

const upload = multer({
    storage:storage,
});

module.exports = upload;