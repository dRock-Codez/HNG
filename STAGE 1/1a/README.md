# Advanced Todo Card — Stage 1a

An interactive, stateful Todo Card built with plain HTML, CSS, and vanilla JavaScript.
Extends the Stage 0 submission with full state management, edit mode, live time tracking,
and richer accessibility patterns.

## What changed from Stage 0

- Added a central `state` object in JavaScript to keep all UI elements in sync
- Edit Mode: clicking Edit reveals a fully functional form; Save updates the card; Cancel restores previous values and returns focus to the Edit button
- Status control: replaced static status display with an interactive dropdown (`Pending`, `In Progress`, `Done`) synced with the checkbox
- Priority indicator: animated colored dot that changes based on `Low`, `Medium`, or `High` priority
- Expand/Collapse: long descriptions are truncated by default with a Show more / Show less toggle
- Live time tracker updates every 30 seconds and flags the card visually when overdue
- `test-todo-status` from Stage 0 is preserved as a hidden DOM element kept in sync with the new status control for backwards test compatibility

## Design decisions

- Kept the glassmorphism aesthetic and animated gradient background from Stage 0 for visual consistency
- Used a single `render()` function as the source of truth — all state changes call it to keep the UI fully in sync
- Visual state classes (`completed`, `in-progress`, `overdue-state`) are applied to the card root so CSS can handle all visual transitions declaratively
- `tabindex` attributes are explicitly set to enforce the required keyboard flow: Checkbox → Status → Expand → Edit → Delete

## Accessibility notes

- All edit form inputs have explicit `<label for="">` associations
- Status dropdown has `aria-label="Task Status"`
- Expand/collapse toggle uses `aria-expanded` and `aria-controls` pointing to the collapsible section's `id`
- Time remaining section uses `aria-live="polite"` so screen readers announce updates without interrupting the user
- Focus is returned to the Edit button when edit mode is closed
- All interactive elements have visible `:focus-visible` styles

## Known limitations

- No localStorage — data resets on page refresh
- Focus trap inside the edit form is not implemented (listed as optional bonus in the spec)

## How to run locally

No build step required.

1. Clone or download this repository
2. Open `index.html` in any modern browser