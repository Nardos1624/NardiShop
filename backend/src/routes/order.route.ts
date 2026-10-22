import { Router } from "express";
import { OrderController } from "../controllers/order.controller";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
const orderController = new OrderController();

// Apply authentication middleware to all order endpoints below
router.use(authenticateToken as any);

// POST /api/orders/checkout - Process checkout transaction
router.post("/checkout", orderController.checkout);

// GET /api/orders/my-orders - View historical purchase receipts
router.get("/my-orders", orderController.getMyOrders);

export default router;