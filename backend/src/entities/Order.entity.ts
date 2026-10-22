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

    // Relationship to User
    @ManyToOne(() => User, { onDelete: "CASCADE" })
    user!: User;

    // Inverse Relationship to OrderItems
    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
    orderItems!: OrderItem[];

    @CreateDateColumn()
    createdAt!: Date;
}