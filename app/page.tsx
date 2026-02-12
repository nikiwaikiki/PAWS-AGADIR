"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  PawPrint,
  AlertTriangle,
  Dog,
  Heart,
  ArrowRight,
  HandHeart,
} from "lucide-react";

const FEATURES = [
  { key: "taggedDogs", icon: PawPrint, href: "/dogs", color: "bg-safe/10 text-safe" },
  { key: "sos", icon: AlertTriangle, href: "/report", color: "bg-warning/10 text-warning" },
  { key: "reportStray", icon: Dog, href: "/report", color: "bg-primary/10 text-primary" },
  { key: "adopt", icon: Heart, href: "/adoption", color: "bg-safe/10 text-safe" },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { user, isHelper } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden sm:min-h-[70vh]">
          <Image
            src="/hero-dog.jpg"
            alt={t("hero.imageAlt")}
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent" />

          <div className="relative z-10 w-full px-4 pb-10 pt-20 sm:pb-14">
            <div className="container">
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-primary-foreground/70">
                {t("hero.region")}
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                {t("hero.title")}{" "}
                <span className="text-primary">{t("hero.titleHighlight")}</span>
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/85 sm:text-base">
                {t("hero.description")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/dogs"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
                >
                  <PawPrint className="h-4 w-4" />
                  {t("hero.viewDogs")}
                </Link>
                <Link
                  href={user ? "/report" : "/auth"}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-foreground/15 px-5 py-2.5 text-sm font-semibold text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/25"
                >
                  {t("hero.reportAnimal")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="border-b border-border py-14 sm:py-20">
          <div className="container px-4 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl text-balance">
              {t("landing.mission.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("landing.mission.description")}
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-14 sm:py-20">
          <div className="container px-4">
            <div className="mb-10 text-center">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
                {t("landing.features.title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t("landing.features.description")}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((f) => {
                const Icon = f.icon;
                return (
                  <Link
                    key={f.key}
                    href={f.href}
                    className="group flex flex-col items-start rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-md"
                  >
                    <div className={`mb-3 rounded-lg p-2.5 ${f.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {t(`landing.features.${f.key}.title`)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {t(`landing.features.${f.key}.description`)}
                    </p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      {t("landing.learnMore")}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Donate Teaser */}
        <section className="border-t border-border bg-card py-14 sm:py-20">
          <div className="container flex flex-col items-center gap-5 px-4 text-center">
            <div className="rounded-full bg-primary/10 p-4">
              <HandHeart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl text-balance">
              {t("donation.title")}
            </h2>
            <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
              {t("donation.description")}
            </p>
            <a
              href="https://www.paypal.com/donate/?hosted_button_id=XXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105"
            >
              <Heart className="h-4 w-4" />
              {t("donation.cta")}
            </a>
          </div>
        </section>

        {/* Become a Helper CTA */}
        {!isHelper && (
          <section className="py-14 sm:py-20">
            <div className="container flex flex-col items-center gap-5 px-4 text-center">
              <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl text-balance">
                {t("helperCta.title")}
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                {t("helperCta.description")}
              </p>
              <Link
                href={user ? "/become-helper" : "/auth"}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-transparent px-6 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                {t("helperCta.apply")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
