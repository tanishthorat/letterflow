"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "@/lib/toast";

export function UpdatePasswordForm() {
  const { updatePassword } = useAuth();
  const router = useRouter();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      toast.success("Password updated", { description: "Your password has been changed successfully." });
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update password. Please try again.";
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
            Password updated!
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            Your password has been changed successfully. You will be redirected to the dashboard shortly.
          </p>
          <Button fullWidth onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md bg-card dark:bg-card border-border dark:border-border-dark p-8 shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Update password
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your new password below.
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
            id="password"
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="bg-input dark:bg-input-dark border-border dark:border-border-dark"
            required
          />
        </div>

        <div className="space-y-2">
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            className="bg-input dark:bg-input-dark border-border dark:border-border-dark"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          fullWidth
          size="lg"
        >
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </Card>
  );
}
