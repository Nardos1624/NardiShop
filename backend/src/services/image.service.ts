import crypto from "crypto";
import sharp from "sharp";
import { AppDataSource } from "../config/data-source.js";
import { StoredImage } from "../entities/StoredImage.entity.js";

export interface ImageData {
    data: Buffer;
    mimeType: string;
}

// How large each kind of image may be. Phone screenshots are tall, so they keep more height
// to stay readable; product photos are shown at most ~600px wide on the site.
export const IMAGE_LIMITS = {
    product: { width: 1200, height: 1200, quality: 80 },
    screenshot: { width: 1080, height: 2400, quality: 85 },
} as const;

export class InvalidImageError extends Error {
    constructor() {
        super("The image could not be read. Please upload a .jpg, .png or .webp image.");
        this.name = "InvalidImageError";
    }
}

// Resize an uploaded image to fit the limits and re-save it as a compressed JPEG
export const compressImage = async (input: Buffer, limits: (typeof IMAGE_LIMITS)[keyof typeof IMAGE_LIMITS]): Promise<ImageData> => {
    try {
        const data = await sharp(input)
            .rotate() // Respect the phone's orientation before EXIF data is dropped
            .resize({ width: limits.width, height: limits.height, fit: "inside", withoutEnlargement: true })
            .flatten({ background: "#ffffff" }) // JPEG has no transparency
            .jpeg({ quality: limits.quality, mozjpeg: true })
            .toBuffer();
        return { data, mimeType: "image/jpeg" };
    } catch {
        throw new InvalidImageError();
    }
};

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Product image URLs look like "/api/images/<id>"; returns the id, or null for other URLs
export const imageIdFromUrl = (url: string | null): string | null => {
    const id = url?.match(/^\/api\/images\/([^/]+)$/)?.[1];
    return id && UUID_PATTERN.test(id) ? id : null;
};

export const isImageId = (id: string): boolean => UUID_PATTERN.test(id);

export class ImageService {
    private repository = AppDataSource.getRepository(StoredImage);

    // Compress and save a product photo, reusing the existing copy if the same image was saved before
    async saveProductImage(input: Buffer): Promise<StoredImage> {
        const { data, mimeType } = await compressImage(input, IMAGE_LIMITS.product);
        const hash = crypto.createHash("sha256").update(data).digest("hex");

        const existing = await this.repository.findOneBy({ hash });
        if (existing) return existing;

        try {
            return await this.repository.save(this.repository.create({ hash, mimeType, size: data.length, data }));
        } catch (error) {
            // Another request saved the same image at the same moment
            const saved = await this.repository.findOneBy({ hash });
            if (saved) return saved;
            throw error;
        }
    }

    async getImage(id: string): Promise<ImageData | null> {
        if (!isImageId(id)) return null;

        const image = await this.repository
            .createQueryBuilder("image")
            .addSelect("image.data")
            .where("image.id = :id", { id })
            .getOne();

        return image ? { data: image.data, mimeType: image.mimeType } : null;
    }
}
