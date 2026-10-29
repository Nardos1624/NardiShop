import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticateToken, requireAdmin } from "../middleware/auth.js"; // Chained admin gatekeeper
import { uploadImageInMemory } from "../middleware/upload.js"; // Multer image handler

const router = Router();
const productController = new ProductController();

// GET /api/products - View all products (Public)
router.get("/", productController.getAllProducts);

// GET /api/products/:id - View single product details (Public)
router.get("/:id", productController.getProductById);

// POST /api/products - Create a new product with an image (Admin Only)
router.post(
    "/", 
    [authenticateToken as any, requireAdmin as any, uploadImageInMemory.single("image") as any], 
    productController.createProduct
);

// DELETE /api/products/:id - Remove a product from the catalog (Admin Only)
router.delete(
    "/:id", 
    [authenticateToken as any, requireAdmin as any], 
    productController.deleteProduct
);

export default router;