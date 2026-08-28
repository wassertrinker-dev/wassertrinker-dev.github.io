---
name: merge-gate
description: Prüft einen Pull Request risikobasiert als Fast Gate oder Full Gate und fasst die Ergebnisse als GO- oder NO-GO-Entscheidung zusammen.
---

# Merge Gate

Nur bei ausdrücklichem Aufruf mit `$merge-gate` verwenden. Mit `$merge-gate full` oder einer gleichwertigen ausdrücklichen Anweisung ist immer das Full Gate zu verwenden.

Prüfe den angegebenen Pull Request oder den Pull Request des aktuellen Branches. Das Gate verändert keine Dateien, führt keinen Merge durch und veröffentlicht ohne menschliche Bestätigung keinen PR-Kommentar.

## Gate-Auswahl

Stufe den Pull Request vor jeder weiteren Prüfung ein. Verwende das **Fast Gate** nur, wenn alle folgenden Aussagen anhand des Diffs eindeutig zutreffen:

- Es werden keine Abhängigkeiten, Lockfiles, Build-, Deployment- oder Workflow-Konfigurationen geändert.
- Es werden keine Formulare, nicht vertrauenswürdigen Eingaben, Cookies, Local Storage, Session Storage oder vergleichbare Persistenz eingeführt oder geändert.
- Es werden keine Netzwerkzugriffe, externen Skripte oder `iframe`-Einbindungen eingeführt oder geändert.
- Es werden keine Authentifizierung, Geheimnisse, personenbezogenen Daten oder realen Nutzerdaten eingeführt oder geändert.
- Es werden keine grundlegenden Änderungen an der in `ARCHITECTURE.md` beschriebenen Seitenstruktur vorgenommen.

Ist mindestens eine Aussage nicht erfüllt, nicht prüfbar oder zweifelhaft, verwende das **Full Gate**. Das gilt auch, wenn der Benutzer es ausdrücklich verlangt.

## Gemeinsames Ergebnisformat

Jede Prüfung liefert ihre Ergebnisse in diesen drei Kategorien:

- **Blocker:** Ein konkreter Mangel, durch den der Pull Request nicht zusammengeführt werden darf. Nenne Fundstelle, Auswirkung und erforderliche Korrektur.
- **Verbesserung:** Ein nicht blockierender, konkret umsetzbarer Vorschlag. Nenne Fundstelle, Nutzen und empfohlene Änderung.
- **Positiv:** Eine relevante Stärke oder eine nachvollziehbar erfüllte Anforderung. Nenne die geprüfte Fundstelle oder Begründung.

Verwende für Fundstellen nach Möglichkeit `Dateipfad:Zeile`. Bei übergreifenden oder fehlenden Artefakten genügt eine konkrete, reproduzierbare Begründung. Schreibe ausdrücklich „Keine“, wenn eine Kategorie leer ist. Vermutungen ohne Beleg sind keine Befunde.

## Fast Gate

Setze genau **eine** unabhängige, ausschließlich lesende Prüfinstanz ein. Sie prüft alle folgenden Punkte und begründet kurz, welche Punkte nicht betroffen sind:

1. Story, Pull Request und tatsächlicher Diff stimmen im Umfang überein.
2. Die geänderten HTML-, CSS- und JavaScript-Stellen enthalten keine offensichtlichen Fehler.
3. Sichtbare Änderungen funktionieren in einer mobilen und einer Desktop-Viewportgröße.
4. Links, grundlegende Bedienbarkeit und Barrierefreiheit sind nicht beeinträchtigt.
5. Es wurden keine Secrets, unsicheren externen Einbindungen oder dynamischen HTML-Injektionen eingeführt.
6. Für geänderte Medien gelten die Regeln aus „Medien-Performance und Medien-Compliance“.

Das Fast Gate liefert danach im gemeinsamen Ergebnisformat eine eindeutige Entscheidung `GO` oder `NO-GO`.

## Full Gate

Setze je einen unabhängigen, ausschließlich lesenden Subagenten für UX, Architektur, Codequalität, Security sowie Tests und Dokumentation ein. Jeder Subagent prüft ausschließlich seinen Bereich und verwendet das gemeinsame Ergebnisformat.

## Medien-Performance und Medien-Compliance

Diese Regeln gelten für jedes neue oder geänderte Bild-, Audio- oder Video-Asset. Dokumentiere mindestens Dateipfad, Dateigröße, Format, intrinsische Abmessungen (bei Rasterbildern), Einsatzzeitpunkt und die verwendete Ladeart. Bei Bildern ist außerdem die maximal gerenderte CSS-Abmessung zu belegen.

