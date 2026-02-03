# ModernTech HR — HR Dashboard System ✅

A simple HR dashboard built with **Vue 3** and **Vite** for the Module 1 Core Project. It includes employee management, attendance, payroll and leave request views, and uses a small local JSON-based data service for demo purposes.

---

## 🔧 Requirements

- Node.js >= 18
- npm >= 8

> On Windows, you may prefer running commands from Command Prompt or Git Bash to avoid PowerShell execution policy issues.

---

## 🚀 Quick start

1. Install dependencies

```bash
npm install
```

2. Start development server

- From Command Prompt or Git Bash:

```bash
npm run dev
```

- If you run into PowerShell execution policy errors, either run in Command Prompt/Git Bash or temporarily bypass policy in PowerShell:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
npm run dev
```

3. Open the app in your browser:

http://localhost:3000 (Vite may pick another port if 3000 is busy — the dev server prints the actual port)

If you want to force a specific port on Windows cmd:

```cmd
set PORT=3000 && npm run dev
```

Or pass the port inline:

```bash
npm run dev -- --port 3000
```

4. Build for production

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

---

## 📝 Important notes & fixes applied

While working on this project I fixed a couple of runtime issues that produced a blank/white page:

- **Fixed import path in** `src/stores/index.js`
  - From: `import DataService from '@/services/DataService.js'`
  - To: `import DataService from '../services/DataService.js'`

- **Use the exported instance of DataService** (it is exported as an instance in `services/DataService.js`)
  - `const dataService = DataService` (was `new DataService()`)

- **Removed incorrect store plugin usage** in `src/main.js`
  - `app.use(useStore())` was removed (the store exports `useStore` and is not a Vue plugin)

- **Provided `DataService` via app provide**: `app.provide('dataService', DataService)` so components can `inject('dataService')` or import the instance directly.

These changes address the runtime errors that resulted in a white screen.

---

## ⚙️ Optional improvements (recommended)

- Add alias `@` -> `src/` in `vite.config.js` so imports like `@/services/...` work project-wide.

Example:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') }
  },
  server: {
    port: 3000,
    open: true,
    host: true
  }
})
```

- Add guards in components against empty arrays (e.g., protect `avgSalary` / `avgTenure` from division by zero).

---

## 🤝 Contributing

- Feel free to open issues or submit PRs to improve error handling, add tests, or enhance the dataset.
