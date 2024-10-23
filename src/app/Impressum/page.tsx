"use client";

export default function Impressum() {
  return (
    <div className="mx-auto mt-32 w-[60%]">
      <h1 className="my-2 text-3xl font-bold">Impressum</h1>
      <h2 className="my-2 text-2xl font-semibold">Angaben gemäß § 5 TMG</h2>
      <p className="my-2">
        Computer Extra GmbH <br />
        Harleshäuser Straße 8 <br />
        34130 Kassel
      </p>
      <p className="my-2">
        Handelsregister: HRB 19697 <br />
        Registergericht: Amtsgericht Kassel
      </p>
      <p className="my-2">
        <span className="font-medium">Vertreten durch:</span> <br />
        Christian Krauss
      </p>
      <h3 className="my-2 text-xl font-medium">Kontakt</h3>
      <p className="my-2">
        Telefon: 0561 / 60 144 0 <br />
        Telefax: 0561 / 60 144 199 <br />
        E-Mail: info [at] computer-extra [punkt] de
      </p>
      <p className="my-2 text-xl font-medium">Umsatzsteuer-ID</p>
      <p className="my-2">
        Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
        DE357590630
      </p>
      <p className="my-2 text-xl font-medium">Redaktionell verantwortlich</p>
      <p className="my-2">Computer Extra GmbH</p>
      <p className="my-2 text-xl font-medium">EU-Streitschlichtung</p>
      <p className="my-2">
        Die Europäische Kommission stellt eine Plattform zur
        Online-Streitbeilegung (OS) bereit:{" "}
        <a
          href="https://ec.europa.eu/consumers/odr/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          https://ec.europa.eu/consumers/odr/
        </a>
        . Unsere E-Mail-Adresse finden Sie oben im Impressum.
      </p>
      <p className="my-2 text-xl font-medium">
        Verbraucherstreitbeilegung / Universalschlichtungsstelle
      </p>
      <p className="my-2">
        Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren
        vor einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>
    </div>
  );
}
