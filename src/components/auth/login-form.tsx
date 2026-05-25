"use client";

import { FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PasswordInput } from "./password-input";
import { SocialAuthButtons } from "./social-auth-buttons";
import { AlertCircle } from "lucide-react";
import { toast } from "@/lib/toast";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const { signIn } = useAuth();
  const {
    email,
    password,
    setEmail,
    setPassword,
    error,
    emailError,
    passwordError,
    setError,
    setEmailError,
    setPasswordError,
    loading,
    setLoading,
    clearError,
  } = useAuthForm();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setLoading(true);

    // clear field errors
    setEmailError("");
    setPasswordError("");

    try {
      // Validation
      if (!email.trim()) {
        setEmailError("Please enter your email address");
        setLoading(false);
        return;
      }
      if (!password) {
        setPasswordError("Please enter your password");
        setLoading(false);
        return;
      }

      await signIn(email, password);
      router.push(nextParam ? decodeURIComponent(nextParam) : "/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign in failed. Please try again.";
      setError(message);
      toast.error("Sign in failed", { description: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md bg-card dark:bg-card border-border dark:border-border-dark p-8 shadow-lg">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          👋 Welcome Back!
        </h1>
        <p className="text-sm text-muted-foreground">
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
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Email Input */}
        <div className="space-y-2">
          {/* <Label htmlFor="email">Email</Label> */}
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="bg-input dark:bg-input-dark border-border dark:border-border-dark"
            error={emailError}
            errorAsPop
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          
          <PasswordInput
            label=""
            value={password}
            onChange={setPassword}
            disabled={loading}
            error={passwordError}
            errorAsPop
          />
          <div className="flex items-end justify-end">
            {/* <Label htmlFor="password">Password</Label> */}
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading}
          fullWidth
          size="lg"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-border dark:border-border-dark">
        <p className="text-xs text-muted-foreground text-center">
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
