"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { User, Palette, Mail, Lock, Phone, MapPin, Calendar, Building, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";

type UserType = "user" | "artisan";

interface UserFormData {
  name: string;
  email: string;
  phone: string;
  location: string;
  age: string;
  password: string;
  confirmPassword: string;
}

interface ArtisanFormData {
  name: string;
  brandName: string;
  email: string;
  phone: string;
  artworkType: string;
  state: string;
  city: string;
  password: string;
  confirmPassword: string;
  bio: string;
}

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Goa", "Gujarat", "Haryana",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"
];

const ARTWORK_TYPES = [
  "Painting", "Sculpture", "Pottery", "Textiles", "Jewelry",
  "Wood Carving", "Metal Work", "Embroidery", "Handicrafts", "Other"
];

function RegisterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("user");
  const [loading, setLoading] = useState(false);

  const [userFormData, setUserFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone: "",
    location: "",
    age: "",
    password: "",
    confirmPassword: ""
  });

  const [artisanFormData, setArtisanFormData] = useState<ArtisanFormData>({
    name: "",
    brandName: "",
    email: "",
    phone: "",
    artworkType: "",
    state: "",
    city: "",
    password: "",
    confirmPassword: "",
    bio: ""
  });

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "artisan" || type === "user") setUserType(type);
  }, [searchParams]);

  const handleUserFormChange = (field: keyof UserFormData, value: string) =>
    setUserFormData((prev) => ({ ...prev, [field]: value }));

  const handleArtisanFormChange = (field: keyof ArtisanFormData, value: string) =>
    setArtisanFormData((prev) => ({ ...prev, [field]: value }));

  // -------------------- Normal Email/Password Sign-Up --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = userType === "user" ? userFormData : artisanFormData;
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      setLoading(false);
      return;
    }

    try {
      // 1️⃣ Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // 2️⃣ Verify token in backend
      await fetch("http://localhost:5000/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      alert("Registration successful!");
      router.push("/signin");
    } catch (error: any) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Google Sign-Up --------------------
  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      await fetch("http://localhost:5000/verify-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      alert("Registered with Google successfully!");
      router.push("/signin");
    } catch (error: any) {
      alert(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- UI --------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/signin">
              <Button variant="ghost" size="sm" className="p-1">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              {userType === "user" ? (
                <User className="h-5 w-5 text-blue-600" />
              ) : (
                <Palette className="h-5 w-5 text-orange-600" />
              )}
              <span className="font-medium">
                {userType === "user" ? "User" : "Artisan"} Registration
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>
            Fill in your details to create your {userType} account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* USER FORM */}
            {userType === "user" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={userFormData.name}
                      onChange={(e) => handleUserFormChange("name", e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={userFormData.email}
                      onChange={(e) => handleUserFormChange("email", e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={userFormData.phone}
                      onChange={(e) => handleUserFormChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={userFormData.age}
                      onChange={(e) => handleUserFormChange("age", e.target.value)}
                      placeholder="Age"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input
                    value={userFormData.location}
                    onChange={(e) => handleUserFormChange("location", e.target.value)}
                    placeholder="Enter your city, state"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={userFormData.password}
                      onChange={(e) => handleUserFormChange("password", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={userFormData.confirmPassword}
                      onChange={(e) => handleUserFormChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* ARTISAN FORM */}
            {userType === "artisan" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={artisanFormData.name}
                      onChange={(e) => handleArtisanFormChange("name", e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Brand Name</Label>
                    <Input
                      value={artisanFormData.brandName}
                      onChange={(e) => handleArtisanFormChange("brandName", e.target.value)}
                      placeholder="Enter brand name"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={artisanFormData.email}
                      onChange={(e) => handleArtisanFormChange("email", e.target.value)}
                      placeholder="Enter email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={artisanFormData.phone}
                      onChange={(e) => handleArtisanFormChange("phone", e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Type of Artwork</Label>
                  <Select
                    value={artisanFormData.artworkType}
                    onValueChange={(v) => handleArtisanFormChange("artworkType", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ARTWORK_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Select
                      value={artisanFormData.state}
                      onValueChange={(v) => handleArtisanFormChange("state", v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={artisanFormData.city}
                      onChange={(e) => handleArtisanFormChange("city", e.target.value)}
                      placeholder="Enter city"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bio (optional)</Label>
                  <Textarea
                    value={artisanFormData.bio}
                    onChange={(e) => handleArtisanFormChange("bio", e.target.value)}
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={artisanFormData.password}
                      onChange={(e) => handleArtisanFormChange("password", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input
                      type="password"
                      value={artisanFormData.confirmPassword}
                      onChange={(e) => handleArtisanFormChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <Button variant="outline" onClick={handleGoogleSignUp} className="w-full">
              Continue with Google
            </Button>

            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/signin" className="text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterPageContent />
    </Suspense>
  );
}
