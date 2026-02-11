export default function InfoPage() {
  return (
    <div className="mx-auto max-w-3xl p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Über Save The Paws</h1>

      <p className="text-sm leading-6 text-muted-foreground">
        Save The Paws koordiniert Rescue-, Impf- und Kastrationsaktionen in der Region Agadir–Taghazout.
        Diese App hilft uns, Hunde zu dokumentieren, Status nachzuverfolgen und Adoptionen zu ermöglichen.
      </p>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">So kannst du helfen</h2>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>Adoptieren oder Pflegestelle anbieten</li>
          <li>Spenden für Kastration/Impfung</li>
          <li>Rehab Spot nach Kastration anbieten</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Kontakt</h2>
        <p className="text-sm">
          Schreib uns:{" "}
          <a className="underline" href="mailto:contact@save-the-paws.de">contact@save-the-paws.de</a>
        </p>
      </section>
    </div>
  );
}
