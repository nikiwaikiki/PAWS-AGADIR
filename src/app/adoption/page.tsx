"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { supabase } from "@/lib/supabase";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Heart, MapPin, PawPrint } from "lucide-react";

type Dog = {
  id: string;
  name: string;
  photo_url: string | null;
  location: string | null;
  additional_info: string | null;
  is_vaccinated: boolean | null;
  ear_tag: string;
};

export default function AdoptionPage() {
  const { t } = useTranslation();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase
      .from("dogs")
      .select("id, name, photo_url, location, additional_info, is_vaccinated, ear_tag")
      .eq("report_type", "save")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setDogs(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="border-b border-border bg-card py-10 sm:py-14">
          <div className="container px-4 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl text-balance">
              {t("adoption.title")}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {t("adoption.description")}
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="container px-4">
            {loading ? (
              <p className="py-16 text-center text-muted-foreground">{t("adoption.loading")}</p>
            ) : dogs.length === 0 ? (
              <div className="py-16 text-center">
                <PawPrint className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                <p className="text-muted-foreground">{t("adoption.noDogs")}</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {dogs.map((dog) => (
                  <div
                    key={dog.id}
                    className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
                  >
                    <div className="relative aspect-[4/3] bg-muted">
                      {dog.photo_url ? (
                        <Image
                          src={dog.photo_url}
                          alt={dog.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <PawPrint className="h-12 w-12 text-muted-foreground/30" />
                        </div>
                      )}
                      {dog.is_vaccinated && (
                        <span className="absolute right-2 top-2 rounded-full bg-safe px-2.5 py-0.5 text-[10px] font-semibold text-white">
                          {t("dogCard.vaccinated")}
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold text-foreground">{dog.name}</h3>
                      {dog.location && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {dog.location}
                        </p>
                      )}
                      {dog.additional_info && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                          {dog.additional_info}
                        </p>
                      )}
                      <a
                        href="mailto:savethepaws.agadir@gmail.com"
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
                      >
                        <Heart className="h-4 w-4" /> {t("adoption.adopt")}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
