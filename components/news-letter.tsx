"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { CheckCircle2, X, Loader2 } from "lucide-react"; 

function NewsLetter() {
  const pinkColor = "rgb(255, 182, 193)";
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // The browser automatically checks email format because of type="email" and required
    setIsPending(true);

    // Simulate a network delay (1 second) to make it feel real
    setTimeout(() => {
      setIsPending(false);
      setIsSubscribed(true);
      // Clear the input field
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <section className="w-full py-12 bg-[#212121] border-t border-zinc-800 relative">
      
      {/* SUCCESS POPUP MODAL */}
      {isSubscribed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="relative bg-[#2a2a2a] border border-zinc-800 p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <button 
              onClick={() => setIsSubscribed(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex justify-center mb-4">
              <CheckCircle2 size={60} style={{ color: pinkColor }} className="animate-bounce" />
            </div>
            
            <h2 className="text-2xl font-bold mb-2 text-white"> 
              <span style={{ color: "rgb(255,182,193)" }}>You’re officially subscribed!
                </span></h2>
            <p className="text-zinc-400 mb-6">
          🎉 Welcome to the NardiShop newsletter—get ready for exclusive updates and special offers.
            </p>
            
            <Button 
              onClick={() => setIsSubscribed(false)}
              className="w-full h-11 font-bold !cursor-pointer"
              style={{ backgroundColor: pinkColor, color: "#212121" }}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              <span className="inline-block" style={{ color: pinkColor }}>
                Subscribe to Our Newsletter
              </span>
            </h2>
            <p className="mx-auto max-w-[600px] text-[#E0E0E0] opacity-80">
              Stay updated with our latest products and exclusive offers
            </p>
          </div>

          <div className="w-full max-w-sm space-y-2">
            <form onSubmit={handleSubscribe} className="flex space-x-2">
              <input
                className="flex h-11 w-full rounded-md bg-zinc-900 px-3 py-2 text-sm text-white transition-all outline-none border-2 invalid:border-red-500/50"
                style={{ borderColor: pinkColor }}
                placeholder="Enter your email"
                type="email"
                required
                onFocus={(e) => {
                  e.target.style.boxShadow = `0 0 10px rgba(255, 182, 193, 0.3)`;
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "none";
                }}
              />
              <Button 
                type="submit"
                disabled={isPending}
                className="h-11 px-6 transition-transform active:scale-95 !cursor-pointer disabled:opacity-50"
                style={{ 
                  backgroundColor: pinkColor, 
                  color: "#212121", 
                  fontWeight: "bold" 
                }}
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsLetter;