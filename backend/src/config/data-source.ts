import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
//
import { User } from "../entities/User.entity";
import { Product } from "../entities/Product.entity";
import { CartItem } from "../entities/CartItem.entity";
import { Order } from "../entities/Order.entity";
import { OrderItem } from "../entities/OrderItem.entity";
// Load environment variables from the .env file
dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
     url: process.env.DATABASE_URL || `postgres://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASS || 'postgres'}@${process.env.DB_HOST || 'localhost'}:${Number(process.env.DB_PORT) || 5432}/${process.env.DB_NAME || 'NardiShop'}`,
    
    // Auto-matches database tables to entities. later turn off this one 
    synchronize: true, 
    logging: false,
    
    // Required configuration for Neon cloud databases
    ssl: {
        rejectUnauthorized: false // Permits SSL connections without self-signed cert validation issues
    },
  entities: [User, Product, CartItem, Order, OrderItem],  // definition of the entities 
    migrations: [],
    subscribers: [],
});