"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Loader, AlertCircle } from "lucide-react";
import { GoogleIcon, GitHubIcon } from "@/components/ui/icons";

interface SocialAuthButtonsProps {
    isLoading?: boolean;
}

export function SocialAuthButtons({ isLoading: parentLoading = false }: SocialAuthButtonsProps) {
    const { signInWithGoogle, signInWithGitHub } = useAuth();
    const searchParams = useSearchParams();
    const nextParam = searchParams.get("next");
    const [googleLoading, setGoogleLoading] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);
    const [error, setError] = useState("");

    const handleGoogleSignIn = async () => {
        setError("");
        setGoogleLoading(true);
        try {
            await signInWithGoogle(nextParam || undefined);
        } catch (err) {
            const message = err instanceof Error ? err.message : "Google sign in failed";
            setError(message);
            setGoogleLoading(false);
        }
    };

    const handleGitHubSignIn = async () => {
        setError("");
        setGithubLoading(true);
        try {
            await signInWithGitHub(nextParam || undefined);
        } catch (err) {
            const message = err instanceof Error ? err.message : "GitHub sign in failed";
            setError(message);
            setGithubLoading(false);
        }
    };

    const isLoading = parentLoading || googleLoading || githubLoading;

    return (
        <div className="space-y-3">
            {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="flex items-center gap-3">
                {/* Google full-width pill */}
                <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-10 rounded-lg bg-input dark:bg-input-dark border-2 border-border dark:border-border-dark hover:bg-secondary dark:hover:bg-secondary/20 justify-center"
                    disabled={isLoading}
                    onClick={handleGoogleSignIn}
                    aria-label="Sign in with Google"
                >
                    {googleLoading ? (
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <GoogleIcon className="w-4 h-4 mr-2" />
                    )}
                    <span className="font-light">{googleLoading ? "Signing in..." : "Sign In with Google"}</span>
                </Button>

                {/* GitHub square icon button */}
                <Button
                    type="button"
                    variant="outline"
                    className="w-10 h-10 p-0 rounded-md border-2 border-border dark:border-border-dark flex items-center justify-center bg-input dark:bg-input-dark hover:bg-secondary dark:hover:bg-secondary/20"
                    disabled={isLoading}
                    onClick={handleGitHubSignIn}
                    title="Sign in with GitHub"
                    aria-label="Sign in with GitHub"
                >
                    {githubLoading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                        <GitHubIcon className="w-4 h-4" />
                    )}
                </Button>
            </div>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border dark:border-border-dark" />
                </div>
                <div className="relative flex justify-center text-xs uppercase font-medium">
                    <span className="px-2 bg-card dark:bg-card text-muted-foreground">
                        Or
                    </span>
                </div>
            </div>
        </div>
    );
}
