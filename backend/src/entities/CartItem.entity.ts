import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity.js";
import { Product } from "./Product.entity.js";

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn("uuid")
    id!: string; // Updated to UUID string

    @Column({ type: "int" })
    quantity!: number;

    // Relationship to User
    @ManyToOne(() => User, (user) => user.id, { onDelete: "CASCADE" })
    user!: User;

    // Relationship to Product
    @ManyToOne(() => Product, (product) => product.id, { onDelete: "CASCADE" })
    product!: Product;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}