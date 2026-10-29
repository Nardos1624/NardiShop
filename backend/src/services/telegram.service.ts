// Telegram captions on photos are limited to 1024 characters, messages to 4096
export const MAX_CAPTION_LENGTH = 1024;
const MAX_MESSAGE_LENGTH = 4096;
const MAX_ALBUM_SIZE = 10;

export interface TelegramPhoto {
    data: Buffer;
    mimeType: string;
    fileName: string;
}

export class TelegramNotConfiguredError extends Error {
    constructor() {
        super("Telegram is not configured. Set TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in backend/.env.");
        this.name = "TelegramNotConfiguredError";
    }
}

export class TelegramService {
    // Send a photo with a plain-text caption to the shop owner's Telegram chat
    async sendPhoto(photo: Buffer, fileName: string, mimeType: string, caption: string): Promise<void> {
        const form = new FormData();
        form.append("caption", caption.slice(0, MAX_CAPTION_LENGTH));
        form.append("photo", new Blob([new Uint8Array(photo)], { type: mimeType }), fileName);

        await this.call("sendPhoto", form);
    }

    // Send up to 10 photos as one album; the caption is shown under the first photo
    async sendPhotoAlbum(photos: TelegramPhoto[], caption: string): Promise<void> {
        const album = photos.slice(0, MAX_ALBUM_SIZE);
        if (album.length === 1) {
            const [photo] = album as [TelegramPhoto];
            await this.sendPhoto(photo.data, photo.fileName, photo.mimeType, caption);
            return;
        }

        const form = new FormData();
        form.append("media", JSON.stringify(album.map((_, index) => ({
            type: "photo",
            media: `attach://photo${index}`,
            ...(index === 0 ? { caption: caption.slice(0, MAX_CAPTION_LENGTH) } : {}),
        }))));
        album.forEach((photo, index) => {
            form.append(`photo${index}`, new Blob([new Uint8Array(photo.data)], { type: photo.mimeType }), photo.fileName);
        });

        await this.call("sendMediaGroup", form);
    }

    // Send a plain-text message to the shop owner's Telegram chat
    async sendMessage(text: string): Promise<void> {
        const form = new FormData();
        form.append("text", text.slice(0, MAX_MESSAGE_LENGTH));

        await this.call("sendMessage", form);
    }

    private async call(method: string, form: FormData): Promise<void> {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        if (!token || !chatId) {
            throw new TelegramNotConfiguredError();
        }

        form.append("chat_id", chatId);

        const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
            method: "POST",
            body: form,
        });

        if (!response.ok) {
            const payload = (await response.json().catch(() => null)) as { description?: string } | null;
            throw new Error(`Telegram rejected the message: ${payload?.description ?? response.statusText}`);
        }
    }
}
