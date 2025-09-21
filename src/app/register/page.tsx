"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
  "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
];

const ARTWORK_TYPES = [
  "Painting", "Sculpture", "Pottery", "Textiles", "Jewelry", "Wood Carving",
  "Metal Work", "Embroidery", "Handicrafts", "Traditional Art", "Modern Art", "Other"
];


function RegisterPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("user");
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
    if (type === "artisan" || type === "user") {
      setUserType(type);
    }
  }, [searchParams]);

  const handleUserFormChange = (field: keyof UserFormData, value: string) => {
    setUserFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArtisanFormChange = (field: keyof ArtisanFormData, value: string) => {
    setArtisanFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = userType === "user" ? userFormData : artisanFormData;
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // TODO: Implement actual registration logic
    console.log("Registration attempted", { userType, formData });
    
    // Redirect to sign in page after successful registration
    router.push("/signin");
  };

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
            {userType === "user" ? (
              <>
                {/* ...existing user form code... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={userFormData.name}
                        onChange={(e) => handleUserFormChange("name", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={userFormData.email}
                        onChange={(e) => handleUserFormChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* ...existing code... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={userFormData.phone}
                        onChange={(e) => handleUserFormChange("phone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="age"
                        type="number"
                        placeholder="Enter your age"
                        value={userFormData.age}
                        onChange={(e) => handleUserFormChange("age", e.target.value)}
                        className="pl-10"
                        min="18"
                        max="100"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* ...existing code... */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="Enter your city, state"
                      value={userFormData.location}
                      onChange={(e) => handleUserFormChange("location", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                {/* ...existing code... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={userFormData.password}
                        onChange={(e) => handleUserFormChange("password", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={userFormData.confirmPassword}
                        onChange={(e) => handleUserFormChange("confirmPassword", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ...existing artisan form code... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={artisanFormData.name}
                        onChange={(e) => handleArtisanFormChange("name", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brandName">Brand Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="brandName"
                        type="text"
                        placeholder="Enter your brand name"
                        value={artisanFormData.brandName}
                        onChange={(e) => handleArtisanFormChange("brandName", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* ...existing code... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={artisanFormData.email}
                        onChange={(e) => handleArtisanFormChange("email", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={artisanFormData.phone}
                        onChange={(e) => handleArtisanFormChange("phone", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* ...existing code... */}
                <div className="space-y-2">
                  <Label htmlFor="artworkType">Type of Artwork</Label>
                  <Select value={artisanFormData.artworkType} onValueChange={(value) => handleArtisanFormChange("artworkType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your artwork type" />
                    </SelectTrigger>
                    <SelectContent>
                      {ARTWORK_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* ...existing code... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={artisanFormData.state} onValueChange={(value) => handleArtisanFormChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="city"
                        type="text"
                        placeholder="Enter your city"
                        value={artisanFormData.city}
                        onChange={(e) => handleArtisanFormChange("city", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                {/* ...existing code... */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself and your artwork..."
                    value={artisanFormData.bio}
                    onChange={(e) => handleArtisanFormChange("bio", e.target.value)}
                    rows={3}
                  />
                </div>
                {/* ...existing code... */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={artisanFormData.password}
                        onChange={(e) => handleArtisanFormChange("password", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={artisanFormData.confirmPassword}
                        onChange={(e) => handleArtisanFormChange("confirmPassword", e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
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
