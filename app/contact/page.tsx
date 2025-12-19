"use client";

import React, { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Mail, Phone, MapPin, CheckCircle2, X } from "lucide-react"; // Added CheckCircle2 and X
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const pinkColor = "rgb(255, 182, 193)";
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false); // 1. State for popup

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    
    // 2. Trigger the popup
    setSubmitted(true);
    
    // Optional: Reset form data
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <>
      <Navbar />
      
      {/* 3. POPUP OVERLAY */}
      {submitted && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="relative bg-[#2a2a2a] border border-zinc-800 p-10 rounded-3xl max-w-md w-full text-center shadow-2xl scale-in-center transition-all">
            {/* Close Button */}
            <button 
              onClick={() => setSubmitted(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex justify-center mb-6">
              <CheckCircle2 size={70} style={{ color: pinkColor }} className="animate-bounce" />
            </div>
            
            <h2 className="text-3xl font-bold mb-3 text-white">Thank You!</h2>
            <p className="text-zinc-400 mb-8">
               Thanks for contacting <span style={{ color: pinkColor }}>{formData.name || "NardiShop ,"}</span> Your message is safely in our inbox our team will respond shortly
            </p>
            
            <Button 
              onClick={() => setSubmitted(false)}
              className="w-full h-12 text-lg font-bold"
              style={{ backgroundColor: pinkColor, color: "#212121" }}
            >
              Close
            </Button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-[#212121] text-[#E0E0E0] py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="mb-16">
            <h1 className="text-5xl font-bold mb-4">
              Get in <span style={{ color: pinkColor }}>Touch</span>
            </h1>
            <p className="text-zinc-400 max-w-2xl text-lg">
              Have a question about a product or an order? We are here to help. 
              Send us a message and we will get back to you within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <div className="bg-[#212121] p-8 rounded-3xl border border-zinc-800 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[rgb(255,182,193)] transition-all"
                    placeholder="Nardi Shop"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[rgb(255,182,193)] transition-all"
                    placeholder="nardishop@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 focus:outline-none focus:border-[rgb(255,182,193)] transition-all resize-none"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>
                <Button 
                  type="submit"
                  className="w-full h-12 text-lg font-bold transition-transform cursor-pointer"
                  style={{ backgroundColor: pinkColor, color: "#212121" }}
                >
                  Send Message
                </Button>
              </form>
            </div>

            <div className="flex flex-col justify-between py-4">
              <div className="space-y-12">
                <div className="flex items-start gap-6 group">
                  <div className="p-4 rounded-2xl bg-zinc-800 text-[rgb(255,182,193)] group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Email Us</h3>
                    <p className="text-zinc-400">nardishop@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="p-4 rounded-2xl bg-zinc-800 text-[rgb(255,182,193)] group-hover:scale-110 transition-transform">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Call Us</h3>
                    <p className="text-zinc-400">0960246425</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="p-4 rounded-2xl bg-zinc-800 text-[rgb(255,182,193)] group-hover:scale-110 transition-transform">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Visit Us</h3>
                    <p className="text-zinc-400">Addis Ababa</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-zinc-800">
                <p className="text-sm text-zinc-500 uppercase tracking-widest mb-4 font-bold">
                    <span style={{ color: "rgb(255,182,193)" }}>Follow Our Journey</span></p>
                <div className="flex gap-6 text-zinc-400">
                  {["Instagram", "Telegram", "Facebook"].map((social) => (
                    <a key={social} href="#" className="hover:text-[rgb(255,182,193)] transition-colors font-medium">
                      {social}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}