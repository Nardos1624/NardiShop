import "reflect-metadata";
import { AppDataSource } from "../config/data-source.js";
import { User } from "../entities/User.entity.js"; // Ensure this matches your exact User entity file name
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

async function seedAdmin() {
    try {
        // 1. Initialize the TypeORM database connection
        console.log("🌱 Connecting to database for admin seeding...");
        await AppDataSource.initialize();

        const userRepository = AppDataSource.getRepository(User);

        // 2. Define secure credentials for your administrator account
        const adminEmail = "admin@nardishop.com";
        const adminPassword = "Admin123"; 

        // 3. Prevent duplicate seed entries
        const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

        if (existingAdmin) {
            console.log("ℹ️ Administrative account already exists. Skipping seed execution.");
        } else {
            // 4. Hash the password securely using bcrypt
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            // 5. Build and commit the admin entity
            const admin = userRepository.create({
                email: adminEmail,
                password: hashedPassword,
                role: "admin" // Hardcoded role clearance
            });

            await userRepository.save(admin);
            console.log(`\n=================================================`);
            console.log(`✅ MASTER ADMINISTRATOR ACCOUNT SEEDED SUCCESSFULLY!`);
            console.log(`📧 Email: ${adminEmail}`);
            console.log(`🔑 Password: ${adminPassword}`);
            console.log(`=================================================\n`);
        }

    } catch (error) {
        console.error("❌ Critical error encountered during database seeding:", error);
    } finally {
        // 6. Always destroy the active process connection cleanly
        await AppDataSource.destroy();
        process.exit(0);
    }
}

seedAdmin();