import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { fileURLToPath } from "node:url";
//
import { User } from "../entities/User.entity";
import { Product } from "../entities/Product.entity";
import { CartItem } from "../entities/CartItem.entity";
import { Order } from "../entities/Order.entity";
import { OrderItem } from "../entities/OrderItem.entity";
// Load environment variables from the .env file
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const databaseUrl = process.env.DATABASE_URL;
const databaseHost = databaseUrl
    ? new URL(databaseUrl).hostname
    : process.env.DB_HOST || "localhost";
const isLocalDatabase = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(databaseHost);

export const AppDataSource = new DataSource({
    type: "postgres",
    url: databaseUrl || `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || 'postgres'}@${databaseHost}:${Number(process.env.DB_PORT) || 5432}/${process.env.DB_NAME || 'NardiShop'}`,
    
    // Auto-matches database tables to entities. later turn off this one 
    synchronize: true, 
    logging: false,
    
    // Required configuration for Neon cloud databases
    ssl: isLocalDatabase ? false : {
        rejectUnauthorized: false // Permits SSL connections without self-signed cert validation issues
    },
  entities: [User, Product, CartItem, Order, OrderItem],  // definition of the entities 
    migrations: [],
    subscribers: [],
});