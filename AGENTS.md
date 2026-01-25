# Agent Instructions

This document provides guidelines for AI agents working in this repository.

## Project guidelines

- Do not generate or created sumary/resume files or similar.
- The project uses pnpm as package manager.

## Project Overview

This is a Next.js application using TypeScript, Tailwind CSS, and Supabase for the backend. The goal is to build a financial dashboard.

## Build, Lint, and Test Commands

### Development

- **Run the development server:** `npm run dev`
- **Build the application:** `npm run build`
- **Run the linter:** `npm run lint`
- **Generate Supabase types:** `npm run dbtypes`

### Testing

There are currently no tests in this project. When adding tests, please use Jest and React Testing Library.

- **Run all tests:** `npm test`
- **Run a single test file:** `npm test -- <path/to/test/file.spec.ts>`

## Code Style Guidelines

### Imports

- **Order:**
  1. React and Next.js imports (`react`, `next/*`)
  2. External library imports (`@supabase/supabase-js`, `recharts`)
  3. Internal absolute imports from `@/` (`@/components/*`, `@/lib/*`)
  4. Relative imports (`../`, `./`)
- **Alias:** Use the `@/` path alias for imports from the `src` directory.

### Formatting

- This project uses the default formatting from Prettier as configured in Next.js. Ensure you have a Prettier extension installed and configured in your editor.

### Types

- Use TypeScript for all new code.
- Generate Supabase types with `npm run dbtypes` after any schema changes.
- Use the generated `database.types.ts` for all Supabase client interactions.
- Define explicit types for function arguments and return values. Avoid `any` unless absolutely necessary.

### Naming Conventions

- **Components:** PascalCase (`TransactionHistory.tsx`)
- **Functions/Variables:** camelCase (`calculateNetWorth`)
- **Types/Interfaces:** PascalCase (`Transaction`, `UserProfile`)
- **Files:** kebab-case for non-component files (`api-helpers.ts`), PascalCase for components.

### Error Handling

- Use `try...catch` blocks for all asynchronous operations, especially for Supabase calls.
- For data fetching with TanStack Query, use the `error` state from `useQuery`.
- Show user-friendly error messages or toasts on the UI when an operation fails.

### State Management

- Use Zustand for global client-side state.
- Use TanStack Query for server state, caching, and data synchronization.

### Styling

- Use Tailwind CSS for all styling.
- Use `clsx` and `tailwind-merge` to conditionally apply classes.
- Create reusable component variants using `class-variance-authority`.

### API and Server-Side Logic

- Use Next.js Route Handlers for API endpoints.
- All Supabase interactions on the server should use the server-side client from `@supabase/ssr`.

### Git

- Do not commit secrets or environment variables. Use `.env.local`.
- Follow conventional commit message standards (e.g., `feat:`, `fix:`, `refactor:`).
- Keep pull requests small and focused on a single feature or fix.
