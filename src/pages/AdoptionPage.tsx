import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";

type AdoptionDog = {
  id: string;
  name: string;
  age_text: string | null;
  size: string | null;
  weight_kg: number | null;
  energy: string | null;
  character: string | null;
  description: string | null;
  traits: string[] | null;
  photo_url: string | null;
  location: string | null;
  contact_url: string | null;
  is_active: boolean;
  sort_order: number;
};

const theme = {
  navy: "#1a2332",
  orange: "#ff6b35",
  beige: "#f4e8d8",
  white: "#ffffff",
};

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-0.5">
      <div className="text-base">{icon}</div>
      <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: theme.navy }}>
        {label}
      </div>
      <div className="text-sm font-bold" style={{ color: theme.orange }}>
        {value}
      </div>
    </div>
  );
}

function TraitTag({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <span
      className="px-2 py-1 text-[10px] font-bold uppercase tracking-wide border rounded"
      style={{
        borderColor: theme.navy,
        background: accent ? theme.orange : theme.white,
        color: accent ? theme.white : theme.navy,
        boxShadow: `1px 1px 0 ${theme.navy}`,
      }}
    >
      {text}
    </span>
  );
}

function AdoptionCard({ dog, t }: { dog: AdoptionDog; index: number; t: (key: string) => string }) {
  const traits = dog.traits ?? [];
  const contactHref =
    dog.contact_url ||
    "mailto:contact@save-the-paws.de?subject=Adoption%20Inquiry&body=I%20am%20interested%20in%20" +
      encodeURIComponent(dog.name);

  return (
    <div
      className="relative shrink-0 w-[280px] rounded-[10px] overflow-hidden border-[3px]"
      style={{
        background: theme.white,
        borderColor: theme.navy,
        boxShadow: `0 6px 0 ${theme.navy}, 0 8px 15px rgba(26,35,50,.30)`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[6px] z-10"
        style={{
          background:
            "repeating-linear-gradient(90deg, " +
            `${theme.orange} 0px, ${theme.orange} 8px, ${theme.navy} 8px, ${theme.navy} 16px)`,
        }}
      />

      <img
        src={dog.photo_url || "/placeholder.svg"}
        alt={dog.name}
        className="w-full h-[250px] object-cover border-b-2"
        style={{ borderColor: theme.orange, background: theme.beige }}
        loading="lazy"
      />

      <div className="p-4 flex flex-col min-h-[250px]">
        <div className="flex justify-between items-start pb-2 mb-2 border-b-2 border-dashed" style={{ borderColor: theme.orange }}>
          <h3 className="text-xl font-bold uppercase tracking-wide leading-tight" style={{ color: theme.navy }}>
            {dog.name}
          </h3>
          <span
            className="text-[11px] font-bold uppercase tracking-wide px-2 py-1 border-2 rounded"
            style={{
              background: theme.orange,
              color: theme.white,
              borderColor: theme.navy,
              boxShadow: `2px 2px 0 ${theme.navy}`,
              whiteSpace: "nowrap",
            }}
          >
            {dog.age_text || t('adoption.age')}
          </span>
        </div>

        <div
          className="relative grid grid-cols-2 gap-2 p-3 rounded border-2 my-2"
          style={{ background: theme.beige, borderColor: theme.navy }}
        >
          <Stat icon="📏" label={t('adoption.size')} value={dog.size || "n/a"} />
          <Stat icon="⚖️" label={t('adoption.weight')} value={dog.weight_kg ? `${dog.weight_kg}kg` : "n/a"} />
          <Stat icon="🎯" label={t('adoption.energy')} value={dog.energy || "n/a"} />
          <Stat icon="❤️" label={t('adoption.character')} value={dog.character || "n/a"} />
        </div>

        {dog.description && (
          <p className="text-[12px] leading-5 text-justify flex-grow" style={{ color: theme.navy }}>
            {dog.description}
          </p>
        )}

        {!!traits.length && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {traits.slice(0, 8).map((trait, i) => (
              <TraitTag key={trait + i} text={trait} accent={i % 2 === 1} />
            ))}
          </div>
        )}

        <a
          href={contactHref}
          className="mt-3 block text-center font-bold uppercase tracking-[.18em] text-[13px] px-3 py-2 rounded border-2"
          style={{
            background: theme.orange,
            color: theme.white,
            borderColor: theme.navy,
            boxShadow: `0 4px 0 ${theme.navy}`,
          }}
        >
          {t('adoption.adopt')}
        </a>

        {dog.location && (
          <div className="mt-2 text-xs opacity-80" style={{ color: theme.navy }}>
            {t('adoption.location')}: {dog.location}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdoptionPage() {
  const { t } = useTranslation();
  const [dogs, setDogs] = useState<AdoptionDog[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("adoption_dogs")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (!error && data) {
          setDogs(data as AdoptionDog[]);
        } else if (error) {
          // Table may not exist yet -- gracefully show empty
          console.warn("[Adoption] Could not load adoption dogs:", error.message);
        }
      } catch (err) {
        console.warn("[Adoption] Unexpected error:", err);
      }
      setLoading(false);
    })();
  }, []);

  const pages = useMemo(() => dogs.length, [dogs.length]);

  const scrollToIndex = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelectorAll<HTMLElement>("[data-card]")[i];
    card?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="p-4" style={{ background: theme.beige }}>
          <div className="mx-auto max-w-[900px]">
            <h1 className="text-2xl font-semibold mb-2" style={{ color: theme.navy }}>
              {t('adoption.title')}
            </h1>
            <p className="text-sm mb-4 opacity-80" style={{ color: theme.navy }}>
              {t('adoption.description')}
            </p>

            {loading ? (
              <div className="text-sm" style={{ color: theme.navy }}>
                {t('adoption.loading')}
              </div>
            ) : dogs.length === 0 ? (
              <div className="text-sm" style={{ color: theme.navy }}>
                {t('adoption.noDogs')}
              </div>
            ) : (
              <>
                <div className="relative">
                  <div
                    ref={scrollerRef}
                    className="flex gap-5 overflow-x-auto pb-3"
                    style={{
                      scrollSnapType: "x mandatory",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    {dogs.map((d, idx) => (
                      <div key={d.id} data-card style={{ scrollSnapAlign: "start" }}>
                        <AdoptionCard dog={d} index={idx} t={t} />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center gap-4 mt-3">
                    <button
                      onClick={() => scrollToIndex(Math.max(0, 0))}
                      className="w-11 h-11 rounded border-2 font-bold"
                      style={{ borderColor: theme.navy, boxShadow: `0 4px 0 ${theme.navy}`, background: theme.white, color: theme.navy }}
                      type="button"
                      aria-label="Previous"
                    >
                      {'←'}
                    </button>
                    <button
                      onClick={() => scrollToIndex(Math.max(0, pages - 1))}
                      className="w-11 h-11 rounded border-2 font-bold"
                      style={{ borderColor: theme.navy, boxShadow: `0 4px 0 ${theme.navy}`, background: theme.white, color: theme.navy }}
                      type="button"
                      aria-label="Next"
                    >
                      {'→'}
                    </button>
                  </div>

                  <div className="flex justify-center gap-2 mt-3">
                    {dogs.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => scrollToIndex(i)}
                        className="h-3 w-3 rounded-sm border-2"
                        style={{ borderColor: theme.navy, background: theme.white, boxShadow: `1px 1px 0 ${theme.navy}` }}
                        type="button"
                        aria-label={`Card ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
