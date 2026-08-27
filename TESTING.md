# Manuelle Abnahme

## Issue #26 – Workflow mit Talking Head

Testumgebung: Microsoft Edge, lokale Auslieferung mit
`python -m http.server 8000` unter `http://localhost:8000/`.

Vor der Abnahme die Seite mit `Strg+F5` neu laden. Im Serverprotokoll darf vor
dem Start kein Request auf `assets/talking_head/processed/shot*.mp4` erscheinen.

| Fall | Erwartetes Ergebnis | Ergebnis |
| --- | --- | --- |
| Initialer deutscher Workflow | Szene 1 ist bereit; Animation, Video und Ton starten nicht automatisch. | Bestanden am 27.08.2026 |
| „Animation starten“ auf Deutsch | `shot1.mp4`, Diagrammzustand und Szenentext starten gemeinsam; die Schaltfläche wechselt zu „Animation pausieren“. | Bestanden am 27.08.2026 |
| KI-Kennzeichnung | „KI-generiert“ bleibt bei Desktop- und Mobilbreite kontrastreich und lesbar am Talking Head sichtbar. | Ausstehende visuelle Kontrolle |
| Clip-Reihenfolge | `shot1.mp4` bis `shot11.mp4` werden nacheinander den Szenen 1 bis 11 zugeordnet; das Clipende wechselt die Szene. | Ausstehende manuelle Kontrolle |
| Pause und Fortsetzen | Video, Ton und Workflow pausieren gemeinsam und laufen synchron weiter. | Ausstehende manuelle Kontrolle |
| Reset | Wiedergabe endet, die Medienquelle wird entfernt und Szene 1 wiederhergestellt. | Ausstehende manuelle Kontrolle |
| Sprachwechsel während Deutsch läuft | Video und deutsche Tonspur enden; die gewählte Sprache zeigt die Animation ohne Talking Head. | Ausstehende manuelle Kontrolle |
| Nichtdeutsche Sprachen | Kein Autostart; „Animation starten“ startet die zeitgesteuerte Animation ohne deutschen Talking Head. | Ausstehende manuelle Kontrolle |
| Fehlender Clip | Der Talking Head wird ausgeblendet und der Workflow setzt die Szene zeitgesteuert fort. | Ausstehende manuelle Kontrolle |
| Statischer Modus | Video und Animation stoppen; beim Zurückwechseln bleibt die Animation bis zum Start-Button bereit. | Ausstehende manuelle Kontrolle |
| `prefers-reduced-motion` | Animation und Talking Head bleiben deaktiviert; der statische Inhalt bleibt verfügbar. | Ausstehende manuelle Kontrolle |
| Themes und Responsive | Talking Head verdeckt keine Bedienung; Status, Inhalt und KI-Kennzeichnung bleiben wahrnehmbar. | Ausstehende manuelle Kontrolle |

Statische Prüfungen vor dem Merge:

- Alle Inline-Skripte aus `index.html` mit `node --check` prüfen.
- `git diff --check origin/main...HEAD` ausführen.
- Vorhandensein aller elf finalen Clips prüfen.
- Mit `ffprobe` Dauer, Abmessungen und H.264/AAC-Streams gegen
  `assets/talking_head/MEDIA_MANIFEST.md` abgleichen.
- Über den lokalen HTTP-Server prüfen, dass ein angeforderter Clip mit
  `Content-Type: video/mp4` und Status 200 ausgeliefert wird.
