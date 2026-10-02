# Crextio Dashboard

An HR dashboard built with Next.js 15 (App Router) and TypeScript, styled with plain CSS.

## Run

```bash
npm install
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Features

All data is kept in `localStorage`, so changes survive a reload. Reset it from the account menu or from Settings.

- **Dashboard**: the stats update live from hiring, tasks and tracked time. The employee card lets you browse people with arrows. Also includes a weekly progress chart, a time tracker (start, pause, or stop and log to today), onboarding progress with a task checklist (add, toggle, delete), accordion details and a week calendar (click a slot to add an event, click an event to edit or delete it).
- **People**: search, filter by department, add, edit or remove employees, and upload photos.
- **Hiring**: a Kanban pipeline. Moving a candidate updates the dashboard percentages and sends a notification.
- **Devices**: add devices, assign them to employees (shown on the dashboard) and set their status.
- **Apps**: turn integrations on or off.
- **Salary**: edit salaries inline, see payroll totals and export to CSV.
- **Calendar**: a full week view.
- **Reviews**: add or delete star-rated reviews.
- **Settings**: name, role, company and project count.
