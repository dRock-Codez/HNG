# Advanced Todo Card (Stage 1a) 🚀

This project is an advanced, interactive Todo Card built with plain HTML, CSS, and Vanilla JavaScript. It builds upon the static Stage 0 submission by introducing state management, edit capabilities, and live time-tracking, while strictly adhering to semantic HTML and accessibility guidelines.

## 🛠️ What Changed from Stage 0
* **Edit Mode:** Users can now click "Edit" to reveal a fully functional form that updates the card's state (Title, Description, Priority, Due Date).
* **State Management:** Added a central state object in vanilla JS to synchronize the UI with user inputs.
* **Status Controls:** Added a dropdown and synced it with the "Mark done" checkbox to handle "Pending", "In Progress", and "Done" states.
* **Expand/Collapse:** Long descriptions are now truncated by default with an interactive "Show more / Show less" toggle.
* **Live Time Handling:** A Javascript interval recalculates the time remaining every 30 seconds and visually flags the card if it becomes "Overdue".

## 🎨 Design Decisions
* **Strict Vanilla Stack:** Avoided external frameworks to demonstrate core DOM manipulation and state synchronization concepts.
* **Visual State Feedback:** Implemented distinct visual cues for different states (e.g., strike-through for "Done", pulsing red dot for "High Priority", and a red accent border for "Overdue").
* **Responsive Layout:** Kept the glassmorphism aesthetic from Stage 0 but updated the CSS Flexbox/Grid rules to ensure the new edit form and status dropdowns stack gracefully on screens under 480px.

## ♿ Accessibility Notes
* **Keyboard Navigation:** Ensured logical tab flow (Checkbox -> Status Control -> Expand Toggle -> Edit -> Delete -> Save/Cancel). Trapped focus optimally returning to the edit button when the modal closes.
* **Live Regions:** Applied `aria-live="polite"` to the time-remaining section so screen readers announce dynamic time changes.
* **Aria Attributes:** Used `aria-expanded` and `aria-controls` for the description toggle to properly communicate state to assistive tech.
* **Form Labels:** All edit inputs are explicitly linked to `<label>` tags.

## ⚠️ Known Limitations
* Since there is no backend or local storage implemented for this stage, all edited data resets to the default state when the page is refreshed. 

## 🚀 How to Run Locally
1. Clone this repository.
2. Open the `index.html` file in any modern web browser. No build steps or servers required!