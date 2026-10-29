import multer from "multer";
import path from "path";
import { Request } from "express";
import { fileURLToPath } from "node:url";

export const uploadDirectory = fileURLToPath(new URL("../../uploads/", import.meta.url));

// 1. Configure storage destination and filename strategy
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },
    filename: (req, file, cb) => {
        // Generates a unique name: timestamp-randomnumber.extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 2. Filter files to ensure only images are accepted
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only images (.jpeg, .jpg, .png, .webp) are allowed!"));
    }
};

// 3. Export configured middleware execution block
export const uploadImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB File Limit Max
});

// 4. Same image rules, but kept in memory instead of saved to disk
// (used for payment screenshots that are forwarded straight to Telegram)
export const uploadImageInMemory = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB File Limit Max
});