# Setup

1. Install temporal cli

`brew install temporal` or https://learn.temporal.io/getting_started/typescript/dev_environment/?os=mac

2. Start docker compose

`docker compose up`

Services:

- Temporal + Dependencies
- Redis

# Context

Unternehmen: Entwicklung einer modernen Alternative für die EPA.

# Aufgaben

## 3.1. Abfrage von Patienten einer Krankenkasse

Jeden Tag muss die Liste aller Patienten abgerufen werden, um neue Patienten zu speichern und alte zu löschen.
Diese Patienten haben aktive Versorgungen. Diese müssen einzeln pro Patient abgerufen werden.

Leider ist die KK per Modem angebunden und deshalb sehr störanfällig. Die Fehlerquote liegt bei ca. 80%.

Die API mit den Patienten liefert leider immer sehr große Datenmengen zurück. Wir müssen deshalb einen Weg finden, um die GRPC-Grenzen nicht zu verletzen.

[] Patienten abrufen und in "Datenbank" speichern (alte löschen)
[] Versorgungen der neuen Patienten abrufen und speichern
[] Patient + Versorgungen abrufen

## 3.1.1. Patient nicht versichert (Cancellation / Compensation)

Liefert die API ein 410 zurück, bedeutet das, dass der Patient nicht mehr versichert ist.
Der Sync muss dann abgebrochen werden
Es wurde beschlossen, dass die Activity einen Nonretryable-Error wirft.

## 3.2. Progress abrufen (Queries)

Das Management möchte den Fortschritt des Sync sehen...

## 3.3. Synchronisation pausieren (Updates)

Manchmal ruft die Krankenkasse wegen zu vielen Abrufen. Dann müssen wir die Synchronisation manuell pausieren und fortsetzen.

## 3.4. Einzelne Patienten synchronisieren (Early return / Sync/Async)

Wir möchten über ein Interface einzelne Patienten synchronisieren.
Wichtig dabei ist, dass wir innerhalb von einer Sekunde den Nutzer darüber informieren,
dass ein Sync stattfinden wird und das auch im UI angezeigt wird bzw. in der DB hinterlegt ist.

## 3.5. API-Limit (Singleton/Lock)

Leider sind die System der KK nicht wirklich gut. Deshalb dürfen wir maximal einen Request an die Krankenkasse senden.
Hat die Krankenkasse angerufen und wir den Sync pausiert, darf gar nichts mehr an die KK gehen, ansonsten gibt es Strafzahlungen.

## 3.6. Neue Gesetze (Entity-Workflow)

Aufgrund von Regulationen im Gesundheitsbereicht müssen wir alle Zugriffe auf Patientendaten dokumentieren.
