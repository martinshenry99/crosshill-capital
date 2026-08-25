"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { TrendingUp, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const type = searchParams.get("type");

    if (code) {
      exchangeCode(code);
    } else if (type === "recovery") {
      setLoading(false);
    } else {
      setError("Invalid or expired reset link. Please request a new one.");
      setLoading(false);
    }
  }, [searchParams]);

  const exchangeCode = async (code: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      setError("This reset link has expired or is invalid. Please request a new one.");
    }

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }

    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verifying link</h1>
          <p className="text-muted">Please wait while we verify your reset link...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Password updated</h1>
          <p className="text-muted mb-6">
            Your password has been changed. Redirecting you to login...
          </p>
          <Link href="/login">
            <Button variant="default">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary-dark tracking-wide">
            CROSSHILL CAPITAL
          </span>
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-2">
          Set new password
        </h1>
        <p className="text-muted mb-8">
          Enter your new password below
        </p>

        {error && (
          <div className="bg-danger/10 border border-danger/20 text-danger rounded-lg px-4 py-3 mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? "Updating..." : "Update Password"}
          </Button>
        </form>

        <p className="text-center text-muted mt-6">
          <Link
            href="/login"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Loading</h1>
          <p className="text-muted">Please wait...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
