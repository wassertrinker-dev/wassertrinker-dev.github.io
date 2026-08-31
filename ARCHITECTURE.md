# Architekturentscheidungen

## Seitenrahmen und Inhaltsnavigation

Die Case Study ist als feste App-Struktur aufgebaut:

- Der Header bleibt am oberen Rand sichtbar und enthält den Seitentitel, die gegenseitige Verlinkung zur Seite „Wer bin ich?“, den Style-Wechsel, den bewusst noch funktionslosen Button „Anmelden“ und den bestehenden Link „Motion Leap ansehen“.
- Ausschließlich der Inhaltsbereich unter dem Header scrollt und nutzt die verbleibende Seitenhöhe.
- Eisberg, Workflow und Tote Genies sind eigenständige Inhaltsbereiche innerhalb dieses Scrollbereichs.
- Die einklappbare Inhaltsnavigation markiert den aktuell sichtbaren Bereich und muss per Maus, Touch und Tastatur nutzbar bleiben.

Änderungen am Seitenlayout müssen diese Struktur erhalten. Neue Inhaltsbereiche werden als eigenständige, semantisch beschriftete Bereiche ergänzt und bei Bedarf in die Inhaltsnavigation aufgenommen.

## Seitenübergreifender Rahmen

`index.html` ist die Case Study, `wer-bin-ich.html` eine eigenständige persönliche Unterseite. Beide Seiten nutzen dieselben Designvariablen, denselben responsiven Header sowie die sechs unterstützten Sprachen Deutsch, Englisch, Chinesisch, Hindi, Spanisch und Arabisch.

Die Header verlinken die beiden Seiten gegenseitig. Sprache und Theme werden über die bestehenden Local-Storage-Schlüssel `language` und `theme` seitenübergreifend gehalten. Arabisch setzt auf beiden Seiten `dir="rtl"`; alle anderen Sprachversionen verwenden `ltr`. Der Button „Anmelden“ bleibt auf beiden Seiten bewusst ohne Funktion.

## Persoenliche Profilseite

`wer-bin-ich.html` ist eine eigenstaendige, ruhige Magazinseite und kein
vollstaendiger Online-Lebenslauf. Der Inhalt ist semantisch in Einstieg mit
Portrait, drei Ergebniskarten, vier kompakte Entwicklungsschritte, Arbeitsweise,
bewusste Positionierung, Zielrollen, persoenlichen Abschnitt und Abschluss mit
drei Handlungsoptionen gegliedert. Diese Reihenfolge beantwortet, wer Simon ist,
welchen Nutzen er schafft und fuer welche Aufgaben er ansprechbar ist.

Alle sichtbaren Texte, Metadaten, Alternativtexte und relevanten ARIA-Texte der
Profilseite liegen in `assets/js/about-translations.js`. `wer-bin-ich.html`
prueft beim Laden die Schluessel aller sechs Sprachen; zusaetzlich prueft
`node scripts/check-about-me.mjs` die Vollstaendigkeit und die lokalen Assets.
Das Hero-Portrait ist eine lokal ausgelieferte, responsive JPEG-Datei; ihre
Herkunft, Nutzungsrechte und KI-Kennzeichnungsentscheidung stehen vor einem
Merge verbindlich in `assets/images/me/MEDIA_MANIFEST.md`.

## Workflow mit Talking Head

In der deutschen Ansicht wird vor dem Abspielen ein Moduswähler für die
Talking-Head-Animation oder das statische Diagramm gezeigt. Nach der Auswahl
greifen die bestehenden Start-, Pause-, Fortsetzen- und Reset-Zustände. In
nichtdeutschen Sprachversionen ohne Talking Head erscheint dieser Moduswähler
nicht; dort bleibt der bisherige Einstieg in die zeitgesteuerte Animation
erhalten.

Die deutsche Workflow-Animation verwendet genau ein Videoelement. Die Clips
`shot1.mp4` bis `shot11.mp4` werden erst beim Start ihrer jeweiligen Szene als
Quelle gesetzt. Das Ende des Clips steuert den Wechsel zur nächsten Szene;
nichtdeutsche Sprachversionen verwenden weiterhin die zeitgesteuerte Animation
ohne deutschen Talking Head.