**Performance-Budgets für Rasterbilder:**

- Ein beim ersten sichtbaren Seitenbereich geladenes Rasterbild über **500 KiB** ist ein Blocker.
- Die Summe aller initial sichtbaren Medien über **1 MiB** ist ein Blocker.
- Ein nachgelagert oder lazy geladenes Rasterbild über **750 KiB** ist ein Blocker.
- Rasterbilder dürfen je Achse höchstens die doppelte maximal gerenderte CSS-Abmessung besitzen. Eine höhere Auflösung ist ein Blocker.
- PNG ist nur zulässig, wenn Transparenz oder verlustfreie Darstellung erforderlich ist und das jeweilige Budget eingehalten wird. Andernfalls ist ein modernes Format wie WebP oder AVIF zu erwarten.

Eine Überschreitung ist nur dann kein Blocker, wenn eine konkrete, überprüfbare Ausnahme mit Fundstelle im Pull Request, in der Story oder im Repository dokumentiert ist. Lazy Loading verschiebt den Download, hebt aber weder die Einzelbudgets noch die Abmessungsprüfung auf.

### Herkunft und KI-Status

Fordere für jedes neue oder geänderte Medien-Asset Herkunft, Lizenz oder Nutzungsrecht sowie die Angabe an, ob es KI-generiert oder KI-manipuliert wurde. Der Nachweis muss vor GO entweder als Tabelle in der PR-Beschreibung oder als verlinktes, versioniertes Medienmanifest vorliegen. Er enthält je Asset mindestens Pfad, Quelle, Lizenz oder Nutzungsrecht, KI-Status und Kennzeichnungsentscheidung. Dieser Nachweis ist ein verpflichtendes Gate-Artefakt, keine optionale allgemeine Projekt- oder Release-Dokumentation.

Ungeklärte Herkunft, fehlende Lizenz oder Nutzungsberechtigung sowie unbekannte KI-Erzeugung oder -Manipulation sind Blocker. Der dokumentierte KI-Status führt allein jedoch nicht automatisch zu einer sichtbaren Kennzeichnung auf der Website.

### Entscheidungsbaum für KI-Bild, -Audio und -Video

Prüfe bei KI-generierten oder wesentlich KI-manipulierten Bild-, Audio- und Videoinhalten nacheinander:

1. **KI-Ursprung:** Wurde der Inhalt durch ein KI-System erzeugt oder wesentlich manipuliert?
2. **Ähnlichkeit:** Ähnelt der Inhalt deutlich einer existierenden oder plausibel existierenden Person, einem Objekt, Ort, Unternehmen, einer Organisation oder einem Ereignis?
3. **Täuschungspotenzial:** Könnte der Inhalt unter Berücksichtigung von Aussage, Darstellungsstil, Einsatzkontext und erwartetem Publikum fälschlich als authentisch oder wahr verstanden werden?

Nur wenn alle drei Fragen mit `Ja` beantwortet werden, behandle den Inhalt im Gate als kennzeichnungspflichtigen Deepfake. Dokumentiere für jeden KI-Inhalt kurz die Antworten und die daraus folgende Kennzeichnungsentscheidung.

Bei einem Deepfake ist spätestens bei der ersten Wahrnehmung eine klare, verständliche und ohne technische Hilfsmittel wahrnehmbare Offenlegung erforderlich. Versteckte Metadaten oder eine ausschließlich maschinenlesbare Kennzeichnung genügen nicht. Bei offensichtlich künstlerischen, kreativen, satirischen oder fiktionalen Werken darf die Offenlegung so umgesetzt werden, dass die Darstellung und Nutzung des Werks nicht unangemessen beeinträchtigt werden.

Offensichtlich abstrakte, fantastische, stilisierte oder rein dekorative Inhalte sind nicht allein wegen ihrer KI-Erzeugung als Deepfake zu behandeln. Fehlt bei einem als Deepfake eingestuften Inhalt die erforderliche Offenlegung, ist das ein Blocker.

### Alternativtexte

Alternativtexte beschreiben vorrangig Inhalt und Funktion des Mediums im Seitenkontext. Der KI-Ursprung wird im Alternativtext nur genannt, wenn er für das Verständnis des konkreten Bildes oder seines Kontexts relevant ist. Ein KI-Hinweis im Alternativtext ersetzt keine erforderliche sichtbare Kennzeichnung.

### KI-generierte Texte

