import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm";
import { User } from "./User.entity.js";
import { OrderItem } from "./OrderItem.entity.js";

@Entity()
export class Order {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // Updated to UUID string
    
    @Column({ type: "varchar", unique: true })
    invoiceNumber!: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    total!: number;

    // Half of the total, paid up front (the rest is paid on delivery)
    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
    amountPaid!: number | null;

    // "pending" until the shop confirms the payment screenshot
    @Column({ type: "varchar", default: "pending" })
    status!: string;

    // Relationship to User (empty for guest orders)
    @ManyToOne(() => User, { onDelete: "CASCADE", nullable: true })
    user!: User | null;

    // Shipping details from the checkout form (nullable so older orders stay valid)
    @Column({ type: "varchar", nullable: true })
    firstName!: string | null;

    @Column({ type: "varchar", nullable: true })
    lastName!: string | null;

    @Column({ type: "varchar", nullable: true })
    telegramUsername!: string | null;

    @Column({ type: "varchar", nullable: true })
    phone!: string | null;

    @Column({ type: "varchar", nullable: true })
    secondPhone!: string | null;

    @Column({ type: "varchar", nullable: true })
    city!: string | null;

    @Column({ type: "varchar", nullable: true })
    address!: string | null;

    // The payment screenshot itself, stored in the database so it survives server restarts.
    // Not selected by default so order lists stay small.
    @Column({ type: "bytea", nullable: true, select: false })
    paymentScreenshot!: Buffer | null;

    @Column({ type: "varchar", nullable: true })
    paymentScreenshotType!: string | null;

    // Whether the order reached the shop's Telegram chat
    @Column({ type: "boolean", default: false })
    telegramSent!: boolean;

    // Inverse Relationship to OrderItems
    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    orderItems!: OrderItem[];

    @CreateDateColumn()
    createdAt!: Date;
}