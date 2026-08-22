"use client";

import { useState, useEffect } from "react";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/home/navbar";
import { ArrowRight, Eye, EyeOff, AlertCircle, Loader2, Mail } from "lucide-react";

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { userId, isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthLoaded && isSignedIn && userId) {
      router.replace("/dashboard/me");
    }
  }, [isAuthLoaded, isSignedIn, userId, router]);

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [factorStage, setFactorStage] = useState<"first" | "second">("first");
  const [factorStrategy, setFactorStrategy] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: identifier,
        password: password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard/me");
        return;
      }

      const firstFactors = (result.supportedFirstFactors ?? []) as any[];
      const secondFactors = (result.supportedSecondFactors ?? []) as any[];

      if (secondFactors.length > 0) {
        // 2FA required
        const pick =
          secondFactors.find((f) => f.strategy === "totp") ||
          secondFactors.find((f) => f.strategy === "backup_code") ||
          secondFactors.find((f) => f.strategy === "email_code") ||
          secondFactors[0];

        const params: any = { strategy: pick.strategy };
        if (pick.strategy === "email_code" && pick.emailAddressId) {
          params.email_address_id = pick.emailAddressId;
        }
        await signIn.prepareSecondFactor(params);
        setFactorStage("second");
        setFactorStrategy(pick.strategy);
      } else if (firstFactors.length > 0) {
        // Email verification code as first factor (unverified email, new device)
        const pick =
          firstFactors.find((f) => f.strategy === "email_code") ||
          firstFactors[0];
        await signIn.prepareFirstFactor({ strategy: pick.strategy } as any);
        setFactorStage("first");
        setFactorStrategy(pick.strategy);
      } else {
        setError("Unable to sign in. Please check your credentials.");
        return;
      }

      setCode("");
      setVerifying(true);
    } catch (err: any) {
      const c = err.errors?.[0]?.code;
      if (c === "verification_strategy_not_valid") {
        setError(
          "This account requires a verification code. Please try again or use Google sign-in."
        );
      } else {
        setError(
          err.errors?.[0]?.longMessage ||
            err.errors?.[0]?.message ||
            "Invalid email, username, or password"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      const result =
        factorStage === "second"
          ? await signIn.attemptSecondFactor({
              code,
              strategy: factorStrategy as any,
            })
          : await signIn.attemptFirstFactor({
              code,
              strategy: factorStrategy as any,
            });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard/me");
      } else {
        setError("Verification incomplete. Please check the code.");
      }
    } catch (err: any) {
      setError(
        err.errors?.[0]?.longMessage ||
          err.errors?.[0]?.message ||
          "Invalid verification code"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isLoaded) return;
    setGoogleLoading(true);
    setError("");
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/timer",
      });
    } catch (err: any) {
      setError(
        err.errors?.[0]?.message || "Could not authenticate with Google"
      );
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Atmospheric background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-success/[0.04] rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 flex-grow flex items-center justify-center p-6 pt-28 pb-16">
        {!verifying ? (
          <div className="w-full max-w-[440px] bg-popover/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl relative z-10 glow-active">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="font-heading text-2xl font-bold text-white mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your Focurio account to continue.
            </p>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            disabled={googleLoading || loading}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-border bg-muted hover:bg-accent transition-colors text-sm font-semibold text-white mb-6 cursor-pointer disabled:opacity-50"
          >
            {googleLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin text-secondary" />
                <span>Connecting to Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.8 15.71 17.58V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.58C14.73 18.24 13.48 18.64 12 18.64C9.13 18.64 6.7 16.7 5.83 14.1H2.17V16.94C3.99 20.53 7.7 23 12 23Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.83 14.1C5.61 13.44 5.48 12.74 5.48 12C5.48 11.26 5.61 10.56 5.83 9.9V7.06H2.17C1.42 8.55 1 10.22 1 12C1 13.78 1.42 15.45 2.17 16.94L5.83 14.1Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.36C13.62 5.36 15.06 5.92 16.2 7.02L19.35 3.87C17.45 2.1 14.97 1 12 1C7.7 1 3.99 3.47 2.17 7.06L5.83 9.9C6.7 7.3 9.13 5.36 12 5.36Z"
                    fill="#EA4335"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              or
            </span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-xs font-semibold text-foreground mb-1.5 uppercase tracking-wider"
                htmlFor="identifier"
              >
                Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email or username"
                className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-[#c9c3d9]/40 focus:outline-none focus:border-primary transition-colors h-12"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className="block text-xs font-semibold text-foreground uppercase tracking-wider"
                  htmlFor="password"
                >
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-input border border-border rounded-xl pl-4 pr-11 py-3 text-sm text-white placeholder-[#c9c3d9]/40 focus:outline-none focus:border-primary transition-colors h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !isLoaded || googleLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm py-3 rounded-full transition-all duration-300 h-12 shadow-lg shadow-primary/25 flex justify-center items-center gap-2 cursor-pointer mt-6 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-8 text-center pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="text-secondary font-semibold hover:underline ml-1"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      ) : (
        /* Verification Code Step (email verification code or 2FA) */
        <div className="w-full max-w-[440px] bg-popover/80 backdrop-blur-xl border border-border rounded-2xl p-8 shadow-2xl relative z-10 glow-active">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Mail className="h-6 w-6 text-secondary" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-white mb-2">
              {factorStage === "second" ? "Two-factor verification" : "Verify your account"}
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              We sent a verification code to{" "}
              <span className="font-semibold text-white">{identifier}</span>.
              Enter it below to continue.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2 text-left">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-input border border-border rounded-xl px-4 py-3 text-center text-lg tracking-[0.2em] font-mono text-white placeholder-[#c9c3d9]/40 focus:outline-none focus:border-primary transition-colors h-14"
                />
              </div>

              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold text-sm py-3 rounded-full transition-all duration-300 h-12 shadow-lg shadow-primary/25 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => setVerifying(false)}
              className="mt-5 text-xs text-muted-foreground hover:text-white transition-colors"
            >
              Back to sign in
            </button>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
