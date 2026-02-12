"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import { MapPin, Syringe, AlertTriangle, Clock, Eye } from "lucide-react";
import type { Tables } from "@/lib/database.types";

type Dog = Tables<"dogs">;

interface DogCardProps {
  dog: Dog;
  showStatus?: boolean;
}

export function DogCard({ dog, showStatus }: DogCardProps) {
  const { t } = useTranslation();

  const urgencyColor: Record<string, string> = {
    low: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
  };

  const typeLabel: Record<string, string> = {
    save: t("reportTypes.save.title"),
    sos: t("reportTypes.sos.title"),
    stray: t("reportTypes.stray.title"),
    vaccination_wish: t("reportTypes.vaccination.title"),
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] bg-muted">
        {dog.photo_url ? (
          <Image
            src={dog.photo_url}
            alt={dog.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
            🐾
          </div>
        )}
        {dog.report_type === "sos" && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
            <AlertTriangle className="h-3 w-3" /> SOS
          </div>
        )}
        {dog.report_type !== "sos" && dog.report_type && (
          <div className="absolute left-2 top-2 rounded-full bg-card/90 px-2 py-0.5 text-xs font-medium text-card-foreground backdrop-blur-sm">
            {typeLabel[dog.report_type] ?? dog.report_type}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {dog.name}
          </h3>
          {dog.ear_tag && (
            <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
              {dog.ear_tag}
            </span>
          )}
        </div>

        {dog.location && (
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            {dog.location}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {dog.is_vaccinated ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              <Syringe className="h-3 w-3" /> {t("dogCard.vaccinated")}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {t("dogCard.notVaccinated")}
            </span>
          )}

          {dog.urgency_level && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${urgencyColor[dog.urgency_level] ?? "bg-muted text-muted-foreground"}`}
            >
              {t("dogCard.urgency")}: {dog.urgency_level}
            </span>
          )}

          {showStatus && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                dog.is_approved
                  ? "bg-primary/10 text-primary"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {dog.is_approved ? (
                <>
                  <Eye className="h-3 w-3" /> {t("dogCard.visible")}
                </>
              ) : (
                <>
                  <Clock className="h-3 w-3" /> {t("dogCard.pending")}
                </>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
