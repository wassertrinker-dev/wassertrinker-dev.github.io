# Modellwahl und Lernbasis für User Stories

Diese Guideline ergänzt die verbindlichen Regeln in `AGENTS.md`. Sie gilt für
jede freigegebene User Story und ersetzt weder die menschliche Freigabe für
Implementierung, Push oder Merge noch das Merge-Gate.

## Ablauf

1. Vor dem Anlegen des Story-Branches empfiehlt der Lead Architect oder ein
   beauftragter Agent ein Modell und eine Reasoning-Konfiguration.
2. Die Empfehlung wird mit Issue-Nummer, Story-Typ, Story Points, Risikoklasse
   und einer kurzen Begründung festgehalten.
3. Der Mensch darf die Empfehlung begründet ändern.
4. Nach dem bestätigten Merge wird ein vollständiger Datensatz in
   `governance/model-evaluations.json` ergänzt und mit
   `node scripts/check-model-evaluations.mjs` validiert.
5. Kann die ausführende Umgebung Modell oder Reasoning-Konfiguration nicht
   sicher aus überprüfbaren Metadaten nachweisen, fragt der Agent den Menschen
   verpflichtend nach diesen Angaben. Er darf sie nicht schätzen oder aus
   Chatverlauf, Prompt oder vermutetem Modell ableiten.
6. Nach fünf abgeschlossenen Datensätzen und danach nach jeweils zehn weiteren
   wird eine überschlägige Auswertung für vergleichbare, erfolgreich gemergte
   Stories erstellt.

Ein Datensatz wird erst nach dem Merge angelegt. Dadurch enthält die Lernbasis
nur tatsächlich abgeschlossene Stories und kein hypothetisches Ergebnis.

## Empfehlung vor der Implementierung

Die Wahl folgt dieser Reihenfolge:

1. Akzeptanzkriterien, Sicherheits- und Qualitätsrisiko bestimmen.
2. Das kleinste plausibel geeignete Modell wählen.
3. Die niedrigste Reasoning-Stufe wählen, die die Aufgabe voraussichtlich
   zuverlässig erfüllt.
4. Bei Unsicherheit eine Stufe höher starten und die Entscheidung im Datensatz
   begründen.

| Einsatz | Startempfehlung |
| --- | --- |
| Klar abgegrenzte, gut prüfbare, risikoarme Routine | Luna oder geeignetes lokales Modell; Stufe 1–2 |
| Mittlere Entwicklungs-, Analyse- oder Dokumentationsaufgabe | Terra; Stufe 3 |
| Komplexe, risikoreiche oder schwer prüfbare Aufgabe | Sol; Stufe 4–5 |
| Qualitätskritische Ausnahme mit messbarem Zusatznutzen | Sol; Stufe 6 erst nach Vergleich mit Stufe 5 |

Lokale Modelle wie Qwen oder Gemma werden mit ihrer exakten, zur Laufzeit
verfügbaren Modellkennung und ihrer nativen Konfiguration erfasst. Eine lokale
Konfiguration erhält nur dann eine normalisierte Stufe 1–6, wenn diese
Zuordnung fachlich belegt ist; sonst bleibt `normalizedLevel` auf `null`.

Für OpenAI-Modelle gilt die feste Zuordnung:

| Stufe | Reasoning |
| ---: | --- |
| 1 | `none` |
| 2 | `low` |
| 3 | `medium` |
| 4 | `high` |
| 5 | `xhigh` |
| 6 | `max` |

## Bewertung

Ein Modell ist nur effizienter, wenn alle Akzeptanzkriterien erfüllt sind, das
Merge-Gate bestanden wurde und keine unverhältnismäßige Nacharbeit notwendig
war. Erst danach werden Kosten, Tokenverbrauch, Laufzeit und Ressourcenbedarf
verglichen. Kleinere oder lokale Modelle sind Vergleichskandidaten, keine
vorgegebene Abwertung der Qualitätsanforderungen.

Die Auswertung gruppiert nur vergleichbare Storys nach Story-Typ,
Risikoklasse und Größenordnung. Sie kennzeichnet kleine Stichproben als
Richtungsentscheidung, nicht als belastbaren Benchmark.

## Datenschutz und Datenqualität

Die Lernbasis enthält keine internen Prompts, Gedankengänge, Agentenchats,
personenbezogenen Inhalte oder geheimen Zugangsdaten. Verbrauchsdaten bleiben
`null`, wenn sie nicht zuverlässig verfügbar oder nicht vergleichbar sind.
Die Datenherkunft ist immer entweder `verified-metadata` oder
`human-confirmed`.

## Datensatz

`governance/model-evaluations.json` ist die versionierte Quelle der
Lernbasis. Das Schema und die erlaubten Werte stehen in
`governance/model-evaluations.schema.json`. Für jeden Datensatz sind mindestens
Issue, Story-Typ, Story Points, Risiko, Empfehlung, tatsächliche Ausführung,
Merge-Gate, Nacharbeit, Bewertung und Datenherkunft erforderlich.

Ein Datensatz hat dieses Format; unbekannte Verbrauchswerte bleiben `null`:

```json
{
  "issueNumber": 40,
  "storyType": "enabler",
  "storyPoints": 8,
  "riskClass": "medium",
  "recommendation": {
    "model": {
      "provider": "openai",
      "model": "gpt-5.6-terra",
      "reasoning": { "nativeSetting": "medium", "normalizedLevel": 3 }
    },
    "rationale": "Ausgewogen für eine mittelgroße, gut prüfbare Enabler-Story."
  },
  "execution": {
    "model": {
      "provider": "openai",
      "model": "gpt-5.6-terra",
      "reasoning": { "nativeSetting": "medium", "normalizedLevel": 3 }
    },
    "environment": "hosted",
    "metadataSource": "human-confirmed"
  },
  "outcome": {
    "mergedAt": "2026-08-28T12:00:00Z",
    "mergeGate": "GO",
    "acceptanceCriteria": "passed",
    "rework": "none",
    "measurement": {
      "durationMinutes": null,
      "inputTokens": null,
      "outputTokens": null,
      "costUsd": null
    }
  },
  "assessment": "fit",
  "comparisonCandidate": null
}
```
