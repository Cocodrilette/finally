# Migration Guide: Clerk to Supabase Auth

This document outlines the steps taken to migrate from Clerk authentication to Supabase Auth.

## Changes Made

### 1. Package Dependencies

**Removed:**
- `@clerk/nextjs`

**Added:**
- `@supabase/ssr` - For Next.js SSR authentication support

### 2. Supabase Client Setup

Created new client utilities in `src/lib/supabase/`:

- `client.ts` - Browser client for client components
- `server.ts` - Server client for server components and API routes
- `middleware.ts` - Middleware helper for authentication

### 3. Authentication Pages

**Updated:**
- `src/app/sign-in/page.tsx` - New sign-in page with email/password
- `src/app/sign-up/page.tsx` - New sign-up page with email/password

### 4. Middleware

Updated `src/middleware.ts` to use Supabase Auth session management instead of Clerk.

### 5. Components Updated

The following components were updated to use Supabase Auth:

- `src/components/header.tsx` - Uses `createClient()` from `@/lib/supabase/client`
- `src/components/home-view.tsx` - Uses `supabase.auth.getUser()`
- `src/components/new-expense-form.tsx` - Uses `supabase.auth.getUser()`
- `src/components/new-finance-record-form.tsx` - Uses `supabase.auth.getUser()`

### 6. Layout

Removed `ClerkProvider` from `src/app/layout.tsx`.

## Database Migration Required

The database schema currently uses `clerk_id` to reference users. To complete the migration, you'll need to:

### Option 1: Update Existing Users

If you have existing users, you'll need to:

1. Create a mapping table between Clerk user IDs and Supabase Auth user IDs
2. Run a migration script to update all `clerk_id` references
3. Update the database schema to rename `clerk_id` to `user_id`

### Option 2: Fresh Start

If you're starting fresh or can reset the database:

1. Update the `user` table schema:
   ```sql
   ALTER TABLE "user" RENAME COLUMN "clerk_id" TO "user_id";
   ```

2. Update foreign key references in other tables:
   ```sql
   -- For the record table
   ALTER TABLE "record" RENAME COLUMN "user" TO "user_id";
   
   -- For the expense table
   ALTER TABLE "expense" RENAME COLUMN "user" TO "user_id";
   ```

3. Update the application code to use `user_id` instead of `clerk_id`:
   - `src/db/index.ts` - Update all references
   - Re-generate database types with `npm run dbtypes`

## Testing

To test the authentication flow:

1. Ensure Supabase environment variables are set in `.env.local`
2. Run the development server: `npm run dev`
3. Navigate to `/sign-up` and create a new account
4. Check your email for the confirmation link
5. Sign in at `/sign-in`
6. Verify that protected routes work correctly

## Environment Variables

Required environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Notes

- The current implementation still uses `clerk_id` in the database layer (`src/db/index.ts`)
- This maintains compatibility with existing database schema
- A database migration is required to fully complete the transition
- Supabase Auth provides similar functionality to Clerk but with deeper integration with Supabase services
