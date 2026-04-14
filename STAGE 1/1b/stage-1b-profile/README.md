# Testable Profile Card (Stage 1b) 🚀

A responsive, accessible, and automated-test-ready Profile Card component built with React and Vite. This project was developed to strictly adhere to semantic HTML patterns and specific `data-testid` requirements for automated grading.

## ✨ Features
* **Semantic Structure:** Utilizes standard HTML5 elements (`<article>`, `<figure>`, `<nav>`, `<header>`, `<section>`) for optimal structural meaning.
* **Live Epoch Time:** Implements a React `useEffect` hook to display the current system time in milliseconds (`Date.now()`), updating dynamically every 500ms without freezing the browser.
* **Test-Ready:** Every single interactive and data-driven element includes the exact `data-testid` attributes required by the testing suite.
* **WCAG AA Compliant:** Passes color contrast requirements and includes comprehensive `alt` text for images and `aria-label` navigation for screen readers. 

## 🛠️ Tech Stack
* **React 18** (Functional components & Hooks)
* **Vite** (Build tool)
* **Vanilla CSS** (Flexbox/Grid layout)

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/dRock-Codez/HNG.git