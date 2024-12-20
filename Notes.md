# Aufbau und co

## Was soll die App eigentlich machen?

- [ ] Übungen für Datenschutz
- [x] Informationstexte
- [ ] Tests zu den Übungen und texten
- [ ] Nach erfolgreichen Test soll ein Zertifikat ausgestellt werden
- [ ] Informationen können
  - [x] Texte beinhalten
  - [ ] Bilder beinhalten
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

- [x] Datenbank
- [ ] Web Oberfläche
- [ ] Backend für Datenbank Operationen
- [ ] Upload für Bilder / Videos / Zertifikate
- [ ] Erstellung von Zertifikaten als PDF/A
- [x] Login System für Benutzer
- [ ] CMS Ähnliches System zum erstellen und verwalten
  - [ ] Medien
  - [ ] Texten
  - [x] Informationen
  - [ ] Tests
  - [ ] Kategorien
  - [ ] Zertifikaten
  - [ ] Benutzern

## Wie setzen wir das um?

- [x] Nextjs mit T3 App? (Prisma / Tailwind / Next Auth)
- [x] NextAuth für Authentifizierung?
- [ ] Datei Upload?
  - [ ] Direkt mit Next?
    - [x] Wie erhöht man Datei Limit? Standard ist 2MB?
- [ ] Medienwiedergabe?
- [ ] PDF Erstellung
- [x] Text schreiben? Mit Markdown?

## Auf was müssen wir dabei achten?

- [ ] Könnte schnell langsam werden, wenn Prisma genutzt wird...
