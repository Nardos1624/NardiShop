import { AppDataSource } from "../config/data-source";
import { Order } from "../entities/Order.entity";
import { OrderItem } from "../entities/OrderItem.entity";
import { CartItem } from "../entities/CartItem.entity";
import { Product } from "../entities/Product.entity";
import { User } from "../entities/User.entity";
import crypto from "crypto";

export class OrderService {
    // Process the checkout system and return a localized structured invoice receipt payload
    async checkout(userId: string): Promise<any> {
        // We use a query runner transaction to guarantee data integrity.
        // If anything fails during checkout (like a stock shortage), the database rolls back completely.
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. Fetch user's active cart items along with product specifications
            const cartItems = await queryRunner.manager.find(CartItem, {
                where: { user: { id: userId } },
                relations: { product: true }
            });

            if (cartItems.length === 0) {
                throw new Error("Cannot checkout an empty shopping cart");
            }

            // 2. Fetch the user entity
            const user = await queryRunner.manager.findOneBy(User, { id: userId });
            if (!user) throw new Error("User profile not found");

            let totalAmount = 0;
            const orderItems: OrderItem[] = [];

            // 3. Loop through cart items to validate stock levels and calculate costs
            for (const item of cartItems) {
                const product = item.product;

                if (product.stock < item.quantity) {
                    throw new Error(`Product '${product.name}' run out of stock. Available: ${product.stock}`);
                }

                // Deduct stock levels directly
                product.stock -= item.quantity;
                await queryRunner.manager.save(product);

                // Compute financial details
                const itemTotal = Number(product.price) * item.quantity;
                totalAmount += itemTotal;

                // Create individual order line items with snapshot pricing
                const orderItem = queryRunner.manager.create(OrderItem, {
                    quantity: item.quantity,
                    price: product.price, // Lock in the snapshot price
                    product: product
                });
                
                orderItems.push(orderItem);
            }

            // Generate unique human-readable business invoice identifier for Addis Ababa operations
            const shortRandomId = crypto.randomBytes(3).toString("hex").toUpperCase();
            const yearStamp = new Date().getFullYear(); 
            const customInvoiceReference = `INV-${yearStamp}-${shortRandomId}`;

            // 4. Create and save the parent Order record matching your exact database names
            const order = queryRunner.manager.create(Order, {
                user,
                total: totalAmount,
                invoiceNumber: customInvoiceReference,
                orderItems: orderItems
            });

            const savedOrder = await queryRunner.manager.save(order);

            // 5. Connect the order line items explicitly to the saved order container
            for (const orderItem of orderItems) {
                orderItem.order = savedOrder;
                await queryRunner.manager.save(orderItem);
            }

            // 6. Checkout succeeded! Clear out the user's shopping cart entries cleanly
            await queryRunner.manager.remove(cartItems);

            // Commit all operations to Neon cloud database
            await queryRunner.commitTransaction();

            // 7. Return the finalized structural layout receipt footprint optimized for Addis Ababa
            return {
                meta: {
                    storeName: "Nardishop E-Commerce",
                    location: "Addis Ababa, Ethiopia",
                    supportEmail: "support@nardishop.com",
                    invoiceNumber: savedOrder.invoiceNumber,
                    transactionDate: savedOrder.createdAt.toLocaleDateString("en-US", {
                        timeZone: "Africa/Addis_Ababa", 
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                    })
                },
                customer: {
                    userId: user.id,
                    email: user.email
                },
                receiptItems: orderItems.map((item) => ({
                    productName: item.product?.name || "Product Item",
                    quantity: item.quantity,
                    unitPrice: `${parseFloat(item.price.toString()).toFixed(2)} ETB`,
                    totalLinePrice: `${(parseFloat(item.price.toString()) * item.quantity).toFixed(2)} ETB`
                })),
                summary: {
                    subtotal: `${totalAmount.toFixed(2)} ETB`,
                    taxRate: "0.00%",
                    grandTotal: `${totalAmount.toFixed(2)} ETB`
                }
            };

        } catch (error) {
            // An error occurred, undo every change made inside this block cleanly
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // Explicitly release the database runner connection thread back to the pool
            await queryRunner.release();
        }
    }

    // Retrieve order purchase history for a specific customer (Updated variables)
    async getUserOrders(userId: string): Promise<Order[]> {
        const orderRepository = AppDataSource.getRepository(Order);
        return await orderRepository.find({
            where: { user: { id: userId } },
            relations: {
                orderItems: {
                    product: true
                }
            },
            order: { createdAt: "DESC" } // Show newest orders first
        });
    }
}