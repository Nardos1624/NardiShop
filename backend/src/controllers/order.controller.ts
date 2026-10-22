import { Request, Response } from "express";
import { OrderService } from "../services/order.service.js"; // Ensure standard extensions

export class OrderController {
    private orderService = new OrderService();

    // Trigger complete cart checkout and generate localized Addis Ababa invoice receipt
    checkout = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized. Missing execution token payload." });
                return;
            }

            // The service now builds a clean, structured receipt payload with ETB values
            const localizedReceipt = await this.orderService.checkout(userId);
            
            res.status(201).json({
                message: "Order finalized successfully! Receipt generated.",
                receipt: localizedReceipt // Updated to return your itemized receipt layout
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    // Fetch personal order history logs for the authenticated customer
    getMyOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized. Missing tracking token payload." });
                return;
            }

            const purchaseHistory = await this.orderService.getUserOrders(userId);
            res.status(200).json(purchaseHistory);
        } catch (error: any) {
            res.status(500).json({ message: "Could not fetch order logs", error: error.message });
        }
    };
}