import { NextFunction, Request, Response } from "express";
import { uploadImageInMemory } from "./upload.js";

// Simple in-memory limit so public screenshot endpoints can't be used to spam the Telegram chat
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_UPLOADS_PER_WINDOW = 5;

// Each route gets its own counter; only successful (201) uploads count toward the limit
export const createUploadLimiter = () => {
    const uploadsByIp = new Map<string, number[]>();

    return (req: Request, res: Response, next: NextFunction): void => {
        const ip = req.ip ?? "unknown";
        const now = Date.now();
        const recent = (uploadsByIp.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);

        if (recent.length >= MAX_UPLOADS_PER_WINDOW) {
            res.status(429).json({ message: "Too many uploads. Please wait a few minutes and try again." });
            return;
        }

        uploadsByIp.set(ip, recent);

        res.on("finish", () => {
            if (res.statusCode === 201) {
                uploadsByIp.get(ip)?.push(Date.now());
            }
        });
        next();
    };
};

// Run Multer and turn its errors (wrong file type, too large) into JSON responses
export const handleScreenshotUpload = (req: Request, res: Response, next: NextFunction): void => {
    uploadImageInMemory.single("screenshot")(req, res, (error: unknown) => {
        if (error) {
            const isTooLarge = (error as { code?: string }).code === "LIMIT_FILE_SIZE";
            res.status(400).json({
                message: isTooLarge
                    ? "The screenshot must be 5MB or smaller."
                    : error instanceof Error ? error.message : "Invalid file upload.",
            });
            return;
        }
        next();
    });
};
