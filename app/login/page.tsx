"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const pinkColor = "rgb(255, 182, 193)";
  const inputStyles = "bg-zinc-900 border-zinc-700 text-white transition-all outline-none focus:border-[rgb(255,182,193)] focus:ring-1 focus:ring-[rgb(255,182,193)]/30";

  return (
    <div className="min-h-screen bg-[#212121] text-[#E0E0E0] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#2a2a2a] p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        
        <Link href="/checkout" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Checkout
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome <span style={{ color: pinkColor }}>Back</span></h1>
          <p className="text-zinc-400">Log in to your account to continue</p>
        </div>

        <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <Input type="email" placeholder="name@example.com" className={inputStyles} required />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <Link href="#" className="text-xs hover:underline" style={{ color: pinkColor }}>Forgot password?</Link>
            </div>
            <Input type="password" placeholder="••••••••" className={inputStyles} required />
          </div>

          <Button className="w-full h-12 font-bold mt-2" style={{ backgroundColor: pinkColor, color: "#212121" }}>
            Sign In
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">
            Do not have an account?{" "}
            <Link href="/signup" className="font-bold hover:underline" style={{ color: pinkColor }}>
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-zinc-600 uppercase tracking-widest">
          <ShieldCheck size={12} /> Secure Authentication
        </div>
      </div>
    </div>
  );
}