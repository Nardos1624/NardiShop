import { Request, Response, Router } from "express";
import { ImageService } from "../services/image.service.js";

const router = Router();
const imageService = new ImageService();

// GET /api/images/:id - Serve a stored image, e.g. a product photo (Public)
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const image = await imageService.getImage(String(req.params.id));
        if (!image) {
            res.status(404).json({ message: "Image not found." });
            return;
        }

        // An id always points to the same image, so browsers can cache it for good
        res.setHeader("Content-Type", image.mimeType);
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        res.send(image.data);
    } catch (error: any) {
        res.status(500).json({ message: "Could not load the image", error: error.message });
    }
});

export default router;
