# Magic Dice 🎲✨

> **2nd Edition** — A lightweight digital character sheet manager and dice roller designed for D&D 5th Edition and TTRPGs.

🌐 **Live:** [https://magictwice.vercel.app](https://magictwice.vercel.app/#/)

---

## 🌟 Features

- **Character Management**: Create, load, and update character sheets with ability scores, health tracking, player bio, and custom banners/avatars.
- **Quick Rolls & Macro Shortcuts**: Save custom roll formulas (e.g., `quickroll d10 + str`) and use attribute shorthands (`str`, `dex`, `cnst`, `int`, `wis`, `chr`).
- **Spellbook & Notes**: Manage player spell lists, debug spell data, and maintain custom character notes.
- **Data Import & Export**: Back up and restore character data easily via JSON file exports.

---

## 🛠️ Tech Stack

- **Framework**: [Vue 3](https://vuejs.org/) + [Vue Router](https://router.vuejs.org/) + [Pinia](https://pinia.vuejs.org/)
- **UI & Styling**: [Bootstrap 5](https://getbootstrap.com/) & [Bootstrap Icons](https://icons.getbootstrap.com/), Sass
- **Utilities**: [MathJS](https://mathjs.org/), [Vue3 Markdown](https://github.com/huzidip/vue3-markdown), [ColorThief](https://lokeshdhakar.com/projects/color-thief/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v16+ recommended) and npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nikigee/magictwice.git
   cd magictwice
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

---

## 📜 Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run serve` | Starts the development server with hot-reloading |
| `npm run build` | Compiles and minifies the application for production |
| `npm run lint` | Runs ESLint to check and fix code formatting |
