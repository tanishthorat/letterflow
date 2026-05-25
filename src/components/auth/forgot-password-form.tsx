"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { useAuthForm } from "@/hooks/useAuthForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "@/lib/toast";

export function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const {
    email,
    setEmail,
    error,
    emailError,
    setError,
    setEmailError,
    loading,
    setLoading,
    clearError,
  } = useAuthForm();
  
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    setEmailError("");
    setLoading(true);

    try {
      if (!email.trim()) {
        setEmailError("Please enter your email address");
        setLoading(false);
        return;
      }

      await resetPassword(email);
      setSuccess(true);
      toast.success("Password reset email sent", { description: "Please check your inbox for instructions." });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to send reset email. Please try again.";
      setError(message);
      toast.error("Error", { description: message });
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
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            We have sent a password reset link to <br/>
            <span className="font-medium text-foreground">{email}</span>
          </p>
          <Link href="/login">
            <Button fullWidth variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to log in
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-card dark:bg-card border-border dark:border-border-dark p-8 shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Reset password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
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

        <Button
          type="submit"
          disabled={loading || !email}
          fullWidth
          size="lg"
        >
          {loading ? "Sending link..." : "Send reset link"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border dark:border-border-dark text-center">
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to log in
        </Link>
      </div>
    </Card>
  );
}
