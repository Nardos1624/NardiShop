import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/data-source.js";

// Import API Routers
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import orderRoutes from "./routes/order.route.js";
import paymentRoutes from "./routes/payment.route.js";
import imageRoutes from "./routes/image.route.js";
import { uploadDirectory } from "./middleware/upload.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(express.json()); // Parses incoming requests with JSON payloads

app.use("/uploads", express.static(uploadDirectory));

// Health Check Route ( For testing server availability)
app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is running smoothly" });
});

// Mount API Route Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/images", imageRoutes);

// Initialize TypeORM Data Source Connection and Start Server
AppDataSource.initialize()
    .then(() => {
        console.log("✅Database connected successfully!");
        
        app.listen(PORT, () => {
            console.log(`📡 Server is actively listening on: http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("❌ Database connection failed causes are :", error);
        process.exit(1); // Exit process with failure code
    });