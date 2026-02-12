"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function AuthPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError("Service unavailable. Please try again later.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) setError(t("auth.invalidCredentials"));
        else router.push("/dogs");
      } else {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        });
        if (err) setError(t("auth.emailAlreadyRegistered"));
        else router.push("/dogs");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-12">
        <h1 className="font-display text-center text-2xl font-bold text-foreground">
          {isLogin ? t("auth.login") : t("auth.signup")}
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t("auth.namePlaceholder")}
              className="h-11 rounded-lg border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.emailPlaceholder")}
            required
            className="h-11 rounded-lg border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.password")}
            required
            minLength={6}
            className="h-11 rounded-lg border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="h-11 rounded-lg bg-primary font-medium text-primary-foreground transition-opacity disabled:opacity-50"
          >
            {loading ? t("auth.pleaseWait") : isLogin ? t("auth.login") : t("auth.signup")}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          className="mt-4 text-center text-sm text-primary hover:underline"
        >
          {isLogin ? t("auth.noAccount") : t("auth.alreadyRegistered")}
        </button>
      </main>
      <Footer />
    </>
  );
}
