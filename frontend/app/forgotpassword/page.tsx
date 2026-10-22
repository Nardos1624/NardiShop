"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ArrowLeft, MailCheck } from "lucide-react";
import { apiRequest } from "@/lib/api";

export default function ForgotPasswordPage() {
  const pinkColor = "#D4AF37";
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputStyles = "bg-zinc-900 border-zinc-700 text-white transition-all outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await apiRequest<{ message: string }>("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setIsSubmitted(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not request password recovery.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#281E18] text-[#E0E0E0] flex items-center justify-center p-6">
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
                <Input type="email" placeholder="nardishop@gmail.com" className={inputStyles} required value={email} onChange={(event) => setEmail(event.target.value)} />
              </div>

              {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

              <Button disabled={isSubmitting} className="w-full h-12 font-bold mt-2 cursor-pointer disabled:opacity-60" style={{ backgroundColor: pinkColor, color: "#212121" }}>
                {isSubmitting ? "Sending..." : "Send Reset Link"}
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
              If that email matches an account, your recovery request has been received.
              Please contact support for reset instructions.
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