Die Wiedergabe mit Ton beginnt ausschließlich nach der bewussten Auswahl der
Animation im deutschen Moduswähler oder nach der Schaltfläche „Animation
starten“. Pause, Fortsetzen, Reset, Sprachwechsel, statischer Modus
und `prefers-reduced-motion` müssen Workflow und Medien als gemeinsamen Zustand
behandeln. Ein nicht abspielbarer Clip darf den übrigen Workflow nicht
blockieren und fällt deshalb auf die zeitgesteuerte Szene zurück.

Die Animation startet in keiner Sprache automatisch beim Scrollen oder beim
Wechsel aus dem statischen Modus. Der eingebrannte AI-Hinweis der Clips wird
durch ein skalierungsunabhängiges, kontrastreiches „KI-generiert“-Overlay
ergänzt, damit die Kennzeichnung auch bei der kleinen responsiven Darstellung
lesbar bleibt.

Sprachumschalter werden ausschließlich mit
`.language-button[data-language]` ausgewählt. Der allgemeinere Selektor
`[data-language]` ist unzulässig, weil auch das Wurzelelement
`<html data-language="…">` diesen Zustand trägt. Ein daran registrierter
bubbelnder Click-Handler behandelt sonst jeden Seitenklick als Sprachwechsel
und setzt eine gerade gestartete Animation sofort wieder zurück.

Die Seite ist für Entwicklung und Abnahme über HTTP zu öffnen, beispielsweise
mit `python -m http.server 8000`. Direkte Aufrufe über `file://` bilden den
GitHub-Pages-Betrieb nicht zuverlässig ab, weil lokale `fetch()`-Zugriffe auf
SVG- und JSON-Dateien browserabhängig eingeschränkt werden. Bei Medienfehlern
ist zuerst im Serverprotokoll zu prüfen, ob beim Start der Szene ein
`GET /assets/talking_head/processed/shotN.mp4` erscheint. Ein fehlender Request
weist auf die Ereignis- oder Zustandslogik vor dem Video hin, nicht auf den
Codec oder die Mediendatei.

## Further Steps

### Ausgangslage

Die Landingpage wird weiterhin passend als statische GitHub-Pages-Seite ohne
Framework und ohne Build-System betrieben. Die aktuelle Implementierung hat
jedoch die Grenze erreicht, an der eine einzige Datei keine sinnvolle
Architekturgrenze mehr darstellt:

- `index.html` umfasst rund 2.060 Zeilen beziehungsweise 108 KB.
- Etwa 1.070 Zeilen enthalten CSS, rund 790 Zeilen JavaScript und nur rund 160
  Zeilen das eigentliche Seiten-Markup.
- UI-Texte, Abschnittsinhalte und SVG-Beschriftungen liegen in drei getrennten
  Übersetzungsstrukturen.
- Workflow-Texte, Laufzeiten, Videoquellen und Highlight-Koordinaten sind über
  Arraypositionen statt über stabile IDs gekoppelt.
- Genie-Daten liegen gleichzeitig in `assets/data/genies.json` und als
  eingebetteter JSON-Fallback in `index.html` vor.
- Navigation, Karussell, Lokalisierung, SVG-Umschreibung, Medienwiedergabe und
  Diagrammsteuerung laufen in einer gemeinsamen `DOMContentLoaded`-Closure.

Die Seite ist dadurch nicht akut fehlerhaft. Neue Änderungen erzeugen aber eine
unnötig große gemeinsame Änderungsfläche. Das steigert das Risiko für
Merge-Konflikte, inkonsistente Übersetzungen und unbeabsichtigte Regressionen
im Workflow-Zustand.

### Priorisierungsmodell

Die Reihenfolge folgt diesen Regeln:

1. Hohe Dringlichkeit kommt vor mittlerer oder niedriger Dringlichkeit.
2. Bei gleicher Dringlichkeit wird der geringere Aufwand zuerst umgesetzt.
3. Schutzmaßnahmen für nachfolgende Umbauten werden vor den großen Umbauten
   umgesetzt.
4. Jede Maßnahme muss als eigene GitHub Story freigegeben werden.

Aufwand:

- **XS:** höchstens ein halber Arbeitstag, lokal begrenzte Änderung.
- **S:** ungefähr ein Arbeitstag, wenige Dateien und geringe Kopplung.
- **M:** ein bis drei Arbeitstage, mehrere Daten- oder Verhaltenspfade.
- **L:** drei bis fünf Arbeitstage, zustandsbehaftetes Kernmodul.

