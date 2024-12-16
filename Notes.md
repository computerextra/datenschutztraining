# Aufbau und co

## Was soll die App eigentlich machen?

- [ ] Übungen für Datenschutz
- [ ] Informationstexte
- [ ] Tests zu den Übungen und texten
- [ ] Nach erfolgreichen Test soll ein Zertifikat ausgestellt werden
- [ ] Informationen können Texte / Bilder beinhalten
- [ ] Ein Test besteht aus verschiedenen Sektionen
- [ ] Ein Test hat eine Kategorie
- [ ] Eine Sektion eines Tests kann:
  - [ ] Multiple Antworten haben
  - [ ] Freie Antworten haben
  - [ ] Videos zum ansehen haben
- [ ] Es soll Benutzer geben
  - [ ] Benutzer haben einen Namen und melden sich mit ihrer Mail adresse an.
  - [ ] Benutzer können Tests machen
  - [ ] Der Fortschritt des Nutzers kann angezeigt werden.
  - [ ] Der Benutzer kann seine abgeschlossenen Tests sehen
  - [ ] Der Benutzer kann seine Zertifikate einsehen

## Was wird benötigt?

- [ ] Datenbank
- [ ] Web Oberfläche
- [ ] Backend für Datenbank Operationen
- [ ] Upload für Bilder / Videos / Zertifikate
- [ ] Erstellung von Zertifikaten als PDF/A
- [ ] Login System für Benutzer
- [ ] CMS Ähnliches System zum erstellen und verwalten
  - [ ] Medien
  - [ ] Texten
  - [ ] Informationen
  - [ ] Tests
  - [ ] Kategorien
  - [ ] Zertifikaten
  - [ ] Benutzern

## Wie setzen wir das um?

- [ ] Nextjs mit T3 App? (Prisma / Tailwind / Next Auth)
- [ ] NextAuth für Authentifizierung?
- [ ] Datei Upload?
  - [ ] Direkt mit Next?
    - [ ] Wie erhöht man Datei Limit? Standard ist 2MB?
- [ ] Medienwiedergabe?
- [ ] PDF Erstellung
- [ ] Text schreiben? Mit Markdown?

## Auf was müssen wir dabei achten?

- [ ] Könnte schnell langsam werden, wenn Prisma genutzt wird...
