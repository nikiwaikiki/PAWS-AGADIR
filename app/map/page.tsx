"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Tables } from "@/lib/database.types";

type Dog = Tables<"dogs">;

const DogMap = dynamic(() => import("@/components/dog-map").then((m) => m.DogMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] items-center justify-center rounded-xl bg-muted">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  ),
});

const fetchAllDogs = async (): Promise<Dog[]> => {
  if (!supabase) return [];
  const { data } = await supabase.from("dogs").select("*").order("created_at", { ascending: false });
  return data ?? [];
};

const fetchApprovedDogs = async (): Promise<Dog[]> => {
  if (!supabase) return [];
  const { data } = await supabase.from("dogs").select("*").eq("is_approved", true).order("created_at", { ascending: false });
  return data ?? [];
};

export default function MapPage() {
  const { t } = useTranslation();
  const { user, isHelper, isAdmin } = useAuth();
  const canSeeAll = isHelper || isAdmin;

  const { data: dogs = [], isLoading } = useSWR(
    user ? (canSeeAll ? "dogs-all" : "dogs-approved") : null,
    canSeeAll ? fetchAllDogs : fetchApprovedDogs
  );

  const stats = useMemo(() => {
    const vaccinated = dogs.filter((d) => d.is_vaccinated).length;
    const pending = dogs.filter((d) => !d.is_approved).length;
    return { total: dogs.length, vaccinated, pending };
  }, [dogs]);

  if (!user) {
    return (
      <>
        <Header />
        <main className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-20 text-center">
          <h1 className="font-display text-xl font-bold">{t("auth.loginToViewMap")}</h1>
          <a
            href="/auth"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
          >
            {t("common.login")}
          </a>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">{t("common.map")}</h1>
            <p className="text-sm text-muted-foreground">{t("map.description")}</p>
          </div>
          {!isLoading && (
            <div className="flex gap-3 text-xs font-medium">
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-green-800">
                {stats.vaccinated} {t("map.vaccinatedDogs")}
              </span>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                {stats.total} {t("common.dogs")}
              </span>
              {canSeeAll && stats.pending > 0 && (
                <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-yellow-800">
                  {stats.pending} {t("map.pending")}
                </span>
              )}
            </div>
          )}
        </div>

        <DogMap dogs={dogs} />
      </main>
      <Footer />
    </>
  );
}
