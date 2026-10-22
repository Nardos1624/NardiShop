import { AppDataSource } from "../config/data-source.js";
import { CartItem } from "../entities/CartItem.entity.js";
import { Product } from "../entities/Product.entity.js";
import { User } from "../entities/User.entity.js";

export class CartService {
    private cartRepository = AppDataSource.getRepository(CartItem);
    private productRepository = AppDataSource.getRepository(Product);
    private userRepository = AppDataSource.getRepository(User);

    // Add an item to the shopping cart or increment quantity if it exists
    async addToCart(userId: string, productId: string, quantity: number): Promise<CartItem> {
        // 1. Verify product exists and is in stock
        const product = await this.productRepository.findOneBy({ id: productId });
        if (!product) throw new Error("Product not found");
        if (product.stock < quantity) throw new Error("Insufficient stock available");

        // 2. Verify user exists
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new Error("User not found");

        // 3. Check if product is already in the user's cart
        let cartItem = await this.cartRepository.findOne({
            where: { 
                user: { id: userId }, 
                product: { id: productId } 
            }
        });

        if (cartItem) {
            // Check overall stock capacity before updating quantity
            if (product.stock < cartItem.quantity + quantity) {
                throw new Error("Cannot add more of this item; stock limit reached");
            }
            cartItem.quantity += quantity;
        } else {
            // Create a brand new item entry
            cartItem = this.cartRepository.create({
                user,
                product,
                quantity
            });
        }

        return await this.cartRepository.save(cartItem);
    }

    // Get all cart items for a specific user
    async getCart(userId: string): Promise<CartItem[]> {
        return await this.cartRepository.find({
            where: { user: { id: userId } },
            relations: {
                product: true
            } // Brings back product details (name, price, imageUrl) automatically
        });
    }

    // Remove an entire line item from the cart
    async removeFromCart(userId: string, cartItemId: string): Promise<void> {
        const cartItem = await this.cartRepository.findOne({
            where: { 
                id: cartItemId, 
                user: { id: userId } 
            }
        });
        
        if (!cartItem) throw new Error("Cart item not found");
        await this.cartRepository.remove(cartItem);
    }
}