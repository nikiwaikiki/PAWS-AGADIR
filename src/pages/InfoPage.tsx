import { useTranslation } from "react-i18next";
import Header from "@/components/Header";

export default function InfoPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-12">
        <div className="mx-auto max-w-3xl p-4 space-y-6">
          <h1 className="text-2xl font-semibold text-foreground">{t('info.title')}</h1>

          <p className="text-sm leading-6 text-muted-foreground">
            {t('info.description')}
          </p>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">{t('info.helpTitle')}</h2>
            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
              <li>{t('info.help1')}</li>
              <li>{t('info.help2')}</li>
              <li>{t('info.help3')}</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">{t('info.contactTitle')}</h2>
            <p className="text-sm text-muted-foreground">
              {t('info.contactText')}{" "}
              <a className="underline text-primary" href="mailto:contact@save-the-paws.de">contact@save-the-paws.de</a>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
