"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/lib/actions";
import { Eye, EyeOff, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal p-4"
      style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(157,141,241,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(149,242,217,0.1) 0%, transparent 40%)`,
      }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🐾</div>
          <h1 className="text-2xl font-bold text-white">
            Newcastle<span className="text-neon-mint">.dog</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">Admin back office</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock size={18} className="text-lavender" />
            <h2 className="font-semibold text-charcoal">Sign in to admin</h2>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="admin@newcastle.dog"
              />
            </div>

            <div>
              <label className="form-label" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="form-input pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary w-full justify-center py-3 rounded-xl text-base mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Newcastle.dog Admin · Secure access only
        </p>
      </div>
    </div>
  );
}
