"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Camera, MapPin, Send, AlertTriangle, CheckCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { compressImage } from "@/lib/compress-image";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Database } from "@/lib/database.types";

type ReportType = Database["public"]["Enums"]["report_type"];

const AGADIR_CENTER = { lat: 30.427755, lng: -9.598107 };

export default function ReportPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reportType, setReportType] = useState<ReportType>("stray");
  const [name, setName] = useState("");
  const [earTag, setEarTag] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState(AGADIR_CENTER.lat);
  const [lng, setLng] = useState(AGADIR_CENTER.lng);
  const [urgency, setUrgency] = useState("medium");
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePhoto = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file, 1200, 0.75);
    const preview = URL.createObjectURL(compressed);
    setPhotoPreview(preview);

    if (!supabase || !user) {
      const reader = new FileReader();
      reader.onload = () => setPhotoUrl(reader.result as string);
      reader.readAsDataURL(compressed);
      return;
    }
    const ext = compressed.type === "image/webp" ? "webp" : "jpg";
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("dog-photos")
      .upload(path, compressed, { cacheControl: "3600", upsert: false, contentType: compressed.type });
    if (error) {
      console.warn("Upload error:", error.message);
      return;
    }
    const { data: pub } = supabase.storage.from("dog-photos").getPublicUrl(path);
    setPhotoUrl(pub.publicUrl);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !user) return;
    setSubmitting(true);
    const isAutoApproved = reportType === "save";

    const { error } = await supabase.from("dogs").insert({
      name: name || "Unknown",
      ear_tag: earTag || `TEMP-${Date.now()}`,
      report_type: reportType,
      latitude: lat,
      longitude: lng,
      location,
      urgency_level: urgency,
      is_vaccinated: isVaccinated,
      is_approved: isAutoApproved,
      additional_info: additionalInfo || null,
      photo_url: photoUrl,
      reported_by: user.id,
    });

    setSubmitting(false);
    if (!error) setSuccess(true);
  };

  if (!user) {
    return (
      <>
        <Header />
        <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center">
          <AlertTriangle className="h-12 w-12 text-primary" />
          <h1 className="font-display text-xl font-bold">{t("addDog.loginRequired")}</h1>
          <p className="text-muted-foreground">{t("addDog.loginRequiredDesc")}</p>
          <button
            onClick={() => router.push("/auth")}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
          >
            {t("common.login")}
          </button>
        </main>
        <Footer />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Header />
        <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
          <h1 className="font-display text-xl font-bold">{t("addDog.reportSent")}</h1>
          <p className="text-muted-foreground">{t("donation.afterReport")}</p>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dogs")}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
            >
              {t("addDog.backToList")}
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const reportTypes: { key: ReportType; icon: string; desc: string }[] = [
    { key: "save", icon: "✅", desc: t("addDog.reportType.saveDesc") },
    { key: "sos", icon: "🚨", desc: t("addDog.reportType.sosDesc") },
    { key: "stray", icon: "🐕", desc: t("addDog.reportType.strayDesc") },
    { key: "vaccination_wish", icon: "💉", desc: t("addDog.reportType.vaccinationDesc") },
  ];

  const urgencyLevels = [
    { key: "low", color: "bg-green-100 text-green-800 border-green-200" },
    { key: "medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    { key: "high", color: "bg-orange-100 text-orange-800 border-orange-200" },
    { key: "critical", color: "bg-red-100 text-red-800 border-red-200" },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-lg px-4 pb-24 pt-6">
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t("addDog.title")}
        </h1>
        <p className="mb-6 mt-1 text-sm text-muted-foreground">{t("addDog.description")}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Report Type */}
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-foreground">
              {t("addDog.reportType.title")}
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {reportTypes.map((rt) => (
                <button
                  key={rt.key}
                  type="button"
                  onClick={() => setReportType(rt.key)}
                  className={`flex flex-col items-center gap-1 rounded-lg border-2 p-3 text-center transition-colors ${
                    reportType === rt.key
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="text-xl">{rt.icon}</span>
                  <span className="text-xs font-medium">{rt.desc}</span>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Basic info */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-medium text-foreground">{t("addDog.basicInfo")}</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("addDog.namePlaceholder")}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              value={earTag}
              onChange={(e) => setEarTag(e.target.value)}
              placeholder={t("addDog.earTagPlaceholder")}
              className="h-10 rounded-lg border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Photo */}
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card p-6 text-sm text-muted-foreground hover:border-primary/40"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="h-32 w-auto rounded-lg object-cover" />
              ) : (
                <>
                  <Camera className="h-5 w-5" />
                  {t("addDog.photo")}
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handlePhoto}
            />
          </div>

          {/* Location */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">{t("addDog.location")}</label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Taghazout Beach"
                className="h-10 flex-1 rounded-lg border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground">{t("addDog.locationHint")}</p>
          </div>

          {/* Urgency */}
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-foreground">
              {t("addDog.urgency")}
            </legend>
            <div className="flex gap-2">
              {urgencyLevels.map((u) => (
                <button
                  key={u.key}
                  type="button"
                  onClick={() => setUrgency(u.key)}
                  className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                    urgency === u.key ? u.color : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {t(`addDog.urgencyLevels.${u.key}`)}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Vaccinated toggle */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={isVaccinated}
              onChange={(e) => setIsVaccinated(e.target.checked)}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-foreground">{t("addDog.vaccinated")}</span>
          </label>

          {/* Notes */}
          <textarea
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            placeholder={
              reportType === "sos"
                ? t("addDog.sosNotesPlaceholder")
                : t("addDog.additionalNotesPlaceholder")
            }
            rows={3}
            className="resize-none rounded-lg border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting || !name}
            className="flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-medium text-primary-foreground transition-opacity disabled:opacity-50"
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("addDog.submit")}
              </>
            )}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
