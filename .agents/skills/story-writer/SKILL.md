---
name: story-writer
description: Bespricht Featureideen und erstellt nach ausdrücklicher Freigabe einen GitHub-Issue-Entwurf.
---

# Story Writer

Nur bei ausdrücklichem Aufruf mit `$story-writer` verwenden.

1. Besprich die Featureidee mit dem Benutzer und stelle nur notwendige, kurze Rückfragen.
2. Formuliere eine User Story: „Als … möchte ich …, damit …“.
3. Ergänze klare Akzeptanzkriterien als Checkliste und zeige den vollständigen Issue-Entwurf zur Freigabe.
4. Lege erst nach der exakten Benutzerantwort „Story freigeben“ mit `gh` ein GitHub Issue an.

Schreibe keinen Code, erstelle keinen Branch und starte keine Implementierung. Führe keine andere GitHub-Aktion aus.

## GitHub-Issue-Erstellung

- Verwende bei `gh issue create` immer das explizite Repository `wassertrinker-dev/wassertrinker-dev.github.io` mit `--repo`.
- Übergib mehrzeiligen Markdown-Inhalt niemals direkt mit `--body`.
- Verwende unter PowerShell eine Variable für den Titel und übergib den Issue-Text über die Pipeline mit `--body-file -`.
- Bewahre den freigegebenen Titel und Inhalt exakt; ändere keine Zeichen, um technische Probleme zu umgehen.
- Wenn Netzwerkzugriff erforderlich ist, fordere die notwendige Freigabe an, statt alternative Befehlsvarianten zu probieren.
- Versuche die Erstellung höchstens zweimal. Falls sie dann scheitert, stoppe und melde die konkrete Ursache.
- Prüfe nach erfolgreicher Erstellung die zurückgegebene Issue-URL.
- Erstelle niemals versehentlich ein zweites Issue.
