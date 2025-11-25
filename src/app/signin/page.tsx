"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebaseConfig";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Palette, Mail, Lock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

type UserType = "user" | "artisan" | null;

export default function SignInPage() {
  const [userType, setUserType] = useState<UserType>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuth();
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState<string>("/");
  
  useEffect(() => {
    // Get the redirect URL from the query parameters
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect');
    if (redirect) {
      setRedirectUrl(redirect);
    }
  }, []);

  // Select user or artisan role
  const handleRoleSelection = (type: UserType) => setUserType(type);

  // ---------- Normal Email/Password Sign-In ----------
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1️⃣ Sign in via Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Get Firebase ID Token
      const idToken = await user.getIdToken();

      // 3️⃣ Send token to backend for verification
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/verify-token`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ idToken }),
      });

      // Handle non-JSON responses
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await res.json();

      if (res.ok && data.success) {
        // 4️⃣ Save in frontend context
        signIn({
          id: user.uid,
          name: user.displayName || user.email!.split("@")[0],
          email: user.email!,
          type: userType!,
        });
        router.push(redirectUrl);
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      if (err.message === "Server returned non-JSON response") {
        alert("Unable to connect to the authentication server. Please try again later.");
      } else {
        alert(err.message || "Sign-in failed. Please try again.");
      }
    }
  };

  // ---------- Google Sign-In ----------
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Send token to backend for verification
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/verify-token`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ idToken }),
      });

      // Handle non-JSON responses
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }

      const data = await res.json();

      if (res.ok && data.success) {
        signIn({
          id: user.uid,
          name: user.displayName || user.email!.split("@")[0],
          email: user.email!,
          type: userType!,
        });
        router.push(redirectUrl);
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (error: any) {
      console.error("Google Sign-in Error:", error);
      if (error.message === "Server returned non-JSON response") {
        alert("Unable to connect to the authentication server. Please try again later.");
      } else {
        alert(error.message || "Google sign-in failed. Please try again.");
      }
    }
  };

  // ---------- Mock Apple Sign-In (optional) ----------
  const handleAppleSignIn = () => {
    alert("Apple Sign-In coming soon!");
  };

  // ---------- Role Selection Screen ----------
  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">Welcome Back</h1>
            <p className="text-amber-600">Choose how you'd like to sign in</p>
          </div>

          <div className="space-y-4">
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-amber-300"
              onClick={() => handleRoleSelection("user")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <User className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-lg">Sign in as User</h3>
                  <p className="text-sm text-muted-foreground">
                    Browse and purchase beautiful handcrafted items
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-amber-300"
              onClick={() => handleRoleSelection("artisan")}
            >
              <CardContent className="p-6 flex items-center gap-4">
                <Palette className="h-6 w-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-lg">Sign in as Artisan</h3>
                  <p className="text-sm text-muted-foreground">
                    Sell your artwork and manage your business
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-6">
            <Link href="/" className="text-amber-600 hover:text-amber-800 text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------- Actual Sign-In Form ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={() => setUserType(null)} className="p-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              {userType === "user" ? (
                <User className="h-5 w-5 text-blue-600" />
              ) : (
                <Palette className="h-5 w-5 text-orange-600" />
              )}
              <span className="font-medium">
                {userType === "user" ? "User" : "Artisan"} Sign In
              </span>
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Enter your credentials to access your {userType} account</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" onClick={handleGoogleSignIn}>
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>

            <Button variant="outline" onClick={handleAppleSignIn}>
              <span>Apple</span>
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href={`/register?type=${userType}`} className="text-primary hover:underline">
              Create account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
