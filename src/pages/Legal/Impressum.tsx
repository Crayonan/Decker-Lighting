import React from "react";

export function ImpressumPage() {
  return (
    <div className="min-h-screen py-8 pb-32 bg-dark-bg text-dark-text">
      <div className="container max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
        <h1 className="mb-8 text-3xl font-bold text-center">Impressum</h1>

        <div className="space-y-6">
          <Section title="Kontakt">
            <p>Niklas Decker</p>
            <p>Veranstaltungstechnik Dienstleister</p>
            <p>Auf der Platte 8</p>
            <p>88284 Wolpertswende</p>
            <p>Telefon: 017695449722</p>
            <p>E-Mail: niki25.9@web.de</p>
          </Section>

          <Section title="Angaben zur Berufshaftpflicht">
            <p><strong>Name und Sitz des Versicherers:</strong></p>
            <p>Allianz SE</p>
            <p>Florian Kresser</p>
            <p>Rupert-Mayer-Straße 10</p>
            <p>88212 Ravensburg</p>

            <p><strong>Geltungsraum der Versicherung:</strong></p>
            <p>Deutschland</p>
            <p>EU-Streitschlichtung</p>
          </Section>

          <Section title="Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:">
            <p>
              <a href="https://ec.europa.eu/consumers/odr" className="text-blue-400 underline hover:text-blue-300">
                https://ec.europa.eu/consumers/odr
              </a>
            </p>
            <p>Unsere E-Mail-Adresse finden Sie oben im Impressum.</p>
            <p>
              Verbraucherstreitbeilegung/Universalschlichtungsstelle: Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-6 border rounded-lg bg-dark-card-bg border-dark-card-border">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="space-y-2 text-dark-text-secondary">
        {children}
      </div>
    </div>
  );
}

export default ImpressumPage;
