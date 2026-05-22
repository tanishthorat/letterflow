"use client";

import { FormEvent, useState } from "react";
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
import { AlertCircle, CheckCircle } from "lucide-react";

export function SignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();
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

  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      // Validation
      if (!email.trim()) {
        throw new Error("Email is required");
      }
      if (!password) {
        throw new Error("Password is required");
      }

      await signUp(email, password);
      setSuccess(true);

      // Brief delay to show success state
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign up failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md bg-card dark:bg-card border-border dark:border-border-dark p-8 shadow-lg">
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Account Created!
          </h2>
          <p className="text-sm text-muted mb-6">
            Welcome to Letterflow. Redirecting to your dashboard...
          </p>
          <div className="h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full" />
        </div>
      </Card>
    );
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
          Create Account
        </h1>
        <p className="text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
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
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          disabled={loading}
          error={passwordError ? "" : undefined}
        />

        {/* Confirm Password Input */}
        <PasswordInput
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={setConfirmPassword}
          disabled={loading}
          error={passwordError}
        />

        {/* Password Requirements */}
        <div className="text-xs text-muted space-y-1">
          <p>Password requirements:</p>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            <li className={password.length >= 8 ? "text-primary" : ""}>
              At least 8 characters
            </li>
            <li className={password === confirmPassword && password ? "text-primary" : ""}>
              Passwords match
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium mt-2"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 pt-6 border-t border-border dark:border-border-dark">
        <p className="text-xs text-muted text-center">
          By signing up, you agree to our{" "}
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
