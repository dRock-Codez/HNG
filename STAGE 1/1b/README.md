# Testable Profile Card — Stage 1b

A responsive, accessible, and automated-test-ready Profile Card built with
plain HTML, CSS, and vanilla JavaScript.

## Features

- All required `data-testid` attributes applied exactly as specified
- Semantic HTML structure: `<article>`, `<header>`, `<figure>`, `<nav>`, `<section>`
- Live epoch time in milliseconds via `Date.now()`, updating every 500ms
- Responsive layout: stacks vertically on mobile, avatar-left on desktop
- WCAG AA compliant color contrast throughout
- Social links open in new tab with `rel="noopener noreferrer"`

## Design decisions

- Matched the visual language of Stage 1a (same glassmorphism card, animated gradient background, gradient top edge) so both submissions feel like a cohesive design system
- The HUD time panel shows both a human-readable clock and the raw epoch milliseconds — the `data-testid="test-user-time"` is on the raw number as the spec requires
- `aria-live="polite"` is on the HUD panel so screen readers are notified of time updates without being disruptive

## Accessibility notes

- Avatar `<img>` has descriptive `alt` text
- Social `<nav>` has `aria-label="Social media links"`
- All links are keyboard focusable with visible `:focus-visible` outline
- Dynamic time region uses `aria-live="polite"`

## Known limitations

- Avatar is a static URL; no upload functionality implemented (spec lists URL as acceptable)

## How to run locally

No build step required.

1. Clone or download this repository
2. Open `index.html` in any modern browser