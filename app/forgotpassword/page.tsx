"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const pinkColor = "rgb(255, 182, 193)";
  const [isSubmitted, setIsSubmitted] = useState(false);
  const inputStyles = "bg-zinc-900 border-zinc-700 text-white transition-all outline-none focus:border-[rgb(255,182,193)] focus:ring-1 focus:ring-[rgb(255,182,193)]/30";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#212121] text-[#E0E0E0] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#2a2a2a] p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        
        <Link href="/login" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        {!isSubmitted ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Forgot <span style={{ color: pinkColor }}>Password?</span></h1>
              <p className="text-zinc-400">No worries! Enter your email and we will send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Email Address</label>
                <Input type="email" placeholder="nardishop@gmail.com" className={inputStyles} required />
              </div>

              <Button className="w-full h-12 font-bold mt-2 cursor-pointer" style={{ backgroundColor: pinkColor, color: "#212121" }}>
                Send Reset Link
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-4 animate-in fade-in zoom-in duration-300">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-zinc-900">
                <MailCheck size={40} style={{ color: pinkColor }} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-zinc-400 mb-8">
              We have sent a password reset link to your email address.
            </p>
            <Button asChild variant="outline" className="w-full border-zinc-700 hover:bg-zinc-800 cursor-pointer">
              <Link href="/login">Return to Login</Link>
            </Button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
          <p className="text-zinc-400 text-sm">
            Remember your password?{" "}
            <Link href="/login" className="font-bold hover:underline" style={{ color: pinkColor }}>
              Log in
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-zinc-600 uppercase tracking-widest">
          <ShieldCheck size={12} /> Secure Recovery
        </div>
      </div>
    </div>
  );
}