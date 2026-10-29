import path from "path";
import { readFile } from "fs/promises";
import { IsNull, Not } from "typeorm";
import { AppDataSource } from "../config/data-source.js";
import { Product } from "../entities/Product.entity.js";
import { Order } from "../entities/Order.entity.js";
import { OrderItem } from "../entities/OrderItem.entity.js";
import { StoredImage } from "../entities/StoredImage.entity.js";
import { uploadDirectory } from "../middleware/upload.js";
import { compressImage, IMAGE_LIMITS, ImageService, imageIdFromUrl } from "../services/image.service.js";

// One-time move of images into the database (safe to run again):
// 1. product photos still saved as files in uploads/ are compressed and stored in the database
// 2. order lines without a photo are linked to their product's photo
// 3. payment screenshots saved before compression are shrunk
const migrateImages = async () => {
    await AppDataSource.initialize();
    const imageService = new ImageService();

    const products = await AppDataSource.getRepository(Product).find();
    for (const product of products) {
        if (!product.imageUrl?.startsWith("/uploads/")) continue;

        const filePath = path.join(uploadDirectory, path.basename(product.imageUrl));
        try {
            const image = await imageService.saveProductImage(await readFile(filePath));
            product.imageUrl = `/api/images/${image.id}`;
            await AppDataSource.getRepository(Product).save(product);
            console.log(`✅ ${product.name.trim()}: ${image.size} bytes`);
        } catch (error) {
            console.warn(`⚠️ ${product.name.trim()}: could not move ${filePath}`, error);
        }
    }

    const items = await AppDataSource.getRepository(OrderItem).find({
        where: { productImage: IsNull(), product: Not(IsNull()) },
        relations: { product: true },
    });
    for (const item of items) {
        const imageId = imageIdFromUrl(item.product?.imageUrl ?? null);
        if (!imageId) continue;
        item.productImage = { id: imageId } as StoredImage;
        await AppDataSource.getRepository(OrderItem).save(item);
        console.log(`🔗 Order line '${item.productName}' linked to its product photo`);
    }

    const orders = await AppDataSource.getRepository(Order)
        .createQueryBuilder("order")
        .addSelect("order.paymentScreenshot")
        .where("order.paymentScreenshot IS NOT NULL AND order.paymentScreenshotType != :jpeg", { jpeg: "image/jpeg" })
        .getMany();
    for (const order of orders) {
        const before = order.paymentScreenshot?.length ?? 0;
        const { data, mimeType } = await compressImage(order.paymentScreenshot as Buffer, IMAGE_LIMITS.screenshot);
        await AppDataSource.getRepository(Order).update(order.id, { paymentScreenshot: data, paymentScreenshotType: mimeType });
        console.log(`🧾 Screenshot of ${order.invoiceNumber}: ${before} → ${data.length} bytes`);
    }

    await AppDataSource.destroy();
    console.log("Done.");
};

migrateImages().catch((error) => {
    console.error("❌ Image migration failed:", error);
    process.exit(1);
});
