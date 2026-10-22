import { Router } from "express";
import { CartController } from "../controllers/cart.controller";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
const cartController = new CartController();

// Apply authentication middleware to all cart endpoints below
router.use(authenticateToken as any);

// POST /api/cart - Add items or update item quantity
router.post("/", cartController.addToCart);

// GET /api/cart - Fetch current active cart lines
router.get("/", cartController.getCart);

// DELETE /api/cart/:id - Drop a specific item from the cart
router.delete("/:id", cartController.removeFromCart);

export default router;