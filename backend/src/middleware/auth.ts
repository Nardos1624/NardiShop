import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 1. Extend the Express Request interface safely
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;               // UUID string format
        role: "customer" | "admin";
    };
}

// 2. Middleware to verify if a user is securely logged in
export const authenticateToken = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Access token missing. Please log in first." });
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || "fallback_secret_key";
        const decoded = jwt.verify(token, secret) as { id: string; role: "customer" | "admin" };

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();
    } catch (error) {
        res.status(403).json({ message: "Session invalid or expired. Authentication failed." });
        return;
    }
};

// 3. Middleware for public routes: attaches the user when a valid token is sent, but lets guests through
export const optionalAuth = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
        try {
            const secret = process.env.JWT_SECRET || "fallback_secret_key";
            const decoded = jwt.verify(token, secret) as { id: string; role: "customer" | "admin" };
            req.user = { id: decoded.id, role: decoded.role };
        } catch {
            // An expired or invalid token just means the order is placed as a guest
        }
    }

    next();
};

// 4. Middleware to enforce Role-Based Access Control (RBAC)
export const requireAdmin = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    
    // Safety check: ensure user is authenticated
    if (!req.user) {
        res.status(401).json({ message: "Unauthorized. Authentication context missing." });
        return;
    }

    // Verify admin role
    if (req.user.role !== "admin") {
        res.status(403).json({ message: "Access denied. Administrator privileges required." });
        return;
    }

    // Pass control to the next handler block
    next();
}; // <-- This closing bracket closes the requireAdmin function completely!