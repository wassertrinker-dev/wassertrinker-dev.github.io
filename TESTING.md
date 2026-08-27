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
| KI-Kennzeichnung | „KI-generiert“ bleibt bei Desktop- und Mobilbreite kontrastreich und lesbar am Talking Head sichtbar. | Manuell bestanden am 27.08.2026 |
| Clip-Reihenfolge | `shot1.mp4` bis `shot11.mp4` werden nacheinander den Szenen 1 bis 11 zugeordnet; das Clipende wechselt die Szene. | Manuell bestanden am 27.08.2026 |
| Pause und Fortsetzen | Video, Ton und Workflow pausieren gemeinsam und laufen synchron weiter. | Manuell bestanden am 27.08.2026 |
| Reset | Wiedergabe endet, die Medienquelle wird entfernt und Szene 1 wiederhergestellt. | Manuell bestanden am 27.08.2026 |
| Sprachwechsel während Deutsch läuft | Video und deutsche Tonspur enden; die gewählte Sprache zeigt die Animation ohne Talking Head. | Manuell bestanden am 27.08.2026 |
| Nichtdeutsche Sprachen | Kein Autostart; „Animation starten“ startet die zeitgesteuerte Animation ohne deutschen Talking Head. | Manuell bestanden am 27.08.2026 |
| Fehlender Clip | Der Talking Head wird ausgeblendet und der Workflow setzt die Szene zeitgesteuert fort. | Manuell bestanden am 27.08.2026 |
| Statischer Modus | Video und Animation stoppen; beim Zurückwechseln bleibt die Animation bis zum Start-Button bereit. | Manuell bestanden am 27.08.2026 |
| `prefers-reduced-motion` | Animation und Talking Head bleiben deaktiviert; der statische Inhalt bleibt verfügbar. | Manuell bestanden am 27.08.2026 |
| Responsive Darstellung | Bei schmalem Fenster verdeckt der Talking Head keine Bedienung; Inhalt und KI-Kennzeichnung bleiben wahrnehmbar. | Manuell bestanden am 27.08.2026 |
| Themes | Talking Head, Bedienelemente und KI-Kennzeichnung bleiben in allen vorhandenen Themes kontrastreich. | Manuell bestanden am 27.08.2026 |

Statische Prüfungen vor dem Merge:

- Alle Inline-Skripte aus `index.html` mit `node --check` prüfen.
- `git diff --check origin/main...HEAD` ausführen.
- Vorhandensein aller elf finalen Clips prüfen.
- Mit `ffprobe` Dauer, Abmessungen und H.264/AAC-Streams gegen
  `assets/talking_head/MEDIA_MANIFEST.md` abgleichen.
- Über den lokalen HTTP-Server prüfen, dass ein angeforderter Clip mit
  `Content-Type: video/mp4` und Status 200 ausgeliefert wird.
