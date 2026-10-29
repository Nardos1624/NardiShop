import multer from "multer";
import path from "path";
import { Request } from "express";
import { fileURLToPath } from "node:url";

// Folder of product photos uploaded before images were stored in the database
export const uploadDirectory = fileURLToPath(new URL("../../uploads/", import.meta.url));

// 1. Filter files to ensure only images are accepted
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

// 2. Keep uploads in memory; they're compressed and saved in the database (not on disk)
export const uploadImageInMemory = multer({
    storage: multer.memoryStorage(),
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB File Limit Max
});