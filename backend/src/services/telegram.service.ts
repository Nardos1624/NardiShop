// Telegram captions on photos are limited to 1024 characters
const MAX_CAPTION_LENGTH = 1024;

export class TelegramNotConfiguredError extends Error {
    constructor() {
        super("Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in backend/.env.");
        this.name = "TelegramNotConfiguredError";
    }
}

export class TelegramService {
    // Send a photo with a plain-text caption to the shop owner's Telegram chat
    async sendPhoto(photo: Buffer, fileName: string, mimeType: string, caption: string): Promise<void> {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            throw new TelegramNotConfiguredError();
        }

        const form = new FormData();
        form.append("chat_id", chatId);
        form.append("caption", caption.slice(0, MAX_CAPTION_LENGTH));
        form.append("photo", new Blob([new Uint8Array(photo)], { type: mimeType }), fileName);

        const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: "POST",
            body: form,
        });

        if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as { description?: string } | null;
            throw new Error(`Telegram rejected the message: ${payload?.description ?? response.statusText}`);
        }
    }
}
