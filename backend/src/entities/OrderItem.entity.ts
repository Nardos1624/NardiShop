import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order.entity.js";
import { Product } from "./Product.entity.js";
import { StoredImage } from "./StoredImage.entity.js";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // Updated to UUID string

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price!: number; // Price locked in at the exact moment of checkout

    @Column({ type: "int" })
    quantity!: number;

    // Product name locked in at checkout, so it stays readable if the product is deleted
    @Column({ type: "varchar", nullable: true })
    productName!: string | null;

    // The size the customer chose, if the product has sizes
    @Column({ type: "varchar", nullable: true })
    size!: string | null;

    // The product photo at checkout. Images are never deleted with their product,
    // so the order keeps its photo even if the product is removed later.
    @ManyToOne(() => StoredImage, { nullable: true, onDelete: "SET NULL" })
    productImage!: StoredImage | null;

    // Relationship to the Parent Order
    @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: "CASCADE" })
    order!: Order;

    // Relationship to the Product (SET NULL prevents historic sales data from disappearing)
    @ManyToOne(() => Product, { onDelete: "SET NULL", nullable: true })
    product!: Product | null;
}