"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Eye, EyeOff, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const pinkColor = "rgb(255, 182, 193)";
  const [showPassword, setShowPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const inputStyles = "bg-zinc-900 border-zinc-700 text-white transition-all outline-none focus:border-[rgb(255,182,193)] focus:ring-1 focus:ring-[rgb(255,182,193)]/30";
  const passwordInputStyles = `${inputStyles} pr-10`; 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPopup(true);
    setTimeout(() => {
        setShowPopup(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#212121] text-[#E0E0E0] flex items-center justify-center p-6 relative">
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-[#2a2a2a] p-8 rounded-3xl border border-zinc-800 shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300">
            <CheckCircle2 size={60} style={{ color: pinkColor }} className="mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold">Account <span style={{ color: pinkColor }}>Created!</span></h2>
            <p className="text-zinc-400 mt-2 text-center">Your NardiShop journey starts now.</p>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-[#2a2a2a] p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        
        <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-zinc-900">
                <UserPlus style={{ color: pinkColor }} size={32} />
            </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create <span style={{ color: pinkColor }}>Account</span></h1>
          <p className="text-zinc-400">Join us for a faster checkout experience</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">First Name</label>
              <Input placeholder="NardiShop" className={inputStyles} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Last Name</label>
              <Input placeholder="NardiShop" className={inputStyles} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <Input type="email" placeholder="nardishop@gmail.com" className={inputStyles} required />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="Create a password" 
                className={passwordInputStyles} 
                required 
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <Button type="submit" className="w-full h-12 font-bold mt-2 cursor-pointer transition-transform active:scale-95" style={{ backgroundColor: pinkColor, color: "#212121" }}>
            Register Now
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-bold hover:underline" style={{ color: pinkColor }}>
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}