import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import pg from "pg";
import { fileURLToPath } from "node:url";
import net from "node:net";
//
import { User } from "../entities/User.entity";
import { Product } from "../entities/Product.entity";
import { CartItem } from "../entities/CartItem.entity";
import { Order } from "../entities/Order.entity";
import { OrderItem } from "../entities/OrderItem.entity";
import { StoredImage } from "../entities/StoredImage.entity";
// Node only waits 250ms per database address by default. On slow networks (like a
// phone hotspot) that is too short to reach Neon, so give each address 5 seconds.
net.setDefaultAutoSelectFamilyAttemptTimeout(5000);

// Load environment variables from the .env file
dotenv.config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

// Our "timestamp" columns have no time zone and the database stores them in UTC.
// By default pg reads and writes them in the computer's local time (UTC+3 in Addis Ababa),
// which made order times 3 hours off. Treat them as UTC both ways.
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, (value) => new Date(`${value.replace(" ", "T")}Z`));
pg.defaults.parseInputDatesAsUTC = true;

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
  entities: [User, Product, CartItem, Order, OrderItem, StoredImage],  // definition of the entities 
    migrations: [],
    subscribers: [],
});