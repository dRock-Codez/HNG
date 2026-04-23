# Invoicer — Invoice Management App

A full-stack invoice management application built with React. Create, read, update, and delete invoices; save drafts; mark pending invoices as paid; filter by status; toggle light/dark mode; and enjoy a fully responsive, accessible experience.

> **Frontend Wizards — Stage 2 submission.** Built from a Figma spec with persistence, validation, and accessibility baked in from the ground up.

---

## 🔧 Setup

### Prerequisites

- **Node.js** 18+ and **npm** 9+

### Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
# → http://localhost:5173

# 3. Build for production
npm run build

# 4. Preview the production build locally
npm run preview
```

### Deployment

Push to GitHub, then import the repo into **Vercel** or **Netlify**. Both auto-detect Vite — no extra config needed.

- **Build command:** `npm run build`
- **Output directory:** `dist`

---

## 🏗️ Architecture

```
invoice-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                   # Entry; wraps app in providers + router
    ├── App.jsx                    # Routes + layout shell
    ├── App.css
    │
    ├── contexts/
    │   ├── ThemeContext.jsx       # Light/dark toggle, localStorage persistence
    │   └── InvoiceContext.jsx     # CRUD ops, localStorage persistence
    │
    ├── pages/
    │   ├── InvoiceList.jsx        # Home — list + filter + "New" button
    │   ├── InvoiceDetail.jsx      # Single invoice view + actions
    │   └── NotFound.jsx
    │
    ├── components/
    │   ├── Sidebar.jsx            # Nav + theme toggle + avatar
    │   ├── InvoiceCard.jsx        # List item (clickable link)
    │   ├── StatusBadge.jsx        # Colored status pill
    │   ├── FilterDropdown.jsx     # Multi-select status filter
    │   ├── InvoiceForm.jsx        # Slide-in form (create + edit)
    │   ├── DeleteModal.jsx        # Confirm-deletion dialog
    │   └── EmptyState.jsx
    │
    ├── utils/
    │   ├── storage.js             # Safe localStorage wrapper
    │   ├── validation.js          # Form validation rules
    │   └── helpers.js             # IDs, currency, dates, totals
    │
    ├── data/
    │   └── initialData.js         # Seed invoices for first load
    │
    └── styles/
        ├── variables.css          # Design tokens (colors, spacing, motion)
        └── global.css             # Resets, typography, shared patterns
