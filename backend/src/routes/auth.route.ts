import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = Router();
const authController = new AuthController();

// 1. POST /api/auth/register - Register a standard user profile (Public)
router.post("/register", authController.register);

// 2. POST /api/auth/login - Authenticate credentials and get signed JWT with Role (Public)
router.post("/login", authController.login);

// 3. POST /api/auth/change-password - Update password from dashboard (Protected - Logged in only)
router.post("/change-password", authenticateToken as any, authController.changePassword);

// 4. POST /api/auth/forgot-password - Submit email to trigger random secure token string (Public)
router.post("/forgot-password", authController.forgotPassword);

// 5. POST /api/auth/reset-password - Submit active token alongside new password value (Public)
router.post("/reset-password", authController.resetPassword);

export default router;