Dringlichkeit:

- **Hoch:** verhindert bereits heute Daten- oder Übersetzungsdrift oder reduziert
  das Risiko der unmittelbar folgenden Architekturarbeiten.
- **Mittel:** verbessert Wartbarkeit deutlich, ist aber nach den vorbereitenden
  Schritten sicherer umzusetzen.
- **Niedrig:** sinnvoller Abschluss oder Optimierung ohne aktuelles Fehlerrisiko.

### Priorisierter Architektur-Backlog

| Reihenfolge | Story-Kandidat | Dringlichkeit | Aufwand | Abhängigkeit |
| ---: | --- | --- | --- | --- |
| 1 | Genie-Daten auf eine Quelle reduzieren | Hoch | XS | Keine |
| 2 | CSS aus `index.html` extrahieren | Hoch | S | Keine |
| 3 | Architektur- und Datenprüfungen automatisieren | Hoch | S | 1 |
| 4 | Übersetzungen in ein einheitliches Schema auslagern | Hoch | M | 3 |
| 5 | Workflow-Szenen ID-basiert modellieren | Hoch | M | 3, möglichst 4 |
| 6 | Navigation und Genie-Karussell modularisieren | Mittel | M | 2, 3 |
| 7 | Workflow-Verhalten als gekapseltes Modul auslagern | Mittel | L | 4, 5, 6 |
| 8 | Architekturvertrag nach der Migration konsolidieren | Niedrig | S | 1–7 |

### 1. Genie-Daten auf eine Quelle reduzieren

**Warum zuerst:** Die Daten existieren aktuell zweimal und können ohne Warnung
auseinanderlaufen. Gleichzeitig ist die Korrektur klein und fachlich isoliert.
Die dokumentierte Abnahme erfolgt ohnehin über HTTP, deshalb ist ein Inline-
Fallback für `file://` keine erforderliche Betriebsfunktion.

**Ziel:** `assets/data/genies.json` ist die einzige Quelle für Namen, Lebensdaten,
Zitate und Bildpfade.

**Scope:**

- Eingebettetes Element `#local-genie-data` aus `index.html` entfernen.
- Fallback-Parsing aus `loadGenies()` entfernen.
- Den vorhandenen sichtbaren Ladefehlerzustand beibehalten oder präzisieren.
- Keine Bilder, Zitate oder Übersetzungen inhaltlich ändern.

**Akzeptanzkriterien für die abzuleitende Story:**

- Es existiert genau eine versionierte Genie-Datenquelle.
- Alle zehn Einträge werden über HTTP unverändert geladen.
- Ein fehlgeschlagener JSON-Request erzeugt einen verständlichen Fehlerzustand
  und keinen JavaScript-Abbruch.
- Karussell, Tastatursteuerung, Swipe und Sprachwechsel funktionieren weiterhin.
- Es werden keine neuen Abhängigkeiten oder Build-Schritte eingeführt.

**Hauptrisiko:** Ein Betrieb über `file://` verliert den bisherigen Datenfallback.
Das ist akzeptabel, weil `file://` bereits ausdrücklich keine unterstützte
Abnahme- oder Produktionsumgebung ist.

### 2. CSS aus `index.html` extrahieren

**Warum früh:** Mehr als die Hälfte von `index.html` besteht aus CSS. Die
Extraktion verkleinert sofort die gemeinsame Änderungsfläche und erleichtert
alle nachfolgenden Reviews, ohne Verhalten oder Datenmodell zu verändern.

**Ziel:** Gestaltung und semantische Seitenstruktur werden getrennt ausgeliefert.

**Scope:**

- Den vollständigen Inhalt des bestehenden `<style>`-Blocks unverändert nach
  `assets/css/site.css` verschieben.
- In `index.html` genau ein lokales Stylesheet verlinken.
- Reihenfolge, Spezifität, Custom Properties und Media Queries nicht verändern.
- Noch keine weitere Aufteilung in Komponenten-Stylesheets vornehmen.

**Akzeptanzkriterien für die abzuleitende Story:**

