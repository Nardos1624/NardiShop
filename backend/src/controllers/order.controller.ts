import { Request, Response } from "express";
import { CheckoutCustomer, CheckoutLine, OrderService } from "../services/order.service.js"; // Ensure standard extensions
import { Order } from "../entities/Order.entity.js";
import { MAX_CAPTION_LENGTH, TelegramPhoto, TelegramService } from "../services/telegram.service.js";
import { compressImage, IMAGE_LIMITS, ImageData, ImageService, InvalidImageError } from "../services/image.service.js";

const field = (value: unknown, maxLength: number): string =>
    typeof value === "string" ? value.trim().slice(0, maxLength) : "";

const PHONE_PATTERN = /^\+?[0-9][0-9 -]{7,18}$/;
const TELEGRAM_USERNAME_PATTERN = /^[A-Za-z0-9_]{5,32}$/;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_ORDER_LINES = 50;

// Turn the "items" form field (a JSON list) into validated order lines, or null if it's invalid
const parseLines = (raw: unknown): CheckoutLine[] | null => {
    let parsed: unknown;
    try {
        parsed = JSON.parse(typeof raw === "string" ? raw : "");
    } catch {
        return null;
    }
    if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > MAX_ORDER_LINES) return null;

    const lines: CheckoutLine[] = [];
    for (const item of parsed) {
        const productId = field(item?.productId, 36);
        const quantity = Number(item?.quantity);
        if (!UUID_PATTERN.test(productId) || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
            return null;
        }
        lines.push({ productId, quantity, size: field(item?.size, 20) || null });
    }
    return lines;
};

const formatEtb = (amount: number | string | null): string => `${Number(amount ?? 0).toFixed(2)} ETB`;

// Plain-text summary of an order for the shop's Telegram chat
const buildOrderMessage = (order: Order): string => {
    const placedAt = order.createdAt.toLocaleString("en-US", {
        timeZone: "Africa/Addis_Ababa",
        dateStyle: "medium",
        timeStyle: "short",
    });

    const items = order.orderItems.map((item) => {
        const size = item.size ? ` (Size ${item.size})` : "";
        return `• ${item.productName}${size} × ${item.quantity} — ${formatEtb(Number(item.price) * item.quantity)}`;
    });

    return [
        `🛍️ New order ${order.invoiceNumber} — NardiShop`,
        "",
        `👤 Name: ${order.firstName} ${order.lastName}`,
        `✈️ Telegram: @${order.telegramUsername}`,
        `📞 Phone: ${order.phone}`,
        order.secondPhone ? `📞 Second phone: ${order.secondPhone}` : null,
        `🏙️ City: ${order.city}`,
        `📍 Address: ${order.address}`,
        "",
        "📦 Items:",
        ...items,
        "",
        `💰 Total: ${formatEtb(order.total)}`,
        `✅ Paid now (50%): ${formatEtb(order.amountPaid)}`,
        `🚚 Pay on delivery: ${formatEtb(Number(order.total) - Number(order.amountPaid))}`,
        order.user ? `🔑 Account: ${order.user.email}` : "🔑 Guest checkout",
        `🕒 Placed: ${placedAt}`,
    ]
        .filter((line) => line !== null)
        .join("\n");
};

export class OrderController {
    private orderService = new OrderService();
    private telegramService = new TelegramService();
    private imageService = new ImageService();

