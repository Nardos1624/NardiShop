import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source.js";
import { Product } from "../entities/Product.entity.js"; // Ensure matching your exact file name extension format

export class ProductController {
    private productRepository = AppDataSource.getRepository(Product);

    // 1. Create a new product with an image (Admin Only)
    createProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { name, description, category, price, stock } = req.body;

            if (typeof category !== "string" || !category.trim()) {
                res.status(400).json({ message: "Product category is required." });
                return;
            }

            // Check if file was successfully handled by Multer middleware
            if (!req.file) {
                res.status(400).json({ message: "Product image file is required." });
                return;
            }

            // Generate a local server URL reference path for the file
            const imageUrl = `/uploads/${req.file.filename}`;

            const product = this.productRepository.create({
                name,
                description,
                category: category.trim(),
                price: parseFloat(price),
                stock: parseInt(stock),
                imageUrl // Save image location path string to the database record
            });

            await this.productRepository.save(product);

            res.status(201).json({
                message: "Product created successfully!",
                product
            });
        } catch (error: any) {
            res.status(500).json({ message: "Failed to create product", error: error.message });
        }
    };

    // 2. Fetch all products from the catalog (Public)
    getAllProducts = async (req: Request, res: Response): Promise<void> => {
        try {
            const products = await this.productRepository.find({
                order: { createdAt: "DESC" } // Sorts items cleanly showing newest arrivals first
            });
            res.status(200).json(products);
        } catch (error: any) {
            res.status(500).json({ message: "Failed to fetch products catalog", error: error.message });
        }
    };

   // 3. Fetch details for a single product by its unique UUID string
    getProductById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params; 

            // FIX: Use 'as string' to satisfy TypeORM's strict type requirement
            const product = await this.productRepository.findOneBy({ id: id as string });
            if (!product) {
                res.status(404).json({ message: "Product not found" });
                return;
            }

            res.status(200).json(product);
        } catch (error: any) {
            res.status(500).json({ message: "Failed to fetch product details", error: error.message });
        }
    };

    // 4. Remove a product from the database (Admin Only)
    deleteProduct = async (req: Request, res: Response): Promise<void> => {
        try {
            const { id } = req.params;

            // FIX: Use 'as string' to satisfy TypeORM's strict type requirement
            const product = await this.productRepository.findOneBy({ id: id as string });
            if (!product) {
                res.status(404).json({ message: "Product not found. Cannot delete." });
                return;
            }

            // Delete the item from the catalog
            await this.productRepository.remove(product);
            
            res.status(200).json({ message: `Product '${product.name}' deleted successfully.` });
        } catch (error: any) {
            res.status(500).json({ message: "Failed to delete product", error: error.message });
        }
    };
}