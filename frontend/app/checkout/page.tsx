"use client";

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import PoweredBy from "@/components/powered-by";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Truck, ShoppingBag, ShieldCheck, CheckCircle2, X, Upload, ImageIcon } from "lucide-react";
import { cartLineKey, groupCartItems, useCart } from "@/hooks/use-cart";
import Link from "next/link";
import QuantitySelector from "@/components/quantity-selector";
import { apiRequest, ApiPlaceOrderResponse, getAuthToken } from "@/lib/api";
import ProductImage from "@/components/product-image";

const ALLOWED_SCREENSHOT_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024; // 5MB

const EMPTY_SHIPPING = {
  firstName: "",
  lastName: "",
  telegramUsername: "",
  phone: "",
  secondPhone: "",
  city: "",
  address: "",
};

export default function CheckoutPage() {
  const pinkColor = "#D4AF37";
  const { items, setQuantity, clearCart } = useCart();
  // Invoice number of the placed order; set once the order succeeds
  const [placedInvoice, setPlacedInvoice] = useState<string | null>(null);
  const [shipping, setShipping] = useState(EMPTY_SHIPPING);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // Screenshot of the half payment; the order can't be placed without it
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);

  const updateShipping = (e: React.ChangeEvent<HTMLInputElement>) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });

  const inputStyles = "bg-white border-zinc-300 text-[#281E18] transition-all outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/30";

  const subtotal = items.reduce((total, item) => total + item.price, 0);
  const total = subtotal;
  // Half of the order must be paid up front; the rest is paid later
  const halfPayment = total / 2;
  const remainingPayment = total - halfPayment;

  // Free the preview image when it is replaced or the page closes
  useEffect(() => {
    return () => {
      if (screenshotPreview) URL.revokeObjectURL(screenshotPreview);
    };
  }, [screenshotPreview]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setScreenshotError(null);

    if (!file) {
      setPaymentScreenshot(null);
      setScreenshotPreview(null);
      return;
    }

    if (!ALLOWED_SCREENSHOT_TYPES.includes(file.type)) {
      setScreenshotError("Please upload an image (.jpg, .jpeg, .png or .webp).");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_SCREENSHOT_SIZE) {
      setScreenshotError("The screenshot must be 5MB or smaller.");
      e.target.value = "";
      return;
    }

    setPaymentScreenshot(file);
    setScreenshotPreview(URL.createObjectURL(file));
  };

  const removeScreenshot = () => {
    const input = document.getElementById("payment-screenshot") as HTMLInputElement | null;
    if (input) input.value = "";
    setPaymentScreenshot(null);
    setScreenshotPreview(null);
    setScreenshotError(null);
  };

  // Place the order when the form is submitted
  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError(null);
    if (!paymentScreenshot) {
      setScreenshotError("Please upload the screenshot of your half payment before placing the order.");
      document.getElementById("payment-screenshot-section")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const formData = new FormData();
    Object.entries(shipping).forEach(([name, value]) => formData.append(name, value.trim()));
    formData.append(
      "items",
      JSON.stringify(
        groupCartItems(items).map(({ product, quantity }) => ({
          productId: product.id,
          quantity,
          size: product.size ?? null,
        }))
      )
    );
    formData.append("screenshot", paymentScreenshot);

    // Logged-in customers send their token so the order is linked to their account
    const token = getAuthToken();
    setIsSubmitting(true);
    try {
      const response = await apiRequest<ApiPlaceOrderResponse>("/api/orders", {
        method: "POST",
        body: formData,
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      clearCart();
      setShipping(EMPTY_SHIPPING);
      setPlacedInvoice(response.order.invoiceNumber);
    } catch (requestError) {
      setCheckoutError(
        requestError instanceof Error ? requestError.message : "Checkout failed."
      );
      return;
    } finally {
      setIsSubmitting(false);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placedInvoice) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-white p-6 text-[#281E18]">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-2xl">
            <div className="flex justify-center mb-6">
              <CheckCircle2 size={80} style={{ color: pinkColor }} className="animate-bounce" />
            </div>
            <h1 className="text-3xl font-bold mb-4">
              <span style={{ color: "#D4AF37" }}>Order Successful!</span></h1>
            <p className="text-zinc-400 mb-4">Thank you for your purchase. Your order has been placed successfully.</p>
            <p className="mb-8 text-sm text-zinc-600">
              Order number: <span className="font-bold text-[#281E18]">{placedInvoice}</span>
              <br />
              We&apos;ll confirm your payment and contact you on Telegram.
            </p>
            <Button asChild className="w-full h-12 font-bold" style={{ backgroundColor: pinkColor, color: "#212121" }}>
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </div>
<Footer />
      <PoweredBy />
    </>
  );
}

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-white py-12 text-[#281E18]">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl font-bold mb-10">
            Finalize <span style={{ color: pinkColor }}>Checkout</span>
          </h1>

          <form onSubmit={placeOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <section className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck style={{ color: pinkColor }} />
                  <h2 className="text-xl font-semibold">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input name="firstName" value={shipping.firstName} onChange={updateShipping} placeholder="First Name" autoComplete="given-name" className={inputStyles} required />
                  <Input name="lastName" value={shipping.lastName} onChange={updateShipping} placeholder="Last Name" autoComplete="family-name" className={inputStyles} required />
                  <Input
                    name="telegramUsername"
                    value={shipping.telegramUsername}
                    onChange={updateShipping}
                    placeholder="Telegram Username (e.g. @nardishop)"
                    pattern="@?[A-Za-z0-9_]{5,32}"
                    title="Your Telegram username: 5–32 letters, numbers or underscores"
                    className={`md:col-span-2 ${inputStyles}`}
                    required
                  />
                  <Input name="phone" value={shipping.phone} onChange={updateShipping} placeholder="Phone number: +2519........" type="tel" autoComplete="tel" className={`md:col-span-2 ${inputStyles}`} required />
                  <Input name="secondPhone" value={shipping.secondPhone} onChange={updateShipping} placeholder="Second phone number (optional): +2519........" type="tel" className={`md:col-span-2 ${inputStyles}`} />
                  {/* <Input placeholder="Address" className={`md:col-span-2 ${inputStyles}`} required /> */}
                  <Input name="city" value={shipping.city} onChange={updateShipping} placeholder="City" autoComplete="address-level2" className={inputStyles} required />
                  <Input name="address" value={shipping.address} onChange={updateShipping} placeholder="Address" autoComplete="street-address" className={inputStyles} required />
                </div>
              </section>

              {/* Payment screenshot upload (required) */}
              <section id="payment-screenshot-section" className="rounded-2xl border border-zinc-200 bg-white p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Upload style={{ color: pinkColor }} />
                  <h2 className="text-xl font-semibold">
                    Payment Screenshot <span className="text-red-500">*</span>
                  </h2>
                </div>
                <p className="mb-4 text-sm text-zinc-600">
                  Pay half of your order (<span className="font-semibold text-[#281E18]">{halfPayment.toFixed(2)} ETB</span>),
                  then upload a screenshot of the payment. Your order can&apos;t be placed without it.
                </p>

                {paymentScreenshot && screenshotPreview ? (
                  <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={screenshotPreview}
                      alt="Payment screenshot preview"
                      className="h-20 w-20 rounded-lg border border-zinc-200 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-1 text-sm font-medium text-green-700">
                        <CheckCircle2 size={16} /> Screenshot uploaded
                      </p>
                      <p className="truncate text-xs text-zinc-500">{paymentScreenshot.name}</p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={removeScreenshot}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="payment-screenshot"
                    className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-300 p-6 text-center transition-colors hover:border-[#D4AF37]"
                  >
                    <ImageIcon className="h-8 w-8 text-zinc-400" />
                    <span className="text-sm font-medium">Click to upload your payment screenshot</span>
                    <span className="text-xs text-zinc-500">JPG, PNG or WEBP, up to 5MB</span>
                  </label>
                )}
                <input
                  id="payment-screenshot"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handleScreenshotChange}
                />

                {screenshotError && (
                  <p role="alert" className="mt-3 text-sm text-red-500">{screenshotError}</p>
                )}
              </section>

              {/* <section className="rounded-2xl border border-zinc-200 bg-white p-6">
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
              </section> */}
            </div>

            <div className="lg:col-span-5">
              <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <ShoppingBag size={20} /> <span style={{ color: "#D4AF37" }}>Order Summary ({items.length})</span>
                </h2>

                <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                  {groupCartItems(items).map(({ product: item, quantity }) => (
                    <div key={cartLineKey(item)} className="flex items-center gap-3 border-b border-zinc-200 pb-4">
                      <div className="relative h-14 w-14 shrink-0 rounded overflow-hidden border border-zinc-200">
                        <ProductImage src={item.image} alt={item.name} className="object-contain" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        {item.size && <p className="text-xs text-zinc-500">Size: {item.size}</p>}
                        <p className="text-xs text-zinc-500">{item.price.toFixed(2)} ETB each</p>
                        {/* Change how many of this product to order */}
                        <QuantitySelector value={quantity} onChange={(next) => setQuantity(item, next)} />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <p className="font-bold text-sm whitespace-nowrap">{(item.price * quantity).toFixed(2)} ETB</p>
                        <button
                          type="button"
                          onClick={() => setQuantity(item, 0)}
                          aria-label={`Remove ${item.name} from order`}
                          className="text-zinc-400 transition-colors hover:text-red-500"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-6 text-zinc-400">
                  <div className="flex justify-between"><span>Subtotal</span><span>{subtotal.toFixed(2)} ETB</span></div>
                  <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 text-xl font-bold text-[#281E18]">
                    <span>Total</span><span style={{ color: pinkColor }}>{total.toFixed(2)} ETB</span>
                  </div>
                </div>

                {/* Half payment notice */}
                <div
                  role="note"
                  className="mb-6 rounded-xl border p-4 text-sm"
                  style={{ borderColor: pinkColor, backgroundColor: "rgba(212, 175, 55, 0.08)" }}
                >
                  <div className="flex items-center gap-2 font-bold text-[#281E18]">
                    <CreditCard size={16} style={{ color: pinkColor }} />
                    Half payment (50%) is required
                  </div>
                  <p className="mt-1 text-zinc-600">
                    To confirm your order, you must pay half of the total in advance. The rest is paid on delivery.
                  </p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between font-semibold text-[#281E18]">
                      <span>Pay now (50%)</span><span>{halfPayment.toFixed(2)} ETB</span>
                    </div>
                    <div className="flex justify-between text-zinc-600">
                      <span>Pay on delivery</span><span>{remainingPayment.toFixed(2)} ETB</span>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={items.length === 0 || !paymentScreenshot || isSubmitting}
                  className="w-full h-14 text-lg font-bold transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: items.length > 0 && paymentScreenshot ? pinkColor : "#555", color: "#212121" }}
                >
                  {isSubmitting ? "Placing your order..." : "Place Order Now"}
                </Button>
                {checkoutError && (
                  <p role="alert" className="mt-3 text-center text-sm text-red-500">{checkoutError}</p>
                )}
                {items.length > 0 && !paymentScreenshot && (
                  <p className="mt-3 text-center text-sm text-red-500">
                    Upload your payment screenshot to place the order.
                  </p>
                )}

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