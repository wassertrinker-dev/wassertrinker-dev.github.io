# Architekturentscheidungen

## Seitenrahmen und Inhaltsnavigation

Die Case Study ist als feste App-Struktur aufgebaut:

- Der Header bleibt am oberen Rand sichtbar und enthält den Seitentitel, den Style-Wechsel, den bewusst noch funktionslosen Button „Anmelden“ und den bestehenden Link „Motion Leap ansehen“.
- Der Footer bleibt am unteren Rand sichtbar und enthält ausschließlich die zwei festgelegten Hinweise.
- Ausschließlich der Inhaltsbereich zwischen Header und Footer scrollt.
- Eisberg, Workflow und Tote Genies sind eigenständige Inhaltsbereiche innerhalb dieses Scrollbereichs.
- Die einklappbare Inhaltsnavigation markiert den aktuell sichtbaren Bereich und muss per Maus, Touch und Tastatur nutzbar bleiben.

Änderungen am Seitenlayout müssen diese Struktur erhalten. Neue Inhaltsbereiche werden als eigenständige, semantisch beschriftete Bereiche ergänzt und bei Bedarf in die Inhaltsnavigation aufgenommen.

## Workflow mit Talking Head

Die deutsche Workflow-Animation verwendet genau ein Videoelement. Die Clips
`shot1.mp4` bis `shot11.mp4` werden erst beim Start ihrer jeweiligen Szene als
Quelle gesetzt. Das Ende des Clips steuert den Wechsel zur nächsten Szene;
nichtdeutsche Sprachversionen verwenden weiterhin die zeitgesteuerte Animation
ohne deutschen Talking Head.

Die Wiedergabe mit Ton beginnt ausschließlich nach der Schaltfläche
„Animation starten“. Pause, Fortsetzen, Reset, Sprachwechsel, statischer Modus
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