- `index.html` enthält keinen großen Inline-Styleblock mehr.
- Dark- und Gold-Theme sehen auf Desktop und Mobil unverändert aus.
- Responsive Navigation, Workflow, Talking Head und Karussell behalten ihre
  bestehende Darstellung.
- GitHub Pages liefert `assets/css/site.css` mit Status 200 aus.
- Es werden keine externen Stylesheets oder neuen Abhängigkeiten eingeführt.

**Hauptrisiko:** Eine geänderte Reihenfolge oder ein falscher Pfad kann die
gesamte Darstellung beeinflussen. Deshalb soll dieser Schritt rein mechanisch
bleiben.

### 3. Architektur- und Datenprüfungen automatisieren

**Warum vor größeren Umbauten:** Die bestehenden manuellen Tests schützen vor
sichtbaren Regressionen, prüfen aber die fragilen Datenbeziehungen nicht
automatisch. Vor der Migration von Übersetzungen und Workflow-Daten wird eine
kleine, abhängigkeitsfreie Sicherheitsleine benötigt.

**Ziel:** Ein lokales Prüfskript erkennt strukturelle Fehler, bevor ein Browser-
Test oder Merge Gate beginnt.

**Scope:**

- Ein abhängigkeitsfreies Node-Skript unter `scripts/check-site.mjs` ergänzen.
- Vorhandene Inline-Skripte beziehungsweise spätere Module syntaktisch prüfen.
- Doppelte HTML-IDs erkennen.
- Vollständigkeit aller sechs Sprachen gegen ein Referenzschema prüfen.
- Gleiche Anzahl und eindeutige IDs für Workflow-Szenen, Diagrammtexte,
  Laufzeiten, Highlights und Medienzuordnung prüfen.
- Existenz referenzierter lokaler Dateien prüfen.
- Ausführung und erwartete Ausgabe in `TESTING.md` dokumentieren.

**Akzeptanzkriterien für die abzuleitende Story:**

- `node scripts/check-site.mjs` endet bei gültigem Stand mit Exitcode 0.
- Fehlende Übersetzungsschlüssel, doppelte IDs und ungültige Asset-Pfade führen
  mit konkreter Fundstelle zu Exitcode ungleich 0.
- Das Skript benötigt kein `npm install` und keinen Netzwerkzugriff.
- Die vorhandene manuelle HTTP-Abnahme bleibt zusätzlich bestehen.

**Hauptrisiko:** Zu enge Prüfungen können legitime Änderungen unnötig blockieren.
Geprüft werden nur ausdrücklich dokumentierte Invarianten.

### 4. Übersetzungen in ein einheitliches Schema auslagern

**Warum dringend:** Übersetzungen sind aktuell auf `translations`,
`localizedContent` und `workflowDiagramLabels` verteilt. Neue Inhalte können
dadurch in einer Sprache vollständig und in einer anderen nur teilweise
ankommen.

**Ziel:** Jede Sprache besitzt dasselbe, validierbare Inhaltsmodell und eine
eindeutige Quelle.

**Vorgesehene Struktur:**

```text
assets/i18n/
  de.json
  en.json
  zh.json
  hi.json
  es.json
  ar.json
```

Jede Datei enthält dieselben Bereiche, beispielsweise:

```text
meta
ui
sections
iceberg.terms
workflow.scenes.<scene-id>
workflow.diagram.<element-id>
genies.quotes.<genie-id>
```

**Scope:**

- Alle sprachabhängigen Texte aus JavaScript-Datenobjekten auslagern.
- Ein gemeinsames Schema mit stabilen, sprechenden IDs verwenden.
- Deutsch als Fallbacksprache beibehalten.
- Fehler beim Laden einer Sprache kontrolliert auf Deutsch zurückfallen lassen.
- Sprachrichtung, Dokumenttitel, Metabeschreibung und ARIA-Texte weiterhin
  gemeinsam umschalten.
- HTML-Markup in Übersetzungswerten vermeiden. Erforderliche Hervorhebungen
  werden über Struktur oder explizit begrenzte Textsegmente modelliert.

**Akzeptanzkriterien für die abzuleitende Story:**

