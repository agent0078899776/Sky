# SkySwitch Technologies Component Explorer & Simulation System

A modern, high-performance, hermetically sealed component catalog and interactive simulation matrix dashboard. Engineered to present high-reliability sealed relays, latching mechanisms, radio frequency coaxial switches, and solid-state MOSFET contactors for critical aviation, space, railway, and defense installations.

**Live Application features:**
- **Product Matrix Explorer**: Interactive table categorized into 5 major component divisions with deep metric search and multi-selection support.
- **Parametric Contrast Array (Latching Comparison)**: Compares selected models side-by-side, automatically highlighting mismatched values (e.g., thermal tolerances, contact load sizes) in amber.
- **Interactive Vector (SVG) Schematic Simulator**: Dynamic vector diagram showing live switch contact transitions and coil energization states.
- **Formspree Integrated Quotation Desk**: Seamless corporate contact form supporting automatic inclusion of selected models for single-button RFQ.

---

## 🛠️ Stack & Architecture

- **Runtime & Build**: [React 19](https://react.dev/), [Vite 6](https://vite.dev/), [Vite Tailwind Plugin](https://tailwindcss.com/)
- **Type Safety**: TypeScript 5.8+ (Strict type contracts defined in `types.ts`)
- **Animations**: [Motion](https://motion.dev/) (Sleek fade-ins, parametric transitions, and modal mount animations)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 📦 Directory Structure

```bash
├── .env.example          # Environment declarations template
├── index.html            # Primary single-page entry point
├── package.json          # Dependency declarations and build automation scripts
├── tsconfig.json         # TypeScript compiler configurations
├── vite.config.ts        # Vite configuration binding tailwindcss pre-processors
└── src/
    ├── App.tsx           # Application layout wrapper, routing logic, and navigation state
    ├── index.css         # Global styles using modern Tailwind CSS @theme additions
    ├── main.tsx          # React application root attachment loader
    ├── types.ts          # Strictly defined data contracts & interfaces
    ├── data.ts           # Technical specifications catalog containing all components data
    └── components/
        ├── Home.tsx      # Corporate Landing, value props, statistics, and gallery blocks
        ├── Catalog.tsx   # Core component explorer, comparison algorithms, and simulation drawers
        ├── AboutUs.tsx   # Company history, qa standards, values, and laboratory evaluation criteria
        └── FeedbackRequestForm.tsx # Responsive contact desk, autocomplete selector, and submission state
```

---

## 🚀 Local Installation & Execution

To clone and run the application locally on your workstation, execute the following steps:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Boot Development Environment**:
   ```bash
   npm run dev
   ```
   The dev server will boot and serve the assets dynamically.

3. **Build Production Distribution**:
   ```bash
   npm run build
   ```
   Compiles static production-ready bundles inside the `dist/` workspace.

---

## 📑 License

Licensed under the Apache-2.0 License. See the LICENSE details in files.
