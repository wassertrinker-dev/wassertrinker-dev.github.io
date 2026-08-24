Kleines How-to: Workflow in Codex

Nur $story-writer und $merge-gate sind echte Skill-Aufrufe. Alles andere sagst du dem normalen Lead Agent in natürlicher Sprache.

Stories planen

Eine einzelne Story:

$story-writer Ich möchte folgendes Feature besprechen: …

Mehrere Storys vorbereiten:

$story-writer Zerlege folgende Idee in mehrere kleine User Stories: …
Zeige mir zuerst alle Entwürfe und lege noch keine Issues an.

Storys anschließend anlegen:

Ich gebe Story 1, 2 und 4 frei. Lege sie als GitHub Issues an.

Backlog anzeigen:

Liste mir die offenen GitHub Issues mit Nummer, Titel und Kurzbeschreibung.
Verändere nichts.
Eine Story umsetzen
Setze ausschließlich Issue #3 um.
Arbeite auf einem eigenen Story-Branch.

Zwischenstand anzeigen:

Zeige mir den Stand von Issue #3, den aktuellen Branch und den nächsten Schritt.
Verändere nichts.

Story für die Abnahme vorbereiten:

Bereite Issue #3 zur Abnahme vor:
testen, notwendige Dokumentation prüfen, committen, pushen und einen PR mit
Closes #3 erstellen. Noch nicht mergen.
Pull Request prüfen
$merge-gate Prüfe Pull Request #4.

Bei NO-GO nachbessern:

Behebe ausschließlich die blockierenden Punkte aus dem Merge-Gate.

Oder Risiko bewusst akzeptieren:

Ich akzeptiere das genannte Risiko.
Dokumentiere die Entscheidung im Pull Request.
Mergen und veröffentlichen
Merge Pull Request #4.

Prüfe anschließend:
- GitHub Pages erfolgreich veröffentlicht
- Issue automatisch geschlossen
- Story-Branch gelöscht
- Funktion auf der veröffentlichten Seite verfügbar
Release erstellen

Nach mehreren abgeschlossenen Storys:

Erstelle aus den seit dem letzten Release abgeschlossenen Issues einen
Release-Vorschlag. Zeige ihn mir vor der Veröffentlichung.

Der Normalfall ist damit nur:

$story-writer Idee besprechen
Setze Issue #... um
$merge-gate Prüfe PR #...
Merge PR #...
