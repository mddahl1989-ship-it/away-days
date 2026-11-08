# AwayDays – Frontend

React + Vite + TypeScript + Tailwind CSS. Start mit `npm install` und `npm run dev`, die App läuft dann auf `http://localhost:5173` und erwartet die API auf `http://localhost:5100` (änderbar über `VITE_API_URL` in einer `.env`-Datei).

Mehr zum Projekt in der [README im Hauptordner](../README.md).

```
src/
├── api/          Aufrufe der API (fetch-Wrapper mit ProblemDetails-Auswertung)
├── components/   Layout, Anzeigetafel, Ticket, Ergebnis-Tafel, Formular-Bausteine
├── lib/          Formatierung (Datum, Euro, Paarung, Ergebnis)
├── pages/        Übersicht, Spielplan, Spiel-Formular, Fahrtenbuch, Fahrt, Fahrt-Formular, 404
└── types/        TypeScript-Typen passend zu den DTOs der API
```
