import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", unique: true })
    email!: string;

    @Column({ type: "varchar" })
    password!: string;

    // Ensure this column is explicitly added!
    @Column({ type: "varchar", default: "customer" })
    role!: "customer" | "admin"; 

    // Adding these now ensures your upcoming password reset flows work flawlessly too
    @Column({ type: "varchar", nullable: true })
    resetPasswordToken!: string | null;

    @Column({ type: "timestamp", nullable: true })
    resetPasswordExpires!: Date | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}