- Alle sechs Sprachdateien erfüllen dasselbe automatisch geprüfte Schema.
- Es verbleiben keine parallelen Übersetzungsobjekte in `index.html`.
- Jeder sichtbare Text, Metatext und relevante ARIA-Text wechselt vollständig.
- Arabisch setzt weiterhin `dir="rtl"`; alle anderen Sprachen setzen `ltr`.
- Ein fehlender Schlüssel oder eine nicht ladbare Sprachdatei verursacht einen
  nachvollziehbaren deutschen Fallback und keinen Teilzustand.
- Die Seite bleibt als statische GitHub-Pages-Seite ohne Build-System lauffähig.

**Hauptrisiken:** Zusätzliche Requests können einen kurzen Ladezustand erzeugen;
HTML-Fallback und geladene deutsche Inhalte können auseinanderlaufen. Das
Prüfskript muss deshalb auch den deutschen Fallback abdecken.

### 5. Workflow-Szenen ID-basiert modellieren

**Warum dringend:** Szenentitel, Beschreibungen, Dauer, Videoquelle,
Highlight-Koordinaten und SVG-Texte werden derzeit über Arraypositionen
zusammengeführt. Eine Einfügung an nur einer Stelle kann die folgenden Szenen
falsch koppeln.

**Ziel:** Jede Szene und jedes übersetzbare Diagrammelement wird über eine
stabile ID statt über seine Position identifiziert.

**Vorgesehene Datenstruktur:**

```text
assets/data/workflow.json
  scenes[]
    id
    durationSeconds
    highlight { x, y, width, height }
    video
  diagramElements[]
    id
```

Die lokalisierten Titel, Beschreibungen und Diagrammtexte liegen unter denselben
IDs in den Sprachdateien.

**Scope:**

- Die elf Szenen mit stabilen fachlichen IDs versehen.
- Laufzeit, Highlight und optionale Videoquelle in einem Szenenobjekt bündeln.
- Übersetzungen über `scene.id` zuordnen.
- Übersetzbare SVG-Elemente mit stabilen `data-i18n-id`-Attributen versehen.
- Positionsbasierte Zuordnung zu allen `<text>`-Knoten entfernen.
- Bestehende Fallbacks für fehlende Medien und fehlende SVG-Übersetzungen
  erhalten.

**Akzeptanzkriterien für die abzuleitende Story:**

- Jede der elf Szenen besitzt genau eine eindeutige ID.
- Datenprüfung erkennt fehlende Laufzeiten, Highlights, Texte oder Medienpfade.
- Das Einfügen einer neuen SVG-Textnode verschiebt keine Übersetzungen.
- Deutsch nutzt weiterhin die elf Talking-Head-Clips; andere Sprachen bleiben
  zeitgesteuert.
- Start, Pause, Fortsetzen, Reset, Szenenende und statischer Modus verhalten sich
  unverändert.

**Hauptrisiko:** Ein einmaliger Zuordnungsfehler kann Szene, Highlight und Video
falsch kombinieren. Die bestehende Reihenfolge muss vor der Umstellung als
Referenztabelle festgehalten und automatisiert geprüft werden.

### 6. Navigation und Genie-Karussell modularisieren

**Warum vor dem Workflow-Modul:** Diese beiden Bereiche besitzen wenig geteilten
Zustand und eignen sich als risikoärmerer Einstieg in native ES-Module. Dabei
wird das Initialisierungs- und Exportmuster für den späteren Workflow festgelegt.

**Ziel:** Fachlich unabhängiges Verhalten wird unabhängig initialisiert und
getestet.

**Vorgesehene Struktur:**

```text
assets/js/
  app.js
  navigation.js
  genies.js
```

**Scope:**

- `app.js` wird alleiniger Moduleinstiegspunkt.
- `navigation.js` besitzt ausschließlich Inhaltsnavigation, Breakpoint-Zustand
  und aktiven Abschnitt.
- `genies.js` besitzt Laden, Rendern, Status, Tastatur- und Swipe-Bedienung des
  Karussells.
- Abhängigkeiten wie Übersetzungszugriff werden explizit als Funktionen oder
  Daten übergeben, nicht aus globalem Zustand gelesen.
- Bestehende IDs und `data-*`-Attribute bleiben stabil.

**Akzeptanzkriterien für die abzuleitende Story:**

- Navigation und Karussell können unabhängig initialisiert werden.
- Ein fehlendes optionales DOM-Element beendet nicht die Initialisierung der
  übrigen Seite.
