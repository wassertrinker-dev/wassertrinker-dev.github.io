# Modellwahl und Modelldokumentation für User Stories

Diese Guideline ergänzt die verbindlichen Regeln in `AGENTS.md`. Sie gilt für
jede freigegebene User Story und ersetzt weder die menschliche Freigabe für
Implementierung, Push oder Merge noch das Merge-Gate.

## Ablauf

1. Vor dem Anlegen des Story-Branches empfiehlt der Lead Architect oder ein
   beauftragter Agent ein Modell und eine Reasoning-Konfiguration.
2. Die Empfehlung wird mit Issue-Nummer, Story-Typ, Story Points, Risikoklasse
   und einer kurzen Begründung festgehalten.
3. Der Mensch darf die Empfehlung begründet ändern.
4. Vor dem Merge wird der Modelldatensatz im ursprünglichen Story-Branch in
   `governance/model-evaluations.json` ergänzt und mit
   `node scripts/check-model-evaluations.mjs` validiert.
5. Kann die ausführende Umgebung Modell oder Reasoning-Konfiguration nicht
   sicher aus überprüfbaren Metadaten nachweisen, fragt der Agent den Menschen
   vor dem Merge-Gate verpflichtend nach diesen Angaben. Er darf sie nicht
   schätzen oder aus Chatverlauf, Prompt oder vermutetem Modell ableiten.
6. Ohne technisch verifizierte oder menschlich bestätigte Ausführungsmetadaten
   darf das Merge-Gate kein GO erteilen.

Der Datensatz dokumentiert die Modellentscheidung, nicht das Merge-Ergebnis.
Nach dem Merge ist deshalb kein weiterer Branch, Pull Request oder Merge nur
für Modelldokumentation erforderlich.

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

## Datenschutz und Datenqualität

Die Modelldokumentation enthält keine internen Prompts, Gedankengänge,
Agentenchats, personenbezogenen Inhalte oder geheimen Zugangsdaten. Die
Datenherkunft ist immer entweder `verified-metadata` oder `human-confirmed`.

## Datensatz

`governance/model-evaluations.json` ist die versionierte Quelle der
Modelldokumentation. Das Schema und die erlaubten Werte stehen in
`governance/model-evaluations.schema.json`. Für jeden Datensatz sind mindestens
Issue, Story-Typ, Story Points, Risiko, Empfehlung, tatsächliche Ausführung und
Datenherkunft erforderlich. Der Datensatz wird vor dem Merge im ursprünglichen
Story-Branch ergänzt.

Ein Datensatz hat dieses Format:

```json
{
  "issueNumber": 52,
  "storyType": "governance",
  "storyPoints": 5,
  "riskClass": "medium",
  "recommendation": {
    "model": {
      "provider": "openai",
      "model": "gpt-5.6-terra",
      "reasoning": { "nativeSetting": "medium", "normalizedLevel": 3 }
    },
    "rationale": "Ausgewogen für eine mittelgroße, gut prüfbare Governance-Story."
  },
  "execution": {
    "model": {
      "provider": "openai",
      "model": "gpt-5.6-terra",
      "reasoning": { "nativeSetting": "medium", "normalizedLevel": 3 }
    },
    "environment": "hosted",
    "metadataSource": "human-confirmed"
  }
}
```
