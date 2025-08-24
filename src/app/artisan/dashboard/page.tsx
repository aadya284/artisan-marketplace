"use client";

import { useState } from "react";
import { AnimatedIndicatorNavbar } from "@/components/navbars/animated-indicator-navbar";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3, DollarSign, Package, TrendingUp, Wallet, Download, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Types for bank details form
interface BankDetailsForm {
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountType: "savings" | "current";
}

// Sample artisan earnings data
const artisanEarnings = {
  totalEarnings: 45750,
  availableBalance: 23400,
  pendingClearance: 8500,
  totalWithdrawn: 13850,
  recentSales: [
    { id: 1, artwork: "Madhubani Painting", amount: 4500, date: "2024-01-15", status: "cleared" },
    { id: 2, artwork: "Blue Pottery Bowl", amount: 2200, date: "2024-01-12", status: "cleared" },
    { id: 3, artwork: "Warli Art Canvas", amount: 3200, date: "2024-01-10", status: "pending" },
    { id: 4, artwork: "Kalamkari Fabric", amount: 5600, date: "2024-01-08", status: "cleared" },
    { id: 5, artwork: "Pattachitra Scroll", amount: 3800, date: "2024-01-05", status: "cleared" }
  ],
  monthlyGrowth: 15.2
};

export default function ArtisanDashboardPage() {
  const { user } = useAuth();
  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  const form = useForm<BankDetailsForm>({
    defaultValues: {
      accountHolderName: "",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
      accountType: "savings"
    }
  });

  const onSubmit = (data: BankDetailsForm) => {
    // Validate account numbers match
    if (data.accountNumber !== data.confirmAccountNumber) {
      form.setError("confirmAccountNumber", {
        type: "manual",
        message: "Account numbers do not match"
      });
      return;
    }

    // Here you would normally send the data to your backend
    console.log("Withdrawal request:", {
      ...data,
      amount: parseFloat(withdrawalAmount),
      timestamp: new Date().toISOString()
    });

    // Show success message and close dialog
    alert(`Withdrawal request of ₹${withdrawalAmount} submitted successfully! You will receive the amount in 3-5 business days.`);
    setIsWithdrawalDialogOpen(false);
    form.reset();
    setWithdrawalAmount("");
  };

  return (
    <>
      <AnimatedIndicatorNavbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard & Statistics</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{artisanEarnings.totalEarnings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <Wallet className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">₹{artisanEarnings.availableBalance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Ready for withdrawal</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Clearance</CardTitle>
                <Package className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">₹{artisanEarnings.pendingClearance.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Processing payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+{artisanEarnings.monthlyGrowth}%</div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Welcome to your artisan dashboard! Start by adding your first artwork.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your statistics will appear here once you start adding products and receiving orders.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
