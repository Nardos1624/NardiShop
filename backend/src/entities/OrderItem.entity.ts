import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Order } from "./Order.entity.js";
import { Product } from "./Product.entity.js";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // Updated to UUID string

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price!: number; // Price locked in at the exact moment of checkout

    @Column({ type: "int" })
    quantity!: number;

    // Relationship to the Parent Order
    @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: "CASCADE" })
    order!: Order;

    // Relationship to the Product (SET NULL prevents historic sales data from disappearing)
    @ManyToOne(() => Product, { onDelete: "SET NULL", nullable: true })
    product!: Product | null;
}