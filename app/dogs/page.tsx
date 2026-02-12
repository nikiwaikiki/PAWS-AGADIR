"use client";

import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Search, Filter, XCircle } from "lucide-react";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DogCard } from "@/components/dog-card";
import type { Tables } from "@/lib/database.types";

type Dog = Tables<"dogs">;

const fetchDogs = async (): Promise<Dog[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("Error fetching dogs:", error.message);
    return [];
  }
  return data ?? [];
};

type FilterType = "all" | "vaccinated" | "pending";

export default function DogsPage() {
  const { t } = useTranslation();
  const { data: dogs = [], isLoading } = useSWR("dogs-approved", fetchDogs);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filtered = useMemo(() => {
    let result = dogs;
    if (filter === "vaccinated") result = result.filter((d) => d.is_vaccinated);
    if (filter === "pending") result = result.filter((d) => !d.is_vaccinated);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          (d.location ?? "").toLowerCase().includes(q) ||
          (d.ear_tag ?? "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [dogs, search, filter]);

  const filters: { key: FilterType; label: string }[] = [
    { key: "all", label: t("dogsPage.filterAll") },
    { key: "vaccinated", label: t("dogsPage.filterVaccinated") },
    { key: "pending", label: t("dogsPage.filterPending") },
  ];

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t("dogsPage.title")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dogsPage.description")}
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("dogsPage.searchPlaceholder")}
              className="h-10 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === f.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* Dogs Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
            <p className="text-muted-foreground">{t("dogsPage.noDogs")}</p>
            {(search || filter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                <XCircle className="h-4 w-4" />
                {t("dogsPage.resetFilters")}
              </button>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
