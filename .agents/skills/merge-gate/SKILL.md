---
name: merge-gate
description: Prüft einen Pull Request unabhängig und fasst die Ergebnisse als GO- oder NO-GO-Entscheidung zusammen.
---

# Merge Gate

Nur bei ausdrücklichem Aufruf mit `$merge-gate` verwenden.

Prüfe den angegebenen Pull Request oder den Pull Request des aktuellen Branches. Setze je einen unabhängigen Subagenten für UX, Architektur, Codequalität, Security sowie Tests und Dokumentation ein. Jeder Subagent prüft ausschließlich seinen Bereich und verändert keine Dateien.

## Gemeinsames Ergebnisformat

Jede Rolle liefert ihre Ergebnisse in diesen drei Kategorien:

- **Blocker:** Ein konkreter Mangel, durch den der Pull Request nicht zusammengeführt werden darf. Nenne Fundstelle, Auswirkung und erforderliche Korrektur.
- **Verbesserung:** Ein nicht blockierender, konkret umsetzbarer Vorschlag. Nenne Fundstelle, Nutzen und empfohlene Änderung.
- **Positiv:** Eine relevante Stärke oder eine nachvollziehbar erfüllte Anforderung. Nenne die geprüfte Fundstelle oder Begründung.

Verwende für Fundstellen nach Möglichkeit `Dateipfad:Zeile`. Bei übergreifenden oder fehlenden Artefakten genügt eine konkrete, reproduzierbare Begründung. Schreibe ausdrücklich „Keine“, wenn eine Kategorie leer ist. Vermutungen ohne Beleg sind keine Befunde.

## Medien-Performance und Medien-Compliance

Diese Regeln gelten für jedes neue oder geänderte Bild-, Audio- oder Video-Asset. Dokumentiere mindestens Dateipfad, Dateigröße, Format, intrinsische Abmessungen (bei Rasterbildern), Einsatzzeitpunkt und die verwendete Ladeart. Bei Bildern ist außerdem die maximal gerenderte CSS-Abmessung zu belegen.

**Performance-Budgets für Rasterbilder:**

- Ein beim ersten sichtbaren Seitenbereich geladenes Rasterbild über **500 KiB** ist ein Blocker.
- Die Summe aller initial sichtbaren Medien über **1 MiB** ist ein Blocker.
- Ein nachgelagert oder lazy geladenes Rasterbild über **750 KiB** ist ein Blocker.
- Rasterbilder dürfen je Achse höchstens die doppelte maximal gerenderte CSS-Abmessung besitzen. Eine höhere Auflösung ist ein Blocker.
- PNG ist nur zulässig, wenn Transparenz oder verlustfreie Darstellung erforderlich ist und das jeweilige Budget eingehalten wird. Andernfalls ist ein modernes Format wie WebP oder AVIF zu erwarten.

Eine Überschreitung ist nur dann kein Blocker, wenn eine konkrete, überprüfbare Ausnahme mit Fundstelle im Pull Request, in der Story oder im Repository dokumentiert ist. Lazy Loading verschiebt den Download, hebt aber weder die Einzelbudgets noch die Abmessungsprüfung auf.

**Herkunft und KI-Transparenz:**

- Fordere für jedes neue oder geänderte Medien-Asset Herkunft, Lizenz oder Nutzungsrecht sowie die Angabe an, ob es KI-generiert oder KI-manipuliert wurde.
- Bei KI-generierten oder KI-manipulierten Bildern bewerte kontextabhängig, ob eine sichtbare Kennzeichnung nach Artikel 50 AI Act erforderlich ist. Berücksichtige insbesondere realistisch wirkende Darstellungen existierender Personen, mögliche Deepfakes sowie künstlerische, satirische oder fiktive Kontexte.
- Ist eine Kennzeichnung erforderlich, muss sie bei der ersten Wahrnehmung sichtbar, verständlich und angemessen sein. Eine nur technische oder versteckte Kennzeichnung genügt nicht.
- Ungeklärte Herkunft, fehlende Lizenz oder Nutzungsberechtigung, unbekannte KI-Erzeugung beziehungsweise -Manipulation oder eine erforderliche fehlende Kennzeichnung sind Blocker.

## Prüferrollen

### UX

**Prüfauftrag:** Bewerte alle nutzerseitig sichtbaren oder bedienbaren Änderungen aus Sicht der betroffenen Zielgruppe.

**Prüfkriterien:**

- Nutzerfluss, Verständlichkeit von Texten und erwartbares Verhalten
- responsives Verhalten und visuelle Konsistenz mit der bestehenden Oberfläche
- Barrierefreiheit, insbesondere Semantik, Tastaturbedienung, Fokus, Kontraste und Alternativtexte
- erkennbare Lade-, Leer-, Fehler- und Erfolgszustände
- Auswirkungen neuer Medien auf mobile Nutzung, initiale Ladezeit und wahrnehmbare Ladezustände
- sichtbare, verständliche und angemessene KI-Kennzeichnung, wenn sie für den konkreten Medienkontext erforderlich ist

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
- bei Medien: Herkunft, Lizenz oder Nutzungsrecht und Angabe zur KI-Erzeugung oder -Manipulation je Asset
- bei KI-generierten oder KI-manipulierten Medien: nachvollziehbare Bewertung einer erforderlichen Kennzeichnung nach Artikel 50 AI Act und Nachweis ihrer sichtbaren Umsetzung

**Erwartete Befunde:** Fehlende Absicherung kritischen Verhaltens oder falsche notwendige Dokumentation als Blocker, zusätzliche sinnvolle Testfälle als Verbesserungen und aussagekräftige Tests beziehungsweise aktuelle Dokumentation als positive Feststellungen. Ungeklärte Medienherkunft, fehlende Lizenz oder Nutzungsberechtigung, unbekannte KI-Erzeugung beziehungsweise -Manipulation oder eine erforderliche fehlende Kennzeichnung sind Blocker. Dokumentation wird nur gefordert, wenn die Story abgeschlossen wird oder ein Release vorliegt; andernfalls ist ausdrücklich festzuhalten, ob sie derzeit nicht erforderlich ist.

## Gesamtentscheidung

Warte auf alle fünf Ergebnisse und fasse sie kurz als GO- oder NO-GO-Entscheidung zusammen. Ein belegter Blocker führt zu NO-GO. Nicht dokumentiert ausgenommene Verstöße gegen Medien-Budgets oder Medien-Compliance sind immer Blocker. Ohne Blocker lautet die Entscheidung GO; Verbesserungen werden separat aufgeführt und verhindern das GO nicht.

Zeige das Ergebnis zuerst dem Benutzer. Veröffentliche die Zusammenfassung erst nach dessen Bestätigung als Kommentar im Pull Request. Führe keinen Merge durch und verändere keine Dateien.
