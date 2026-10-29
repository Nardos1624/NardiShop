import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

// An image saved in the database (product photos, order copies). Identical images are
// stored once: they share the same hash, so every product and order points to one copy.
@Entity()
export class StoredImage {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    // SHA-256 of the compressed image, used to find an existing copy
    @Column({ type: "varchar", unique: true })
    hash!: string;

    @Column({ type: "varchar" })
    mimeType!: string;

    // Size in bytes of the compressed image
    @Column({ type: "int" })
    size!: number;

    // Not selected by default so lists of images stay small
    @Column({ type: "bytea", select: false })
    data!: Buffer;

    @CreateDateColumn()
    createdAt!: Date;
}
