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

## Prüferrollen

### UX

**Prüfauftrag:** Bewerte alle nutzerseitig sichtbaren oder bedienbaren Änderungen aus Sicht der betroffenen Zielgruppe.

**Prüfkriterien:**

- Nutzerfluss, Verständlichkeit von Texten und erwartbares Verhalten
- responsives Verhalten und visuelle Konsistenz mit der bestehenden Oberfläche
- Barrierefreiheit, insbesondere Semantik, Tastaturbedienung, Fokus, Kontraste und Alternativtexte
- erkennbare Lade-, Leer-, Fehler- und Erfolgszustände

**Erwartete Befunde:** Konkrete Bedienhürden oder unklare Zustände als Blocker oder Verbesserung sowie gut gelöste Interaktionen als positive Feststellungen. Nicht sichtbare Änderungen werden mit einer kurzen Begründung als nicht betroffen eingeordnet.

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

**Erwartete Befunde:** Reproduzierbare Fehler oder gravierende Wartungsrisiken als Blocker, lokale Qualitätsverbesserungen als Vorschläge und besonders klare, robuste Lösungen als positive Feststellungen.

### Security

**Prüfauftrag:** Ermittle, ob die Änderung neue Sicherheits- oder Datenschutzrisiken einführt oder bestehende Schutzmechanismen schwächt.

**Prüfkriterien:**

- Validierung und sichere Verarbeitung nicht vertrauenswürdiger Eingaben und Ausgaben
- Authentifizierung, Autorisierung und Schutz sensibler Funktionen oder Daten
- Geheimnisse, personenbezogene Daten, Logging und Datenminimierung
- neue Abhängigkeiten, unsichere Konfigurationen und typische Web-Schwachstellen

**Erwartete Befunde:** Ausnutzbare Schwachstellen, offengelegte Geheimnisse oder unzulässige Zugriffe als Blocker, Härtungsmaßnahmen als Verbesserungen und wirksame Schutzmechanismen als positive Feststellungen. Nenne ein realistisches Angriffsszenario oder begründe, warum keines erkennbar ist.

### Tests und Dokumentation

**Prüfauftrag:** Prüfe, ob das geänderte Verhalten angemessen verifiziert ist und notwendige nutzer- oder wartungsrelevante Dokumentation stimmt.

**Prüfkriterien:**

- automatisierte Tests für neue Pfade, Randfälle und Fehlerzustände
- Aussagekraft, Stabilität und tatsächliches Ergebnis der relevanten Prüfungen
- erforderliche manuelle Prüfschritte, wenn Automatisierung nicht sinnvoll ist
- Aktualität von README, Betriebs-, Nutzungs- und Schnittstellendokumentation

**Erwartete Befunde:** Fehlende Absicherung kritischen Verhaltens oder falsche notwendige Dokumentation als Blocker, zusätzliche sinnvolle Testfälle als Verbesserungen und aussagekräftige Tests beziehungsweise aktuelle Dokumentation als positive Feststellungen. Dokumentation wird nur gefordert, wenn die Story abgeschlossen wird oder ein Release vorliegt; andernfalls ist ausdrücklich festzuhalten, ob sie derzeit nicht erforderlich ist.

## Gesamtentscheidung

Warte auf alle fünf Ergebnisse und fasse sie kurz als GO- oder NO-GO-Entscheidung zusammen. Ein belegter Blocker führt zu NO-GO. Ohne Blocker lautet die Entscheidung GO; Verbesserungen werden separat aufgeführt und verhindern das GO nicht.

Zeige das Ergebnis zuerst dem Benutzer. Veröffentliche die Zusammenfassung erst nach dessen Bestätigung als Kommentar im Pull Request. Führe keinen Merge durch und verändere keine Dateien.
