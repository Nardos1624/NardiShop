"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { apiRequest, ApiAuthResponse, saveAuthSession } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const pinkColor = "#D4AF37";
  const [showPassword, setShowPassword] = useState(false); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputStyles = "bg-zinc-900 border-zinc-700 text-white transition-all outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30 pr-10";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await apiRequest<ApiAuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      saveAuthSession(result);
      router.replace(result.user.role === "admin" ? "/admin" : "/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#281E18] text-[#E0E0E0] flex items-center justify-center p-6 relative">
      <div className="max-w-md w-full bg-[#2a2a2a] p-8 rounded-3xl border border-zinc-800 shadow-2xl">
        
        <Link href="/checkout" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-8 text-sm">
          <ArrowLeft size={16} /> Back to Checkout
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome <span style={{ color: pinkColor }}>Back</span></h1>
          <p className="text-zinc-400">Log in to your account to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Email Address</label>
            <Input type="email" placeholder="nardishop@gmail.com" className={inputStyles} required value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <Link href="/forgotpassword" className="text-xs hover:underline" style={{ color: pinkColor }}>Forgot password?</Link>
            </div>
            
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"}
                placeholder="1234" 
                className={inputStyles} 
                required 
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full h-12 font-bold mt-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-60" style={{ backgroundColor: pinkColor, color: "#212121" }}>
            {isSubmitting ? "Signing In..." : "Sign In"}
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