```

### State Management

- **`ThemeContext`** — holds the active theme (`'light' | 'dark'`). Reads system preference on first mount, then persists user choice to `localStorage` under `invoicer:theme`. Applies via a `data-theme` attribute on `<html>`, which drives a CSS-variable-based theming system.
- **`InvoiceContext`** — holds the `invoices` array and exposes `create`, `update`, `remove`, `markAsPaid`, and `getById`. Every mutation is persisted to `localStorage` under `invoicer:invoices` in a `useEffect`. Totals and due dates are re-normalized on every write so the source of truth stays consistent.
- **Form state** is local to `InvoiceForm` (via `useState`). That's deliberate — drafts of unsaved input shouldn't leak into global state. The form only commits when the user clicks save.

### Persistence

LocalStorage, wrapped in a small `storage.js` helper that try/catches every read and write. On first load, if no stored invoices exist, the app hydrates from `data/initialData.js` so the UI never starts empty.

### Routing

React Router v6. Two real routes:
- `/` — invoice list
- `/invoice/:id` — invoice detail
- `*` — 404

### Responsive Breakpoints

The app uses three breakpoints, modeled directly on the Figma design:

- **Mobile** (< 768px) — Top bar with logo + theme toggle + avatar, stacked form fields, card-style invoice items in detail view, floating action bar at the bottom of the detail page.
- **Tablet** (768px – 1023px) — Same top bar as mobile (not a left sidebar — this matches the Figma tablet designs exactly). Invoice cards switch to single-row table layout, form fields spread into 3 columns, detail items become a proper table.
- **Desktop** (≥ 1024px) — Left-anchored vertical sidebar, everything else scales up from tablet.

### Styling

Plain CSS with CSS variables for theming — no CSS-in-JS, no Tailwind. Reasoning in trade-offs below.

---

## ⚖️ Trade-offs

### Why plain CSS over Tailwind / styled-components?

For a themeable app with light/dark mode, **CSS variables are the sharpest tool.** Flipping a `data-theme` attribute on `<html>` re-themes the entire tree with zero JS work. Tailwind works, but duplicating every class with a `dark:` variant is noisier. `styled-components` works too, but adds a runtime cost for a project this size.

### Why LocalStorage over a real backend?

The brief allows LocalStorage, IndexedDB, or a backend. I chose LocalStorage because:
- **Zero infra** — the app is genuinely static and deploys to any CDN.
- **Instant reads/writes** — no loading states to design around.
- **Sufficient capacity** — 5MB is plenty for thousands of invoices.

If the app needed to scale to real users, multi-device sync, or server-side PDF generation, I'd swap `InvoiceContext`'s persistence layer for a Next.js API route backed by Postgres — the context's public API wouldn't change.

### Why Context over Redux / Zustand?

The state footprint is small (one array + one string) and the update patterns are straightforward. Context + `useState` is enough. Introducing Redux for this would be over-engineering; I'd rather keep the bundle small and the mental model simple.

### Why custom validation instead of Zod / React Hook Form?

The form's validation rules are short enough (required fields + email regex + positive numbers) that writing them inline made the data flow easier to reason about. For a larger form with conditional fields and complex cross-field rules, I'd reach for `react-hook-form` + `zod`.

### Form is a slide-in drawer, not a separate route

The Figma puts create/edit in an overlay that animates from the left. Making it a route (`/invoice/new`) would be more URL-addressable, but the drawer preserves the user's list scroll position and feels snappier — especially on the detail page's "Edit" action, where the user expects to come back to the same invoice view.

### One invoice ID pattern everywhere

IDs are generated client-side as `XX0000` to match the Figma design. This means two clients could in theory generate the same ID — a real app would use server-generated IDs or UUIDs.

---

## ♿ Accessibility Notes

- **Semantic HTML throughout.** `<header>`, `<main>`, `<article>`, `<section>`, `<address>`, `<fieldset>` + `<legend>`, `<table>` with `<thead>` / `<tbody>` for the items table.
- **All form fields have real `<label>` elements** connected via `htmlFor` / `id`. The items grid uses visually-hidden labels + `sr-only` error text so screen readers still announce the context.
- **Buttons are `<button>`.** Links are `<a>` (via React Router's `<Link>`). No clickable `<div>`s anywhere.
- **Focus management:**
  - `:focus-visible` styles apply everywhere — tab through the app and you see clear focus rings.
  - The delete modal traps focus (Tab and Shift+Tab cycle within the dialog), closes on `Escape`, and returns focus to the trigger after close.
  - The invoice form also locks body scroll, traps focus within the drawer, and closes on `Escape`.
  - The status filter closes on outside-click and on `Escape`.
- **ARIA:**
  - `aria-modal="true"`, `aria-labelledby`, and `aria-describedby` on dialogs.
  - `aria-expanded` / `aria-haspopup` on dropdown triggers.
  - `role="alert"` on validation errors so screen readers announce them.
  - `aria-invalid="true"` on fields with errors.
  - `aria-label` on icon-only buttons (delete, theme toggle, etc.).
- **Color contrast:** All text-on-background pairs meet WCAG AA in both themes. Disabled button opacity is raised (0.6, not 0.5) so it's still readable.
- **Reduced motion:** A `prefers-reduced-motion` media query short-circuits all animations to 0.01ms for users who've asked the OS to minimize motion.
- **Keyboard-only flow tested:** You can complete the full CRUD flow — create, edit, mark as paid, delete — without touching the mouse.

---

## 🎁 Extras Beyond the Brief

- **System theme detection** on first load (`prefers-color-scheme`) before falling back to the default.
- **Staggered card entry animation** on the list for a polished first impression.
- **Reduced-motion support** — animations respect OS-level preferences.
- **Backdrop blur** on modal overlays for depth.
- **Scroll-to-error** — when form submission fails, the view scrolls to the first invalid field.
- **Smart filter labeling** — the invoice count updates contextually ("There are 3 pending invoices" vs. "There are 5 total invoices").
- **Edit preserves status** — editing a paid invoice doesn't let you accidentally demote it to pending.
- **Touch-friendly hit targets** — all interactive elements are at least 44×44px.

---

## 📜 License

MIT — do whatever you want with it.
