"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TrendingUp, ArrowRight, Eye, EyeOff, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";

const countries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta",
  "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia",
  "Spain", "Sweden", "United Kingdom", "Norway", "Switzerland", "Iceland",
  "United States", "Canada", "Australia", "Nigeria", "South Africa",
  "Kenya", "Ghana", "UAE", "Singapore", "India", "Brazil", "Other",
];

function getGracefulError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("already registered") || lower.includes("already been registered"))
    return "This email is already registered. Please log in or use a different email.";
  if (lower.includes("invalid email"))
    return "Please enter a valid email address.";
  if (lower.includes("password") && lower.includes("weak"))
    return "Your password is too weak. Use at least 8 characters with a mix of letters and numbers.";
  if (lower.includes("rate limit") || lower.includes("too many"))
    return "Too many attempts. Please wait a moment and try again.";
  if (lower.includes("network") || lower.includes("fetch"))
    return "Unable to connect. Please check your internet connection and try again.";
  if (lower.includes("user already registered"))
    return "An account with this email already exists. Try logging in instead.";
  return "Something went wrong. Please try again or contact support if the issue persists.";
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!formData.country) {
      setError("Please select your country of residence.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            country: formData.country,
          },
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (signUpError) {
        setError(getGracefulError(signUpError.message));
      } else {
        // Notify admin of new registration
        fetch("/api/notify-registration", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName,
            email: formData.email,
            country: formData.country,
          }),
        }).catch(() => {});
        setSuccess(true);
      }
    } catch {
      setError("Unable to connect to our servers. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-success" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Check your email
          </h1>
          <p className="text-muted mb-2">
            We&apos;ve sent a confirmation link to:
          </p>
          <p className="font-semibold text-foreground mb-6">{formData.email}</p>
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4 text-sm text-left space-y-2 mb-8">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Click the link in your email to verify your account</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>Check your spam folder if you don&apos;t see it</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span>The link expires in 24 hours</span>
            </div>
          </div>
          <Link href="/login">
            <Button variant="default" size="lg" className="w-full">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-6 sm:mb-8">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-dark tracking-wide">
              CROSSHILL CAPITAL
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Create your account
          </h1>
          <p className="text-muted mb-6 sm:mb-8 text-sm sm:text-base">
            Start investing in professionally managed crypto portfolios
          </p>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger rounded-lg px-4 py-3 mb-6 text-sm flex items-start gap-2">
              <span className="shrink-0 mt-0.5">&#9888;</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              required
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Country
              </label>
              <select
                className="flex h-11 w-full rounded-lg border border-border bg-white px-4 py-2 text-base transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                required
              >
                <option value="">Select your country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-muted hover:text-foreground"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />

            <Button
              type="submit"
              variant="accent"
              size="lg"
              className="w-full mt-6"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
            </Button>
          </form>

          <p className="text-center text-muted mt-6 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-medium hover:underline"
            >
              Log in
            </Link>
          </p>

          <p className="text-center text-xs text-muted mt-4">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 gradient-bg items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-8">
            <TrendingUp className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Join CROSSHILL CAPITAL
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Access institutional-grade crypto portfolio management backed by the
            Index Masterclass team.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              "Professional management",
              "Real-time tracking",
              "Secure deposits",
              "Transparent returns",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
