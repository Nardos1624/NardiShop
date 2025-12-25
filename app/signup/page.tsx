"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

export default function SignupPage() {
  const pinkColor = "rgb(255, 182, 193)";
  const inputStyles = "bg-zinc-900 border-zinc-700 text-white transition-all outline-none focus:border-[rgb(255,182,193)] focus:ring-1 focus:ring-[rgb(255,182,193)]/30";

  return (
    <div className="min-h-screen bg-[#212121] text-[#E0E0E0] flex items-center justify-center p-6">
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

        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">First Name</label>
              <Input placeholder="Jane" className={inputStyles} required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Last Name</label>
              <Input placeholder="Doe" className={inputStyles} required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <Input type="email" placeholder="jane@example.com" className={inputStyles} required />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <Input type="password" placeholder="Create a password" className={inputStyles} required />
          </div>

          <p className="text-[11px] text-zinc-500 leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <Button className="w-full h-12 font-bold mt-2" style={{ backgroundColor: pinkColor, color: "#212121" }}>
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