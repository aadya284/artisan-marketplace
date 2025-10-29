"use client";

import { useState } from "react";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { useCart } from "@/contexts/CartContext";
import RazorpayGPayButton from "@/components/ui/razorpay-gpay-button";
import { NewsletterFooter } from "@/components/footers/newsletter-footer";
import AiChatbotWidget from "@/components/ui/ai-chatbot-widget";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Truck, 
  MapPin, 
  Clock,
  Shield,
  Star,
  Heart,
  ArrowRight,
  Gift,
  Percent
} from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartCount, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1); // 1: Cart, 2: Checkout, 3: Payment
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);


  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  const shipping = subtotal > 10000 ? 0 : 199;
  const tax = Math.round(subtotal * 0.18); // 18% GST
  const total = subtotal + shipping + tax - discount;

  const applyPromoCode = () => {
    if (promoCode === "ARTISAN20") {
      setDiscount(Math.round(subtotal * 0.2));
    } else if (promoCode === "FIRST10") {
      setDiscount(Math.round(subtotal * 0.1));
    }
  };

  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <>
        <AnimatedIndicatorNavbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-700 mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Your Cart is Empty
            </h2>
            <p className="text-gray-500 mb-8">Discover beautiful handcrafted items from talented artisans</p>
            <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700">
              <a href="/explore">
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
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
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        {/* Progress Steps */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto py-6">
            <div className="flex items-center justify-center space-x-8">
              {[
                { step: 1, title: "Cart", icon: ShoppingCart },
                { step: 2, title: "Checkout", icon: Truck },
                { step: 3, title: "Payment", icon: CreditCard }
              ].map(({ step, title, icon: Icon }) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step 
                      ? "bg-orange-600 border-orange-600 text-white" 
                      : "border-gray-300 text-gray-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 font-medium ${
                    currentStep >= step ? "text-orange-600" : "text-gray-400"
                  }`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {title}
                  </span>
                  {step < 3 && (
                    <ArrowRight className={`w-5 h-5 mx-4 ${
                      currentStep > step ? "text-orange-600" : "text-gray-300"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Shopping Cart ({cartCount} items)
                  </h2>
                  
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-bold text-lg text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600">by {item.artist} • {item.state}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm">{item.rating}</span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xl font-bold text-gray-800">₹{item.price.toLocaleString()}</span>
                              {item.originalPrice > item.price && (
                                <span className="text-sm text-gray-500 line-through">₹{item.originalPrice.toLocaleString()}</span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Continue Shopping */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <Button variant="outline" asChild>
                      <a href="/explore">
                        Continue Shopping
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Delivery Address
                  </h2>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={deliveryAddress.fullName}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, fullName: e.target.value})}
                    />
                    <Input
                      placeholder="Phone Number"
                      value={deliveryAddress.phoneNumber}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, phoneNumber: e.target.value})}
                    />
                    <Input
                      placeholder="Address"
                      className="md:col-span-2"
                      value={deliveryAddress.address}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, address: e.target.value})}
                    />
                    <Input
                      placeholder="City"
                      value={deliveryAddress.city}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, city: e.target.value})}
                    />
                    <Input
                      placeholder="State"
                      value={deliveryAddress.state}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, state: e.target.value})}
                    />
                    <Input
                      placeholder="PIN Code"
                      value={deliveryAddress.pincode}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, pincode: e.target.value})}
                    />
                    <Input
                      placeholder="Landmark (Optional)"
                      value={deliveryAddress.landmark}
                      onChange={(e) => setDeliveryAddress({...deliveryAddress, landmark: e.target.value})}
                    />
                  </div>

                  {/* Delivery Options */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                      Delivery Options
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer">
                        <input type="radio" name="delivery" defaultChecked className="text-orange-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Truck className="w-5 h-5 text-orange-600" />
                            <span className="font-medium">Standard Delivery</span>
                            <Badge variant="outline" className="text-green-600 border-green-600">FREE</Badge>
                          </div>
                          <p className="text-sm text-gray-600">5-7 business days</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 cursor-pointer">
                        <input type="radio" name="delivery" className="text-orange-600" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span className="font-medium">Express Delivery</span>
                            <span className="text-blue-600 font-semibold">₹299</span>
                          </div>
                          <p className="text-sm text-gray-600">2-3 business days</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Payment Method
                  </h2>
                  
                  <div className="space-y-4">
                    {/* Credit/Debit Card */}
                    <div className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`} 
                         onClick={() => setPaymentMethod('card')}>
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} />
                        <CreditCard className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Credit/Debit Card</span>
                        <div className="flex gap-2 ml-auto">
                          <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">VISA</div>
                          <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">MC</div>
                        </div>
                      </div>
                      {paymentMethod === 'card' && (
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                          <Input placeholder="Card Number" className="md:col-span-2" />
                          <Input placeholder="MM/YY" />
                          <Input placeholder="CVV" />
                          <Input placeholder="Name on Card" className="md:col-span-2" />
                        </div>
                      )}
                    </div>

                    {/* UPI */}
                    <div className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                         onClick={() => setPaymentMethod('upi')}>
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} />
                        <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-red-500 rounded"></div>
                        <span className="font-medium">UPI Payment</span>
                        <Badge variant="outline" className="text-green-600 border-green-600">Instant</Badge>
                      </div>
                      {paymentMethod === 'upi' && (
                        <div className="mt-4">
                          <Input placeholder="Enter UPI ID (e.g., name@paytm)" />
                        </div>
                      )}
                    </div>

                    {/* Net Banking */}
                    <div className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'netbanking' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                         onClick={() => setPaymentMethod('netbanking')}>
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')} />
                        <Shield className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Net Banking</span>
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div className={`p-4 border rounded-lg cursor-pointer ${paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                         onClick={() => setPaymentMethod('cod')}>
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                        <Gift className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Cash on Delivery</span>
                        <Badge variant="outline" className="text-blue-600 border-blue-600">₹50 Extra</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Google Pay via Razorpay */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Pay with Google Pay</h3>
                    <RazorpayGPayButton 
                      amount={total} 
                      onSuccess={(response) => {
                        alert("Payment successful! Order ID: " + response.razorpay_order_id);
                        clearCart();
                        window.location.href = '/orders';
                      }}
                      onError={(error) => {
                        console.error('Payment failed:', error);
                        alert('Payment failed: ' + error.message);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                <h3 className="text-xl font-bold mb-4 text-gray-800" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Order Summary
                </h3>

                {/* Promo Code */}
                <div className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button onClick={applyPromoCode} size="sm" variant="outline">
                      <Percent className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Savings</span>
                    <span>-₹{savings.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST 18%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Promo Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Security Note */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Your payment information is secure</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {currentStep === 1 && (
                    <>
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3"
                        onClick={() => setCurrentStep(2)}
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        Buy Now (Express Checkout)
                      </Button>
                    </>
                  )}
                  
                  {currentStep === 2 && (
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3"
                        onClick={() => setCurrentStep(3)}
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        Continue to Payment
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setCurrentStep(1)}
                      >
                        Back to Cart
                      </Button>
                    </div>
                  )}
                  
                  {currentStep === 3 && (
                    <div className="space-y-2">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}
                      >
                        Place Order
                        <Shield className="w-5 h-5 ml-2" />
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setCurrentStep(2)}
                      >
                        Back to Delivery
                      </Button>
                    </div>
                  )}
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 10000 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-700">
                      Add ₹{(10000 - subtotal).toLocaleString()} more for FREE shipping!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <NewsletterFooter />
      <AiChatbotWidget />
    </>
  );
}
