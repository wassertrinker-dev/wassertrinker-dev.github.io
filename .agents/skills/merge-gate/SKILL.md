---
name: merge-gate
description: Prüft einen Pull Request unabhängig und fasst die Ergebnisse als GO- oder NO-GO-Entscheidung zusammen.
---

# Merge Gate

Nur bei ausdrücklichem Aufruf mit `$merge-gate` verwenden.

Prüfe den angegebenen Pull Request oder den Pull Request des aktuellen Branches. Setze je einen unabhängigen Subagenten für UX, Architektur, Codequalität und Security, Tests sowie notwendige Dokumentation ein. Warte auf alle Ergebnisse und fasse sie kurz als GO- oder NO-GO-Entscheidung zusammen.

Zeige das Ergebnis zuerst dem Benutzer. Veröffentliche die Zusammenfassung erst nach dessen Bestätigung als Kommentar im Pull Request. Führe keinen Merge durch und verändere keine Dateien.
