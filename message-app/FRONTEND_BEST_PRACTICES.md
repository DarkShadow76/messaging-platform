# Frontend Best Practices

This document outlines the key best practices to follow while developing the frontend for this project. Adhering to these principles will help us build a high-quality, maintainable, and scalable application.

### 1. Component Structure
*   **Keep Components Small and Focused:** Each component should have a single responsibility (Single Responsibility Principle). For example, a `LoginForm` component should only handle the form, not the entire page layout.
*   **Create Reusable Components:** If you find yourself writing the same UI code more than once (like a styled button or an input field), turn it into a generic, reusable component that can be imported and used anywhere.
*   **Separate Logic from Presentation:** Use custom hooks (e.g., `useAuth.ts`) or a services layer to contain your business logic. This keeps your UI components clean and focused on just rendering the UI.

### 2. State Management
*   **Use the Right Tool for the Job:**
    *   **Local State (`useState`):** Use for state that is only relevant to a single component (e.g., the value of an input field, whether a modal is open).
    *   **Global State (`Zustand`):** Use for state that needs to be shared across many components (e.g., the current logged-in user). This avoids "prop drilling."

### 3. Code Organization
*   **Maintain a Clear Folder Structure:** Keep your files organized in a logical way.
    *   `src/components/`: For small, reusable UI components.
    *   `src/pages/`: For top-level page components that correspond to routes.
    *   `src/store/`: For your Zustand global state stores.
    *   `src/services/`: For API calls.
    *   `src/hooks/`: For custom React hooks.
*   **Consistent Naming:** Use clear and consistent names for your files and components (e.g., `LoginPage.tsx`, `useAuthStore.ts`).

### 4. TypeScript Best Practices
*   **Type Everything:** The main benefit of TypeScript is safety. Define an `interface` or `type` for your component props, API responses, and state objects.
*   **Avoid `any`:** Using the `any` type defeats the purpose of TypeScript. Be as specific as possible with your types.

### 5. API Calls
*   **Centralize API Logic:** Don't make API calls directly inside your UI components. Put all your backend API functions in a dedicated `services` folder.
*   **Handle Loading and Error States:** Whenever you fetch data, always account for the loading state (show a spinner) and a possible error state (show an error message).

### 6. Styling
*   **Be Consistent:** We are using Material-UI (MUI). Stick with it and leverage its `ThemeProvider` to ensure a consistent look and feel. Avoid mixing it with lots of custom vanilla CSS.
*   **CSS-in-JS:** Use the `styled` utility from MUI or Emotion to co-locate styles with their components, which makes them more maintainable.
