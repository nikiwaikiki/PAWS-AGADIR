"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { Menu, X, Globe, PawPrint } from "lucide-react";
import { useState } from "react";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const { user, isHelper, isAdmin, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t("common.home") },
    { href: "/dogs", label: t("common.dogs") },
    { href: "/adoption", label: t("adoption.title") },
    { href: "/info", label: "Info" },
  ];

  if (user) {
    navLinks.push({ href: "/map", label: t("common.map") });
    navLinks.push({ href: "/report", label: t("common.report") });
  }
  if (isHelper || isAdmin) {
    navLinks.push({ href: "/dashboard", label: t("common.dashboard") });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <PawPrint className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold text-foreground">
            Save The Paws
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}

          {/* Language */}
          <div className="ml-2 flex items-center gap-0.5 rounded-md border border-border p-0.5">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => i18n.changeLanguage(lang.code)}
                className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
                  i18n.language?.startsWith(lang.code)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {user ? (
            <button
              onClick={() => signOut()}
              className="ml-2 rounded-md bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              {t("common.logout")}
            </button>
          ) : (
            <Link
              href="/auth"
              className="ml-2 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t("common.login")}
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-2 text-muted-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-border bg-background px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}

            <div className="my-2 flex items-center gap-1">
              <Globe className="h-4 w-4 text-muted-foreground" />
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={`rounded px-2 py-1 text-xs font-medium ${
                    i18n.language?.startsWith(lang.code)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-accent"
              >
                {t("common.logout")}
              </button>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground"
              >
                {t("common.login")}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
