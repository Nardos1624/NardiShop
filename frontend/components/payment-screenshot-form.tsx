"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle2, ImageIcon, Loader2, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { apiRequest } from "@/lib/api";

const ALLOWED_SCREENSHOT_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024; // 5MB

const inputStyles =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-[#281E18] placeholder:text-zinc-400 transition-all focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20";

const emptyForm = { name: "", phone: "", amount: "", note: "" };

/**
 * Lets a customer send the screenshot of a payment they made. The backend
 * forwards it, with their details, to the shop's Telegram chat.
 */
export default function PaymentScreenshotForm() {
  const [formData, setFormData] = useState(emptyForm);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Free the preview image when it is replaced or the page closes
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const resetFileInput = () => {
    const input = document.getElementById("payment-proof") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setError(null);

    if (!file) return;

    if (!ALLOWED_SCREENSHOT_TYPES.includes(file.type)) {
      setError("Please upload an image (.jpg, .jpeg, .png or .webp).");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SCREENSHOT_SIZE) {
      setError("The screenshot must be 5MB or smaller.");
      e.target.value = "";
      return;
    }

    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeScreenshot = () => {
    resetFileInput();
    setScreenshot(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!screenshot) {
      setError("Please attach the screenshot of your payment.");
      return;
    }

    const body = new FormData();
    body.append("name", formData.name);
    body.append("phone", formData.phone);
    body.append("amount", formData.amount);
    body.append("note", formData.note);
    body.append("screenshot", screenshot);

    setIsSending(true);
    try {
      await apiRequest("/api/payments/screenshot", { method: "POST", body });
      setIsSent(true);
      setFormData(emptyForm);
      removeScreenshot();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Something went wrong. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-white p-10 text-center ring-1 ring-zinc-200">
        <CheckCircle2 size={64} className="mb-4 text-[#D4AF37]" />
        <h3 className="text-2xl font-bold">Screenshot sent!</h3>
        <p className="mt-2 max-w-md text-[#5C5148]">
          Thank you. Our team has received your payment screenshot and will confirm it shortly.
        </p>
        <Button
          variant="outline"
          onClick={() => setIsSent(false)}
          className="mt-6 rounded-full border-zinc-300 px-6"
        >
          Send another screenshot
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-3xl bg-white p-8 ring-1 ring-zinc-200 md:p-10">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="payment-name" className="mb-2 block text-sm font-medium">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="payment-name"
            type="text"
            required
            className={inputStyles}
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="payment-phone" className="mb-2 block text-sm font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="payment-phone"
            type="tel"
            required
            className={inputStyles}
            placeholder="+251 9..."
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="payment-amount" className="mb-2 block text-sm font-medium">Amount Paid (ETB)</label>
          <input
            id="payment-amount"
            type="number"
            min={0}
            step="0.01"
            className={inputStyles}
            placeholder="e.g. 1150"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="payment-note" className="mb-2 block text-sm font-medium">Note</label>
          <input
            id="payment-note"
            type="text"
            className={inputStyles}
            placeholder="e.g. what you ordered"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          />
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm font-medium">
          Payment Screenshot <span className="text-red-500">*</span>
        </span>
        {screenshot && preview ? (
          <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Payment screenshot preview"
              className="h-20 w-20 rounded-lg border border-zinc-200 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 text-sm font-medium text-green-700">
                <CheckCircle2 size={16} /> Screenshot attached
              </p>
              <p className="truncate text-xs text-zinc-500">{screenshot.name}</p>
            </div>
            <Button type="button" variant="outline" size="sm" onClick={removeScreenshot}>
              Remove
            </Button>
          </div>
        ) : (
          <label
            htmlFor="payment-proof"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 p-8 text-center transition-colors hover:border-[#D4AF37]"
          >
            <ImageIcon className="h-8 w-8 text-zinc-400" />
            <span className="text-sm font-medium">Click to upload your payment screenshot</span>
            <span className="text-xs text-zinc-500">JPG, PNG or WEBP, up to 5MB</span>
          </label>
        )}
        <input
          id="payment-proof"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileChange}
        />
      </div>

      {error && <p role="alert" className="text-sm text-red-500">{error}</p>}

      <Button
        type="submit"
        disabled={isSending || !screenshot}
        className="h-12 w-full cursor-pointer rounded-full bg-[#D4AF37] text-base font-bold text-[#281E18] shadow-[0_10px_30px_rgba(212,175,55,0.35)] hover:bg-amber-300 disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {isSending ? (
          <>
            <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Upload className="mr-1 h-4 w-4" /> Send Screenshot
          </>
        )}
      </Button>
    </form>
  );
}
