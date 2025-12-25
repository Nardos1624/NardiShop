"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Truck, ShoppingBag, ShieldCheck, CheckCircle2, User, X } from "lucide-react"; 
import { useCart } from "@/hooks/use-cart";
import Image from "next/image";
import Link from "next/link";

export default function CheckoutPage() {
  const pinkColor = "rgb(255, 182, 193)";
  const { items, clearCart } = useCart();
  const [isOrdered, setIsOrdered] = useState(false);
  
  // NEW: State to show the selection modal before finalizing
  const [showAuthModal, setShowAuthModal] = useState(false);

  const inputStyles = "bg-zinc-900 border-zinc-700 text-white transition-all outline-none focus:border-[rgb(255,182,193)] focus:ring-1 focus:ring-[rgb(255,182,193)]/30";

  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const shipping = items.length > 0 ? 10.00 : 0;
  const total = subtotal + shipping;

  // This runs when the button is clicked
  const handleCheckoutClick = (e: React.FormEvent) => {
    e.preventDefault();
    // Instead of ordering immediately, we show the login/signup option
    setShowAuthModal(true);
  };

  // This runs when they finally click "Complete as Guest" inside the modal
  const finalizeOrder = () => {
    setIsOrdered(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isOrdered) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#212121] text-[#E0E0E0] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#2a2a2a] p-10 rounded-3xl border border-zinc-800 text-center shadow-2xl">
            <div className="flex justify-center mb-6">
              <CheckCircle2 size={80} style={{ color: pinkColor }} className="animate-bounce" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              <span style={{ color: "rgb(255,182,193)" }}>Order Successful!</span></h1>
            <p className="text-zinc-400 mb-8">Thank you for your purchase. Your order has been placed successfully.</p>
            <Button asChild className="w-full h-12 font-bold" style={{ backgroundColor: pinkColor, color: "#212121" }}>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      {/* AUTH SELECTION MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#2a2a2a] w-full max-w-lg p-8 rounded-3xl border border-zinc-800 shadow-2xl relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-8">
              <div className="inline-flex p-4 rounded-full bg-zinc-900 mb-4">
                <User size={32} style={{ color: pinkColor }} />
              </div>
              <h2 className="text-2xl font-bold">Wait! Save your info?</h2>
              <p className="text-zinc-400 text-sm mt-2">Log in or Sign up to track your order and get rewards.</p>
            </div>

            <div className="space-y-3">
              <Button asChild className="w-full h-12 font-bold" style={{ backgroundColor: pinkColor, color: "#212121" }}>
                <Link href="/login">Log In to Account</Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 border-zinc-700 hover:bg-zinc-800 font-bold text-white">
                <Link href="/signup">Create New Account</Link>
              </Button>
              
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#2a2a2a] px-2 text-zinc-500">Or</span></div>
              </div>

              <Button 
                onClick={finalizeOrder}
                variant="ghost" 
                className="w-full h-12 text-zinc-400 hover:text-white underline decoration-zinc-700"
              >
                No thanks, checkout as guest
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#212121] text-[#E0E0E0] py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold mb-10">
            Finalize <span style={{ color: pinkColor }}>Checkout</span>
          </h1>

          <form onSubmit={handleCheckoutClick} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <section className="bg-[#2a2a2a] p-6 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-3 mb-6">
                  <Truck style={{ color: pinkColor }} />
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input placeholder="First Name" className={inputStyles} required />
                  <Input placeholder="Last Name" className={inputStyles} required />
                  <Input placeholder="Email Address" type="email" className={`md:col-span-2 ${inputStyles}`} required />
                  <Input placeholder="Address" className={`md:col-span-2 ${inputStyles}`} required />
                  <Input placeholder="City" className={inputStyles} required />
                  <Input placeholder="Postal Code" className={inputStyles} required />
                </div>
              </section>

              <section className="bg-[#2a2a2a] p-6 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard style={{ color: pinkColor }} />
                  <h2 className="text-xl font-semibold">Payment Method</h2>
                </div>
                <div className="space-y-4">
                  <Input placeholder="Card Number" className={inputStyles} required minLength={16} maxLength={16} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" className={inputStyles} required maxLength={5} />
                    <Input placeholder="CVC" className={inputStyles} required maxLength={3} />
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="bg-[#2a2a2a] p-8 rounded-2xl border border-zinc-800 sticky top-24">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag size={20} /> <span style={{ color: "rgb(255,182,193)" }}>Order Summary ({items.length})</span>
                </h2>

                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center border-b border-zinc-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded overflow-hidden border border-zinc-700">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <p className="font-medium text-sm">{item.name}</p>
                      </div>
                      <p className="font-bold text-sm">${item.price}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 text-zinc-400">
                  <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Shipping</span><span>${shipping.toFixed(2)}</span></div>
                  <div className="flex justify-between text-xl font-bold mt-4 pt-4 border-t border-zinc-700 text-[#E0E0E0]">
                    <span>Total</span><span style={{ color: pinkColor }}>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={items.length === 0}
                  className="w-full h-14 text-lg font-bold transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: items.length > 0 ? pinkColor : "#555", color: "#212121" }}
                >
                  Place Order Now
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500 uppercase tracking-widest">
                  <ShieldCheck size={14} /> Secure Transaction
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}