Prüfe bei KI-generierten oder wesentlich KI-manipulierten Texten, ob sie zur Information der Öffentlichkeit über Angelegenheiten von öffentlichem Interesse veröffentlicht werden. Gewöhnlicher Marketing- oder Beschreibungstext ist nicht allein wegen KI-Unterstützung zu kennzeichnen.

Bei Texten über Angelegenheiten von öffentlichem Interesse dokumentiere, ob eine substanzielle menschliche Prüfung oder redaktionelle Kontrolle und Verantwortung stattgefunden hat. Eine ausschließlich formale Rechtschreib- oder Grammatikprüfung gilt nicht als substanzielle menschliche Prüfung.

## Prüferrollen im Full Gate

### UX

**Prüfauftrag:** Bewerte alle nutzerseitig sichtbaren oder bedienbaren Änderungen aus Sicht der betroffenen Zielgruppe.

**Prüfkriterien:**

- Nutzerfluss, Verständlichkeit von Texten und erwartbares Verhalten
- responsives Verhalten und visuelle Konsistenz mit der bestehenden Oberfläche
- Barrierefreiheit, insbesondere Semantik, Tastaturbedienung, Fokus, Kontraste und Alternativtexte
- erkennbare Lade-, Leer-, Fehler- und Erfolgszustände
- Auswirkungen neuer Medien auf mobile Nutzung, initiale Ladezeit und wahrnehmbare Ladezustände
- sichtbare, verständliche und angemessene KI-Kennzeichnung, wenn sie nach dem Entscheidungsbaum erforderlich ist
- Alternativtexte, die Inhalt und Funktion beschreiben und den KI-Ursprung nur nennen, wenn er für das Verständnis relevant ist

**Erwartete Befunde:** Konkrete Bedienhürden oder unklare Zustände als Blocker oder Verbesserung sowie gut gelöste Interaktionen als positive Feststellungen. Eine fehlende erforderliche KI-Kennzeichnung oder ein erkennbar unzumutbares initiales Medien-Ladeverhalten ist ein Blocker. Nicht sichtbare Änderungen werden mit einer kurzen Begründung als nicht betroffen eingeordnet.

### Architektur

**Prüfauftrag:** Bewerte, ob die Änderung fachlich passend geschnitten ist und sich ohne unnötige Kopplung in die bestehende Struktur einfügt.

**Prüfkriterien:**

- klare Verantwortlichkeiten, Modulgrenzen und Abhängigkeitsrichtung
- Konsistenz mit bestehenden Architekturmustern und Schnittstellen
- Auswirkungen auf Wartbarkeit, Erweiterbarkeit, Laufzeit und Betrieb
- Angemessenheit der Lösung ohne unnötige Komplexität oder Duplikation

**Erwartete Befunde:** Architekturverletzungen und riskante Abhängigkeiten als Blocker, begründete Vereinfachungen als Verbesserungen und passend weiterverwendete Strukturen als positive Feststellungen.

### Codequalität

**Prüfauftrag:** Prüfe die geänderten Implementierungsdetails auf Korrektheit, Lesbarkeit und nachhaltige Wartbarkeit.

**Prüfkriterien:**

- logische Fehler, unbehandelte Randfälle und robuste Fehlerbehandlung
- verständliche Benennung, Struktur und Komplexität
- unnötige Wiederholungen, toter Code und Einhaltung der Projektkonventionen
- gezielter Umfang ohne unbeabsichtigte oder sachfremde Änderungen
- bei Medien: Dateigröße, intrinsische und maximal gerenderte Abmessungen, Format, Einsatzzeitpunkt und Ladeverhalten gegen die verbindlichen Medien-Budgets

**Erwartete Befunde:** Reproduzierbare Fehler oder gravierende Wartungsrisiken als Blocker, lokale Qualitätsverbesserungen als Vorschläge und besonders klare, robuste Lösungen als positive Feststellungen. Jeder nicht dokumentiert ausgenommene Verstoß gegen ein Medien-Budget ist ein Blocker, nicht bloß ein Verbesserungsvorschlag.

### Security

**Prüfauftrag:** Ermittle, ob die Änderung neue Sicherheits- oder Datenschutzrisiken einführt oder bestehende Schutzmechanismen schwächt.

**Prüfkriterien:**

