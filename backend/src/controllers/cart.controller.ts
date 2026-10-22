import { Request, Response } from "express";
import { CartService } from "../services/cart.service.js"; // Standardized extensions

export class CartController {
    private cartService = new CartService();

    // Add item to shopping cart
    addToCart = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id; 
            const { productId, quantity } = req.body;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized. Missing authentication context." });
                return;
            }

            if (!productId || !quantity) {
                res.status(400).json({ message: "Product ID and quantity are required" });
                return;
            }

            // FIXED: Removed parseInt() from productId. Keeping it as a pure string.
            const item = await this.cartService.addToCart(userId, productId, Number(quantity));
            
            res.status(200).json({ message: "Item added to cart successfully", item });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };

    // Retrieve active cart list
    getCart = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized. Missing authentication context." });
                return;
            }

            const items = await this.cartService.getCart(userId);
            res.status(200).json(items);
        } catch (error: any) {
            res.status(500).json({ message: "Could not retrieve cart", error: error.message });
        }
    };

    // Remove single line item
    removeFromCart = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = (req as any).user?.id;
            const { id } = req.params; // This is the cartItemId string from the URL path

            if (!userId) {
                res.status(401).json({ message: "Unauthorized. Missing authentication context." });
                return;
            }

            if (!id) {
                res.status(400).json({ message: "Cart item parameter ID is required" });
                return;
            }

            // FIXED: Removed parseInt(). Passing 'id' cleanly as a raw string UUID wrapper.
            await this.cartService.removeFromCart(userId, id as string);
            
            res.status(200).json({ message: "Item removed from cart successfully" });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    };
}