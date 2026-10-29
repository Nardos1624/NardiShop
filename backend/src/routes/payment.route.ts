import { NextFunction, Request, Response, Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { uploadImageInMemory } from "../middleware/upload.js";

const router = Router();
const paymentController = new PaymentController();

// Simple in-memory limit so the public endpoint can't be used to spam the Telegram chat
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_UPLOADS_PER_WINDOW = 5;
const uploadsByIp = new Map<string, number[]>();

const limitUploads = (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip ?? "unknown";
    const now = Date.now();
    const recent = (uploadsByIp.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);

    if (recent.length >= MAX_UPLOADS_PER_WINDOW) {
        res.status(429).json({ message: "Too many uploads. Please wait a few minutes and try again." });
        return;
    }

    uploadsByIp.set(ip, recent);

    // Only screenshots that actually reach Telegram count toward the limit
    res.on("finish", () => {
        if (res.statusCode === 201) {
            uploadsByIp.get(ip)?.push(Date.now());
        }
    });
    next();
};

// Run Multer and turn its errors (wrong file type, too large) into JSON responses
const handleScreenshotUpload = (req: Request, res: Response, next: NextFunction): void => {
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

// POST /api/payments/screenshot - Send a payment screenshot to the shop's Telegram (Public)
router.post("/screenshot", limitUploads, handleScreenshotUpload, paymentController.sendScreenshot);

export default router;
