"use client";

import React, { useState, type ChangeEvent } from "react";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { useCart } from "@/contexts/CartContext";
import RazorpayGPayButton from "@/components/ui/razorpay-gpay-button";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, ArrowRight, CreditCard, Gift, Shield } from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [promoCode, setPromoCode] = useState("");

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal > 10000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  const applyPromoCode = () => {
    if (promoCode === "ARTISAN20") {
      alert("Promo applied: 20% (demo)");
    } else if (promoCode !== "") {
      alert("Promo code not recognized");
    }
  };

  const onPromoChange = (e: ChangeEvent<HTMLInputElement>) => setPromoCode(e.target.value);

  if (cartItems.length === 0) {
    return (
      <>
        <AnimatedIndicatorNavbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold mb-2">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Browse handcrafted items and add them to your cart.</p>
            <Button asChild>
              <a href="/explore" className="flex items-center gap-2">Start Shopping <ArrowRight className="w-4 h-4" /></a>
            </Button>
          </div>
        </div>
        <NewsletterFooter />
        <AiChatbotWidget />
      </>
    );
  }

  return (
    <>
      <AnimatedIndicatorNavbar />

      <main className="container mx-auto py-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            <h1 className="text-2xl font-bold">Shopping Cart ({cartCount})</h1>

            {cartItems.map((item) => (
              <div key={String(item.id)} className="flex items-center gap-4 p-4 border rounded">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-gray-500">by {item.artist}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{item.price.toLocaleString()}</div>
                      <div className="text-sm">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</Button>
                    <Button size="sm" variant="outline" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                    <Button size="sm" variant="ghost" onClick={() => removeFromCart(item.id)}>Remove</Button>
                  </div>
                </div>
              </div>
            ))}
          </section>

          <aside className="bg-white p-6 rounded shadow">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="mb-2">Subtotal: <strong>₹{subtotal.toLocaleString()}</strong></div>
            <div className="mb-2">Shipping: <strong>{shipping === 0 ? 'FREE' : `₹${shipping}`}</strong></div>
            <div className="mb-4">Tax: <strong>₹{tax.toLocaleString()}</strong></div>
            <hr className="my-4" />
            <div className="mb-4 text-lg">Total: <strong>₹{total.toLocaleString()}</strong></div>

            <div className="mb-4">
              <Input placeholder="Promo code" value={promoCode} onChange={onPromoChange} />
              <div className="mt-2">
                <Button size="sm" onClick={applyPromoCode}>Apply</Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className={`p-3 border rounded cursor-pointer ${paymentMethod === 'online' ? 'bg-orange-50 border-orange-400' : 'border-gray-200'}`} onClick={() => setPaymentMethod('online')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><CreditCard className="w-5 h-5" /> <span>Pay Online</span></div>
                    <Badge variant="outline">Secure</Badge>
                  </div>
                  {paymentMethod === 'online' && (
                    <div className="mt-3">
                      <RazorpayGPayButton
                        amount={total}
                        onSuccess={(res) => {
                          alert('Payment successful (demo)');
                          clearCart();
                          window.location.href = '/orders';
                        }}
                        onError={(err) => {
                          console.error('Payment error', err);
                          alert('Payment failed');
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className={`p-3 border rounded cursor-pointer ${paymentMethod === 'cod' ? 'bg-orange-50 border-orange-400' : 'border-gray-200'}`} onClick={() => setPaymentMethod('cod')}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Gift className="w-5 h-5" /> <span>Cash on Delivery</span></div>
                    <Badge variant="outline">₹50 Extra</Badge>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="mt-3">
                      <Button className="w-full bg-orange-600 text-white" onClick={() => {
                        alert('Order placed with Cash on Delivery (demo)');
                        clearCart();
                        window.location.href = '/orders';
                      }}>Place Order (Cash on Delivery)</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 flex items-center gap-2"><Shield className="w-4 h-4" /> Your payment information is secure</div>
          </aside>
        </div>
      </main>

      <NewsletterFooter />
      <AiChatbotWidget />
    </>
  );
}
