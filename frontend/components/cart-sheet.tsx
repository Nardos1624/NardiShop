import { ShoppingBag, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Link from "next/link";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { cartLineKey, groupCartItems, useCart } from "@/hooks/use-cart";
import ProductImage from "./product-image";
import QuantitySelector from "./quantity-selector";

export default function CartSheet() {
  const { items, setQuantity, clearCart } = useCart();

  const totalItems = items.length;
  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const lines = groupCartItems(items);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
          className="relative border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 hover:text-zinc-950"
        >
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-[#D4AF37] px-1 text-xs font-bold leading-none text-[#281E18] shadow-sm">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            <span style={{ color: "#D4AF37" }}>Shopping Cart ({totalItems})</span></SheetTitle>
        </SheetHeader>

        {totalItems === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-medium">
                <span style={{ color: "#D4AF37" }}>Your cart is empty</span></h3>
              <p className="text-sm text-muted-foreground mt-1">
                Add some products to your cart to see them here.
              </p>
            </div>
            <Button asChild>
              <Link href="./products">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="h-[65vh]">
              <div className="space-y-4 px-8">
                {lines.map(({ product: item, quantity }) => (
                  <div key={cartLineKey(item)} className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-medium">{item.name}</h4>
                      {item.size && <p className="text-xs text-muted-foreground">Size: {item.size}</p>}
                      <p className="text-sm text-muted-foreground">
                        {item.price.toFixed(2)} ETB × {quantity} ={" "}
                        <span className="font-medium text-[#281E18]">{(item.price * quantity).toFixed(2)} ETB</span>
                      </p>
                      <QuantitySelector
                        value={quantity}
                        onChange={(next) => setQuantity(item, next)}
                      />
                    </div>
                    <Button onClick={() => setQuantity(item, 0)} variant="ghost" size="icon">
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Total */}
            <Separator />
            <div className="space-y-4 mt-4 px-8">
              <div className="flex items-center justify-between">
                <span className="font-medium">Subtotal</span>
                <span className="font-medium">{subtotal.toFixed(2)} ETB</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Pay 50% at checkout and the rest on delivery.
              </p>
              <div className="space-y-2">
                <Button asChild className="w-full">
                  <Link href="/checkout">Checkout</Link>
                </Button>
                <Button variant="outline" className="w-full" onClick={() => void clearCart()}>
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