- Validierung und sichere Verarbeitung nicht vertrauenswürdiger Eingaben und Ausgaben
- Authentifizierung, Autorisierung und Schutz sensibler Funktionen oder Daten
- Geheimnisse, personenbezogene Daten, Logging und Datenminimierung
- neue Abhängigkeiten, unsichere Konfigurationen und typische Web-Schwachstellen
- bei Medien: vertrauenswürdige Quellen, keine unerwarteten externen Abrufe und sichere Einbindung der Asset-Pfade

**Erwartete Befunde:** Ausnutzbare Schwachstellen, offengelegte Geheimnisse oder unzulässige Zugriffe als Blocker, Härtungsmaßnahmen als Verbesserungen und wirksame Schutzmechanismen als positive Feststellungen. Nenne ein realistisches Angriffsszenario oder begründe, warum keines erkennbar ist.

### Tests und Dokumentation

**Prüfauftrag:** Prüfe, ob das geänderte Verhalten angemessen verifiziert ist und notwendige nutzer- oder wartungsrelevante Dokumentation stimmt.

**Prüfkriterien:**

- automatisierte Tests für neue Pfade, Randfälle und Fehlerzustände
- Aussagekraft, Stabilität und tatsächliches Ergebnis der relevanten Prüfungen
- erforderliche manuelle Prüfschritte, wenn Automatisierung nicht sinnvoll ist
- Aktualität von README, Betriebs-, Nutzungs- und Schnittstellendokumentation
- bei Medien: Herkunft, Lizenz oder Nutzungsrecht und Angabe zur KI-Erzeugung oder -Manipulation je Asset als Tabelle in der PR-Beschreibung oder als verlinktes, versioniertes Medienmanifest
- bei KI-Medien: dokumentierte Anwendung des Entscheidungsbaums und Nachweis einer sichtbaren Offenlegung, falls sie erforderlich ist

**Erwartete Befunde:** Fehlende Absicherung kritischen Verhaltens oder falsche notwendige Dokumentation als Blocker, zusätzliche sinnvolle Testfälle als Verbesserungen und aussagekräftige Tests beziehungsweise aktuelle Dokumentation als positive Feststellungen. Ungeklärte Medienherkunft, fehlende Lizenz oder Nutzungsberechtigung, unbekannte KI-Erzeugung beziehungsweise -Manipulation oder eine erforderliche fehlende Kennzeichnung sind Blocker. Dokumentation wird nur gefordert, wenn die Story abgeschlossen wird oder ein Release vorliegt; andernfalls ist ausdrücklich festzuhalten, ob sie derzeit nicht erforderlich ist.

## Beispielszenarien für die Einstufung

| Änderung | Gate | KI-Entscheidung |
| --- | --- | --- |
| Textkorrektur oder isolierte CSS-Änderung ohne Ausschlussmerkmal | Fast Gate | Nicht betroffen |
| Neue externe JavaScript-Datei oder `iframe` | Full Gate | Nicht betroffen, sofern kein KI-Medium geändert wird |
| Neue fotorealistische, angeblich echte Aufnahme einer Person oder eines Ereignisses | Fast Gate, sofern keine anderen Ausschlussmerkmale vorliegen | Alle drei Fragen prüfen; bei drei Mal `Ja` sichtbare Kennzeichnung erforderlich |
| Neue stilisierte, fiktive oder dekorative KI-Illustration | Fast Gate, sofern keine anderen Ausschlussmerkmale vorliegen | KI-Status dokumentieren; keine sichtbare Kennzeichnung allein wegen KI-Ursprung |
| KI-generierter Text zu einem Thema von öffentlichem Interesse ohne substanzielle menschliche Prüfung | Fast Gate, sofern keine anderen Ausschlussmerkmale vorliegen | Klare Kennzeichnung erforderlich |
| Neue Formularverarbeitung oder Speicherung von Nutzerdaten | Full Gate | Je nach geänderten Medien oder Texten zusätzlich prüfen |

## Gesamtentscheidung

Warte im Full Gate auf alle fünf Ergebnisse. Fasse im Fast Gate die eine Prüfung und im Full Gate alle Bereichsergebnisse kurz als `GO` oder `NO-GO` zusammen. Ein belegter Blocker führt zu `NO-GO`. Nicht dokumentiert ausgenommene Verstöße gegen Medien-Budgets, ungeklärte Medienherkunft oder eine erforderliche fehlende KI-Kennzeichnung sind immer Blocker. Ohne Blocker lautet die Entscheidung `GO`; Verbesserungen werden separat aufgeführt und verhindern das `GO` nicht.

Zeige das Ergebnis zuerst dem Benutzer. Veröffentliche die Zusammenfassung erst nach dessen Bestätigung als Kommentar im Pull Request.
