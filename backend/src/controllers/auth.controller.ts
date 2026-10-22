import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js"; // Standardized extensions
import { User } from "../entities/User.entity.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { MoreThan } from "typeorm";

export class AuthController {
    private userRepository = AppDataSource.getRepository(User);

    // 1. Register a brand new user (Defaults to "customer" role via Entity configuration)
    register = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).json({ message: "Email and password are required" });
                return;
            }

            const existingUser = await this.userRepository.findOneBy({ email });
            if (existingUser) {
                res.status(400).json({ message: "A user with this email already exists" });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = this.userRepository.create({
                email,
                password: hashedPassword
                // role is auto-assigned as 'customer' inside your Entity definition schema
            });

            await this.userRepository.save(newUser);
            res.status(201).json({ message: "User registered successfully!" });
        } catch (error: any) {
            res.status(500).json({ message: "Registration failed", error: error.message });
        }
    };

    // 2. Authenticate a user and sign a token (Updated to include Role)
    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const body = req.body as { email?: unknown; password?: unknown } | undefined;
            const email = typeof body?.email === "string" ? body.email.trim() : "";
            const password = typeof body?.password === "string" ? body.password : "";

            if (!email || !password) {
                res.status(400).json({ message: "Email and password are required." });
                return;
            }

            const user = await this.userRepository.findOneBy({ email });
            if (!user) {
                res.status(401).json({ message: "Invalid email or password" });
                return;
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ message: "Invalid email or password" });
                return;
            }

            const secret = process.env.JWT_SECRET || "fallback_secret";
            
            // UPDATED: Added user.role into the signed JWT token block payload
            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                secret, 
                { expiresIn: "24h" }
            );

            res.status(200).json({
                message: "Login successful",
                token,
                user: { 
                    id: user.id, 
                    email: user.email,
                    role: user.role // Output the user's role context back to the client layout
                }
            });
        } catch (error: any) {
            console.error("Login failed:", error);
            res.status(500).json({ message: "Login failed", error: error.message });
        }
    };

    // 3. Change Password (Authenticated Flow)
    changePassword = async (req: Request, res: Response): Promise<void> => {
        try {
            // Pick up user context left behind by authenticateToken middleware
            const userId = (req as any).user?.id;
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                res.status(400).json({ message: "Both current and new passwords are required." });
                return;
            }

            const user = await this.userRepository.findOneBy({ id: userId as string });
            if (!user) {
                res.status(404).json({ message: "User profile not found." });
                return;
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                res.status(400).json({ message: "Incorrect current password configuration." });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await this.userRepository.save(user);

            res.status(200).json({ message: "Password updated successfully!" });
        } catch (error: any) {
            res.status(500).json({ message: "Failed to update profile password", error: error.message });
        }
    };

    // 4. Request Password Reset Link Token (Public Flow Step 1)
    forgotPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email } = req.body;

            if (!email) {
                res.status(400).json({ message: "Email address is required." });
                return;
            }

            const user = await this.userRepository.findOneBy({ email });

            if (user) {
                // Generate an unguessable 40-character hex crypto-string string
                const token = crypto.randomBytes(20).toString("hex");

                const expiresDelay = new Date();
                expiresDelay.setHours(expiresDelay.getHours() + 1); // Valid for exactly 1 Hour

                user.resetPasswordToken = token;
                user.resetPasswordExpires = expiresDelay;
                await this.userRepository.save(user);

                // For early stage environment testing, log token details straight to your runtime terminal
                console.log(`\n📨 [PASSWORD RESET TOKEN FOR ${email}]: ${token}\n`);
            }

            res.status(200).json({ 
                message: "If that email matches an account, a secure reset token has been generated successfully." 
            });
        } catch (error: any) {
            res.status(500).json({ message: "Failed to dispatch recovery token", error: error.message });
        }
    };

    // 5. Consume Token and Overwrite Password (Public Flow Step 2)
    resetPassword = async (req: Request, res: Response): Promise<void> => {
        try {
            const { token, newPassword } = req.body;

            if (!token || !newPassword) {
                res.status(400).json({ message: "Token and new password parameters are required." });
                return;
            }

            // Look for a user matching the token whose token expiration timestamp is ahead of now
            const user = await this.userRepository.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: MoreThan(new Date())
                }
            });

            if (!user) {
                res.status(400).json({ message: "Password reset token is invalid or has expired." });
                return;
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            
            // Clean out reset fields to prevent token reuse
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await this.userRepository.save(user);

            res.status(200).json({ message: "Your password has been reset successfully. You can now log in!" });
        } catch (error: any) {
            res.status(500).json({ message: "Failed to execute password rewrite reset", error: error.message });
        }
    };
}