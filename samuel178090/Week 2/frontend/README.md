# React + TypeScript + Vite

(URL = https://latencytest.netlify.app/) 

 Latency Detective Frontend A modern **React + TypeScript + Vite** web application for detecting and visualizing network latency in real-time. This project is part of the **Latency Detective** system — designed to monitor request response times and display performance insights. --- ## 🚀 Features - ⚛️ Built with **React 18** and **TypeScript** - ⚡ Powered by **Vite** for fast development and hot module replacement (HMR) - 🎨 Styled with **Tailwind CSS** - 🔗 API communication via **Axios** - 🧱 Organized folder structure with reusable components - 
  Ready for integration with backend latency tracking services --- ## 🧩 Folder Structure src/ ├── components/ # Reusable UI components ├── pages/ # Page-level views ├── hooks/ # Custom React hooks ├── services/ # API and network calls ├── assets/ # Images, icons, styles └── App.tsx # Main entry point yaml Copy code --- ## ⚙️ Installation & Setup ```bash # Clone the repository git clone https://github.com/yourusername/latency-detective-frontend.git # Navigate into the project folder cd latency-detective-frontend # Install dependencies npm install # Start the development server npm run dev Then open http://localhost:5173 in your browser. 🧠 Project Goals Measure and display API request latency in real time Provide a clean and responsive user interface Serve as the frontend component for the Latency Detective system 📈 Future Improvements Add authentication and role-based access Integrate real-time WebSocket latency updates Implement dashboard charts using Recharts or Chart.js Add dark/light mode support 🛠️ Developer Notes / Vite Template Info Uses @vitejs/plugin-react with Babel for Fast Refresh ESLint configuration recommendations for production apps: js Copy code export default defineConfig([ globalIgnores(['dist']), { files: ['**/*.{ts,tsx}'], extends: [ tseslint.configs.recommendedTypeChecked, tseslint.configs.strictTypeChecked, tseslint.configs.stylisticTypeChecked, ], languageOptions: { parserOptions: { project: ['./tsconfig.node.json', './tsconfig.app.json'], tsconfigRootDir: import.meta.dirname, }, }, }, ]) Optional React-specific lint rules: js Copy code import reactX from 'eslint-plugin-react-x' import reactDom from 'eslint-plugin-react-dom' export default defineConfig([ globalIgnores(['dist']), { files: ['**/*.{ts,tsx}'], extends: [ reactX.configs['recommended-typescript'], reactDom.configs.recommended, ], }, ]) 👨‍💻 Author Samuel Ajewole Master’s Student, Software Engineering Email: your.email@example.com 📜 License This project is open source and available under the MIT License. }, }, ]) ``` 
 
  latency-detective-frontend

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```jsI
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
