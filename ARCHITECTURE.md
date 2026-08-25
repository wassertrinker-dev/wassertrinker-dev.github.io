# Architekturentscheidungen

## Seitenrahmen und Inhaltsnavigation

Die Case Study ist als feste App-Struktur aufgebaut:

- Der Header bleibt am oberen Rand sichtbar und enthält den Seitentitel, den Style-Wechsel, den bewusst noch funktionslosen Button „Anmelden“ und den bestehenden Link „Motion Leap ansehen“.
- Der Footer bleibt am unteren Rand sichtbar und enthält ausschließlich die zwei festgelegten Hinweise.
- Ausschließlich der Inhaltsbereich zwischen Header und Footer scrollt.
- Eisberg, Workflow und Tote Genies sind eigenständige Inhaltsbereiche innerhalb dieses Scrollbereichs.
- Die einklappbare Inhaltsnavigation markiert den aktuell sichtbaren Bereich und muss per Maus, Touch und Tastatur nutzbar bleiben.

Änderungen am Seitenlayout müssen diese Struktur erhalten. Neue Inhaltsbereiche werden als eigenständige, semantisch beschriftete Bereiche ergänzt und bei Bedarf in die Inhaltsnavigation aufgenommen.
