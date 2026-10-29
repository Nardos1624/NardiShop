import { Router } from "express";
import { PaymentController } from "../controllers/payment.controller.js";
import { createUploadLimiter, handleScreenshotUpload } from "../middleware/screenshot-upload.js";

const router = Router();
const paymentController = new PaymentController();

// POST /api/payments/screenshot - Send a payment screenshot to the shop's Telegram (Public)
router.post("/screenshot", createUploadLimiter(), handleScreenshotUpload, paymentController.sendScreenshot);

export default router;
