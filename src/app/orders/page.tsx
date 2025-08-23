"use client";

import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { useAuth } from "@/contexts/AuthContext";
import { Package, Truck, CheckCircle } from "lucide-react";

export default function OrdersPage() {
  const { user } = useAuth();

  return (
    <>
      <AnimatedIndicatorNavbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders yet</h3>
              <p className="text-gray-500">
                Start exploring our artisan marketplace to place your first order!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
