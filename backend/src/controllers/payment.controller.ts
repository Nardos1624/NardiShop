import { Request, Response } from "express";
import { TelegramNotConfiguredError, TelegramService } from "../services/telegram.service.js";

const field = (value: unknown, maxLength: number): string =>
    typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export class PaymentController {
    private telegramService = new TelegramService();

    // Forward a customer's payment screenshot and details to the shop's Telegram chat (Public)
    sendScreenshot = async (req: Request, res: Response): Promise<void> => {
        try {
            const name = field(req.body.name, 100);
            const phone = field(req.body.phone, 30);
            const amount = field(req.body.amount, 30);
            const note = field(req.body.note, 500);

            if (!name || !phone) {
                res.status(400).json({ message: "Your name and phone number are required." });
                return;
            }

            if (!req.file) {
                res.status(400).json({ message: "Please attach the screenshot of your payment." });
                return;
            }

            const sentAt = new Date().toLocaleString("en-US", {
                timeZone: "Africa/Addis_Ababa",
                dateStyle: "medium",
                timeStyle: "short",
            });

            const caption = [
                "💳 New payment screenshot — NardiShop",
                "",
                `👤 Name: ${name}`,
                `📞 Phone: ${phone}`,
                amount ? `💰 Amount paid: ${amount} ETB` : null,
                note ? `📝 Note: ${note}` : null,
                `🕒 Sent: ${sentAt}`,
            ]
                .filter((line) => line !== null)
                .join("\n");

            await this.telegramService.sendPhoto(req.file.buffer, req.file.originalname, req.file.mimetype, caption);

            res.status(201).json({ message: "Your payment screenshot was sent successfully." });
        } catch (error: any) {
            console.error("Failed to send payment screenshot:", error);

            if (error instanceof TelegramNotConfiguredError) {
                res.status(503).json({ message: "Screenshot uploads are not available right now. Please contact us by phone or Telegram." });
                return;
            }

            res.status(502).json({ message: "We couldn't send your screenshot. Please try again or contact us by phone." });
        }
    };
}
