"use client";

import { useTranslation } from "react-i18next";
import { PawPrint } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="container flex flex-col items-center gap-3 px-4 text-center">
        <div className="flex items-center gap-2">
          <PawPrint className="h-5 w-5 text-primary" />
          <span className="font-display text-sm font-bold text-foreground">
            {t("footer.brand")}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{t("footer.madeWith")}</p>
      </div>
    </footer>
  );
}
