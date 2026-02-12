"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Heart, PawPrint, Home, Mail, ArrowRight } from "lucide-react";

export default function InfoPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Intro */}
        <section className="border-b border-border bg-card py-10 sm:py-14">
          <div className="container px-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <PawPrint className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl text-balance">
              {t("info.title")}
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("info.description")}
            </p>
          </div>
        </section>

        {/* How to help */}
        <section className="py-10 sm:py-14">
          <div className="container px-4">
            <h2 className="mb-6 font-display text-2xl font-bold text-foreground">
              {t("info.helpTitle")}
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Heart, text: t("info.help1") },
                { icon: PawPrint, text: t("info.help2") },
                { icon: Home, text: t("info.help3") },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-start gap-3 rounded-xl border border-border bg-card p-5"
                >
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <p className="text-sm leading-relaxed text-foreground">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="border-t border-border bg-card py-10 sm:py-14">
          <div className="container px-4 text-center">
            <h2 className="mb-4 font-display text-2xl font-bold text-foreground">
              {t("info.contactTitle")}
            </h2>
            <p className="mb-5 text-sm text-muted-foreground">{t("info.contactText")}</p>
            <a
              href="mailto:savethepaws.agadir@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              <Mail className="h-4 w-4" />
              savethepaws.agadir@gmail.com
            </a>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-14">
          <div className="container flex flex-col items-center gap-4 px-4 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground text-balance">
              {t("helperCta.title")}
            </h2>
            <p className="max-w-lg text-sm text-muted-foreground">
              {t("helperCta.description")}
            </p>
            <Link
              href="/become-helper"
              className="inline-flex items-center gap-2 rounded-lg border-2 border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              {t("helperCta.apply")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