- Es entstehen keine neuen globalen Variablen.
- Tastatur, Touch, Breakpoints, Sprachwechsel und Fehlerzustände bleiben
  unverändert.
- Native Browsermodule werden direkt von GitHub Pages ausgeliefert; kein Bundle
  wird erzeugt.

**Hauptrisiko:** Versteckte Reihenfolgeabhängigkeiten in der bisherigen Closure
können beim ersten Schnitt sichtbar werden. `app.js` muss die Reihenfolge
explizit festlegen.

### 7. Workflow-Verhalten als gekapseltes Modul auslagern

**Warum später:** Der Workflow ist der größte und zustandsreichste Bereich. Er
soll erst umgestellt werden, wenn Datenmodell, Übersetzungen, Prüfungen und das
Modulmuster stabil sind.

**Ziel:** Der Workflow besitzt eine klar definierte öffentliche Schnittstelle
und hält seinen Zustand intern.

**Vorgesehene Schnittstelle:**

```text
createWorkflow({ root, scenes, translations, reducedMotion })
  start()
  pause()
  reset()
  setLanguage(language)
  showStatic()
  destroy()
```

Die konkrete Benennung darf sich bei der Story-Schärfung ändern; entscheidend
ist eine kleine öffentliche API statt direkter Zugriffe auf internen Zustand.

**Scope:**

- Playback-, Medien-, Diagramm- und Viewport-Zustand intern kapseln.
- Timer und Event-Listener beim Reset beziehungsweise `destroy()` vollständig
  aufräumen.
- SVG-Lokalisierung, Video-Fallback und Szenenwechsel über das ID-basierte
  Datenmodell betreiben.
- Sprachwechsel und `prefers-reduced-motion` über öffentliche Methoden
  behandeln.
- `app.js` darf keine internen Workflow-Variablen kennen.

**Akzeptanzkriterien für die abzuleitende Story:**

- Es existiert genau eine Workflow-Instanz und genau ein Videoelement.
- Start, Pause, Fortsetzen, Reset, Sprachwechsel und Moduswechsel sind
  deterministisch und über die dokumentierten manuellen Fälle geprüft.
- Timer, Objekt-URLs und Event-Listener werden bei Reset oder Zerstörung
  freigegeben.
- Ein Medien- oder SVG-Fehler blockiert den übrigen Workflow nicht.
- Keine andere Fachkomponente greift auf internen Workflow-Zustand zu.

**Hauptrisiko:** Die bestehende Zustandsmaschine ist implizit. Ein Big-Bang-
Rewrite könnte schwer erkennbare Übergänge verlieren. Deshalb wird vorhandenes
Verhalten zunächst ohne funktionale Erweiterung portiert.

### 8. Architekturvertrag nach der Migration konsolidieren

**Warum zuletzt:** Erst nach den tatsächlichen Schnitten können Dateigrenzen und
Schnittstellen verbindlich dokumentiert werden. Jede vorherige Story aktualisiert
bereits ihre unmittelbar betroffenen Regeln; dieser Schritt bereinigt das
Gesamtbild.

**Ziel:** `ARCHITECTURE.md` beschreibt nicht nur sichtbares Verhalten, sondern
auch Quellen der Wahrheit, Modulgrenzen und Abhängigkeitsrichtung.

**Scope und Akzeptanzkriterien für die abzuleitende Story:**

- Die endgültige Verzeichnisstruktur wird dokumentiert.
- Für Inhalte, Übersetzungen, Genie-Daten, Workflow-Daten und Medien ist jeweils
  genau eine Quelle der Wahrheit benannt.
- Öffentliche Modulschnittstellen und erlaubte Abhängigkeiten sind beschrieben.
- Die Entscheidung für native ES-Module ohne Build-System ist als bewusste
  Architekturentscheidung mit Auslösern für eine spätere Neubewertung erfasst.
- `TESTING.md` verweist auf automatisierte Strukturprüfungen und die verbleibende
  manuelle Browserabnahme.
- Überholte Übergangsregeln werden entfernt.

### Zielstruktur

Die angestrebte Struktur nach Abschluss der Folgestories lautet:

