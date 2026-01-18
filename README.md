# Fnlly. Asset tracker.

A minimalistic finance tracker built with Next.js and Supabase.

## Features

- Track financial assets and their values
- Record expenses and manage recurring payments
- Visualize asset history with charts
- Secure authentication with Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ or later
- A Supabase account and project

### Setup

1. Clone the repository:
```bash
git clone https://github.com/Cocodrilette/finally.git
cd finally
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update the values:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

You can find these values in your [Supabase project settings](https://supabase.com/dashboard/project/_/settings/api).

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Database Setup

The application uses Supabase as the database. You'll need to set up the following tables:

- `user` - Stores user information
- `asset` - Stores asset information
- `currency` - Stores currency information
- `record` - Stores financial records
- `expense` - Stores expense information

Note: The database schema still references `clerk_id` for user identification. A database migration will be needed to fully transition to Supabase Auth user IDs.

## Authentication

This application uses [Supabase Auth](https://supabase.com/docs/guides/auth) for authentication. Users can sign up and sign in using email and password.

## Development

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## License

This project is open source and available under the MIT License.