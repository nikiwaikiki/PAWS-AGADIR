"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Heart, CheckCircle, Clock, XCircle, Users, ArrowLeft } from "lucide-react";

type Application = { id: string; message: string; status: string };

export default function BecomeHelperPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!supabase || !user) { setLoading(false); return; }
    supabase
      .from("helper_applications")
      .select("id, message, status")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => { setApp(data); setLoading(false); });
  }, [user]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user || !message.trim()) return;
    setSubmitting(true);
    const { data } = await supabase
      .from("helper_applications")
      .insert({ user_id: user.id, message: message.trim() })
      .select("id, message, status")
      .single();
    if (data) setApp(data);
    setSubmitting(false);
  };

  /* not logged in */
  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <Users className="h-16 w-16 text-muted-foreground" />
          <h2 className="font-display text-2xl font-bold">{t("helper.loginRequired")}</h2>
          <p className="text-muted-foreground">{t("helper.loginRequiredDesc")}</p>
          <Link href="/auth" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">{t("common.login")}</Link>
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center"><p className="text-muted-foreground">{t("common.loading")}</p></main>
        <Footer />
      </div>
    );
  }

  /* existing application */
  if (app) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 py-10">
          <div className="container max-w-lg px-4">
            <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> {t("common.back")}
            </Link>

            <div className="rounded-xl border border-border bg-card p-8 text-center">
              {app.status === "pending" && (
                <>
                  <Clock className="mx-auto mb-4 h-16 w-16 text-amber-500" />
                  <h2 className="font-display text-2xl font-bold">{t("helper.status.pending")}</h2>
                  <p className="mt-2 text-muted-foreground">{t("helper.status.pendingDesc")}</p>
                </>
              )}
              {app.status === "approved" && (
                <>
                  <CheckCircle className="mx-auto mb-4 h-16 w-16 text-safe" />
                  <h2 className="font-display text-2xl font-bold">{t("helper.status.approved")}</h2>
                  <p className="mt-2 text-muted-foreground">{t("helper.status.approvedDesc")}</p>
                  <Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                    <Heart className="h-4 w-4" /> {t("helper.status.goToDashboard")}
                  </Link>
                </>
              )}
              {app.status === "rejected" && (
                <>
                  <XCircle className="mx-auto mb-4 h-16 w-16 text-warning" />
                  <h2 className="font-display text-2xl font-bold">{t("helper.status.rejected")}</h2>
                  <p className="mt-2 text-muted-foreground">{t("helper.status.rejectedDesc")}</p>
                </>
              )}
              <div className="mt-6 rounded-lg bg-muted/50 p-4 text-left">
                <p className="text-xs text-muted-foreground">{t("helper.status.yourApplication")}</p>
                <p className="mt-1 text-sm text-foreground">{app.message}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* new application form */
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container max-w-2xl px-4">
          <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> {t("common.back")}
          </Link>

          <h1 className="font-display text-3xl font-bold">{t("helper.title")}</h1>
          <p className="mt-1 text-muted-foreground">{t("helper.description")}</p>

          <div className="mt-6 rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-display text-lg font-bold">{t("helper.benefits.title")}</h2>
            <ul className="space-y-3">
              {(["seeSos", "approve", "edit"] as const).map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-safe" />
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">{t(`helper.benefits.${k}`)}</strong> -- {t(`helper.benefits.${k}Desc`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-5">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-bold">
                <Heart className="h-5 w-5 text-primary" /> {t("helper.application.title")}
              </h2>
              <label htmlFor="msg" className="text-sm font-medium text-foreground">{t("helper.application.question")}</label>
              <textarea
                id="msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t("helper.application.placeholder")}
                rows={5}
                required
                className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">{t("helper.application.hint")}</p>
            </div>

            <div className="flex gap-3">
              <Link href="/" className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">{t("common.cancel")}</Link>
              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {submitting ? t("helper.application.submitting") : t("helper.application.submit")}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