    // Place an order from the checkout form with its payment screenshot (Public; guests allowed)
    placeOrder = async (req: Request, res: Response): Promise<void> => {
        const customer: CheckoutCustomer = {
            firstName: field(req.body.firstName, 60),
            lastName: field(req.body.lastName, 60),
            telegramUsername: field(req.body.telegramUsername, 33).replace(/^@/, ""),
            phone: field(req.body.phone, 20),
            secondPhone: field(req.body.secondPhone, 20) || null,
            city: field(req.body.city, 60),
            address: field(req.body.address, 200),
        };

        if (!customer.firstName || !customer.lastName || !customer.city || !customer.address) {
            res.status(400).json({ message: "Please fill in your name, city and address." });
            return;
        }
        if (!TELEGRAM_USERNAME_PATTERN.test(customer.telegramUsername)) {
            res.status(400).json({ message: "Please enter a valid Telegram username, e.g. @nardishop." });
            return;
        }
        if (!PHONE_PATTERN.test(customer.phone) || (customer.secondPhone && !PHONE_PATTERN.test(customer.secondPhone))) {
            res.status(400).json({ message: "Please enter a valid phone number, e.g. +251912345678." });
            return;
        }

        const lines = parseLines(req.body.items);
        if (!lines) {
            res.status(400).json({ message: "Your cart is empty or invalid. Please refresh the page and try again." });
            return;
        }

        if (!req.file) {
            res.status(400).json({ message: "Please attach the screenshot of your payment." });
            return;
        }

        let screenshot: ImageData;
        let order: Order;
        try {
            screenshot = await compressImage(req.file.buffer, IMAGE_LIMITS.screenshot);
            const userId = (req as any).user?.id ?? null;
            order = await this.orderService.placeOrder(customer, lines, screenshot, userId);
        } catch (error: any) {
            if (error instanceof InvalidImageError) {
                res.status(400).json({ message: error.message });
                return;
            }
            console.error("Failed to place order:", error);
            res.status(400).json({ message: error.message || "We couldn't place your order. Please try again." });
            return;
        }

        // The order is already saved, so a Telegram problem must not fail the checkout
        try {
            // Payment screenshot first, then one photo per ordered product
            const photos: TelegramPhoto[] = [{ ...screenshot, fileName: "payment-screenshot.jpg" }];
            const imageIds = new Set(order.orderItems.flatMap((item) => (item.productImage ? [item.productImage.id] : [])));
            for (const imageId of imageIds) {
                const image = await this.imageService.getImage(imageId);
                if (image) photos.push({ ...image, fileName: `product-${photos.length}.jpg` });
            }

            const message = buildOrderMessage(order);
            if (message.length <= MAX_CAPTION_LENGTH) {
                await this.telegramService.sendPhotoAlbum(photos, message);
            } else {
                await this.telegramService.sendPhotoAlbum(photos, `💳 Payment screenshot and products for order ${order.invoiceNumber}`);
                await this.telegramService.sendMessage(message);
            }
            await this.orderService.markTelegramSent(order.id);
        } catch (error) {
            console.error(`Order ${order.invoiceNumber} was saved but not sent to Telegram:`, error);
        }

        res.status(201).json({
            message: "Your order was placed successfully.",
            order: {
                id: order.id,
                invoiceNumber: order.invoiceNumber,
                total: Number(order.total),
                amountPaid: Number(order.amountPaid),
            },
        });
    };

    // List every order with its customer details (Admin only)
    getAllOrders = async (req: Request, res: Response): Promise<void> => {
        try {
            const orders = await this.orderService.getAllOrders();
            // Only expose the account's email, never its password hash
            res.status(200).json(orders.map(({ user, ...order }) => ({
                ...order,
                user: user ? { id: user.id, email: user.email } : null,
            })));
        } catch (error: any) {
            res.status(500).json({ message: "Could not fetch orders", error: error.message });
        }
    };

    // Send back the payment screenshot image of one order (Admin only)
    getPaymentScreenshot = async (req: Request, res: Response): Promise<void> => {
        try {
            const orderId = String(req.params.id);
            if (!UUID_PATTERN.test(orderId)) {
                res.status(404).json({ message: "Screenshot not found." });
                return;
            }

            const screenshot = await this.orderService.getPaymentScreenshot(orderId);
            if (!screenshot) {
                res.status(404).json({ message: "Screenshot not found." });
                return;
            }

            res.setHeader("Content-Type", screenshot.mimeType);
            res.setHeader("Cache-Control", "private, max-age=3600");
            res.send(screenshot.data);
        } catch (error: any) {
            res.status(500).json({ message: "Could not fetch the screenshot", error: error.message });
        }
    };

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