```text
index.html
assets/
  css/
    site.css
  js/
    app.js
    i18n.js
    navigation.js
    genies.js
    workflow.js
  data/
    genies.json
    workflow.json
  i18n/
    de.json
    en.json
    zh.json
    hi.json
    es.json
    ar.json
  workflow/
    workflow-diagram.svg
    workflow-diagram.excalidraw
  talking_head/
    ...
scripts/
  check-site.mjs
```

Verantwortlichkeiten und Abhängigkeitsrichtung:

```text
index.html
  └─ app.js
      ├─ i18n.js ────────────> assets/i18n/*.json
      ├─ navigation.js
      ├─ genies.js ──────────> assets/data/genies.json
      └─ workflow.js ────────> assets/data/workflow.json
                               assets/workflow/*.svg
                               assets/talking_head/*
```

- `index.html` enthält semantische Struktur, stabilen deutschen Fallback-Inhalt
  und Bindungspunkte, aber keine großen Daten- oder Verhaltensblöcke.
- `site.css` enthält die Gestaltung. Eine weitere CSS-Aufteilung erfolgt nur,
  wenn spätere Änderungen echte, unabhängige Grenzen zeigen.
- `app.js` verdrahtet Module, enthält aber keine fachliche Detaillogik.
- Fachmodule kennen einander nicht direkt. Gemeinsame Dienste und Daten werden
  explizit übergeben.
- JSON-Dateien enthalten Daten und Inhalte, aber keinen DOM- oder
  Darstellungs-Code.

### Entscheidung gegen ein Build-System

Die Migration verwendet weiterhin keinen Bundler, kein Framework und keinen
Paketmanager als Laufzeitvoraussetzung:

- GitHub Pages liefert HTML, CSS, JSON und native ES-Module direkt aus.
- Das Projekt hat keine Drittanbieter-Abhängigkeiten und verwendet kein
  TypeScript.
- Ein Build-System würde Update-, Sicherheits- und Deploymentaufwand erzeugen,
  ohne aktuell einen entsprechenden Produktnutzen zu liefern.
- Die notwendige HTTP-Abnahme ist bereits dokumentiert und wird durch ES-Module
  oder JSON-Dateien nicht neu eingeführt.

Diese Entscheidung wird neu bewertet, sobald mindestens eines der folgenden
Bedürfnisse als freigegebene Story vorliegt:

- TypeScript oder externe Paketabhängigkeiten,
- automatisch erzeugte sprachspezifische HTML-Seiten,
- Template-Kompilierung,
- Asset-Fingerprinting oder weitere Buildzeit-Optimierungen,
- eine gemessene, relevante Verschlechterung durch die Anzahl einzelner
  Requests.

### Gemeinsame Definition of Done für alle Architektur-Stories

- Die jeweilige Story verändert ausschließlich den freigegebenen
  Architekturbaustein und führt keine gestalterische Neuentwicklung ein.
- Die Seite wird über einen lokalen HTTP-Server geprüft, nicht über `file://`.
- Deutsch, Englisch, Chinesisch, Hindi, Spanisch und Arabisch bleiben vollständig
  nutzbar; Arabisch behält die RTL-Darstellung.
- Desktop- und Mobilansicht sowie Tastaturbedienung bleiben funktionsfähig.
- Die dokumentierten Workflow-Fälle in `TESTING.md` bleiben bestanden.
- `node scripts/check-site.mjs` und `git diff --check` laufen erfolgreich,
  sobald das Prüfskript aus Story 3 vorhanden ist.
- Es werden keine Abhängigkeiten oder Build-Schritte ohne eigene freigegebene
  Architekturentscheidung eingeführt.
- Notwendige Dokumentation wird beim Abschluss der jeweiligen Story aktualisiert.
- Vor einem Merge nach `main` wird das risikobasierte Merge Gate ausgeführt und
  die menschliche Merge-Freigabe eingeholt.

### Nicht empfohlen

- Kein Big-Bang-Refactoring aller Bereiche in einem Pull Request.
- Keine gleichzeitige funktionale Erweiterung während einer reinen Extraktion.
- Keine Aufteilung in viele CSS- oder JavaScript-Dateien ohne fachliche Grenze.
- Kein Framework oder Build-System allein zur Reduktion der Zeilenzahl.
- Keine weitere positionsbasierte Kopplung von Übersetzungen, Szenen, Medien oder
  SVG-Elementen.
