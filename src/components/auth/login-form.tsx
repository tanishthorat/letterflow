"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "./password-input";
import { SocialAuthButtons } from "./social-auth-buttons";
import { AlertCircle } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const { signIn } = useAuth();
  const {
    email,
    password,
    setEmail,
    setPassword,
    error,
    setError,
    loading,
    setLoading,
    clearError,
  } = useAuthForm();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setLoading(true);

    try {
      // Validation
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      if (!password) {
        throw new Error("Password is required");
      }

      await signIn(email, password);
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign in failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md bg-card dark:bg-card border-border dark:border-border-dark p-8 shadow-lg">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6 lg:hidden">
          <div className="w-8 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">
            L
          </div>
          <span className="font-bold text-lg text-foreground">Letterflow</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          👋 Welcome Back!
        </h1>
        <p className="text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Social Auth */}
      <SocialAuthButtons isLoading={loading} />

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="bg-input dark:bg-input-dark border-border dark:border-border-dark"
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-xs text-primary hover:underline"
            >
              Forgot?
            </Link>
          </div>
          <PasswordInput
            label=""
            value={password}
            onChange={setPassword}
            disabled={loading}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium mt-2"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-border dark:border-border-dark">
        <p className="text-xs text-muted text-center">
          By signing in, you agree to our{" "}
          <Link href="#" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </Card>
  );
}
