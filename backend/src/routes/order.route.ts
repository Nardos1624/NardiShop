import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticateToken, optionalAuth, requireAdmin } from "../middleware/auth.js";
import { createUploadLimiter, handleScreenshotUpload } from "../middleware/screenshot-upload.js";

const router = Router();
const orderController = new OrderController();

// POST /api/orders - Place an order with the checkout form and payment screenshot (Public; guests allowed)
router.post("/", createUploadLimiter(), optionalAuth as any, handleScreenshotUpload, orderController.placeOrder);

// Apply authentication middleware to all order endpoints below
router.use(authenticateToken as any);

// POST /api/orders/checkout - Process checkout transaction
router.post("/checkout", orderController.checkout);

// GET /api/orders/my-orders - View historical purchase receipts
router.get("/my-orders", orderController.getMyOrders);

// GET /api/orders - List every order (Admin Only)
router.get("/", requireAdmin as any, orderController.getAllOrders);

// GET /api/orders/:id/screenshot - View an order's payment screenshot (Admin Only)
router.get("/:id/screenshot", requireAdmin as any, orderController.getPaymentScreenshot);

export default router;