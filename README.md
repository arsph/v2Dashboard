# Dashboard Application

A modern dashboard application built with Next.js and Vercel Postgres.

## Features

- Sales tracking and management
- Expense tracking
- Real-time data updates
- Modern UI with Tailwind CSS
- TypeScript support
- Server-side rendering with Next.js

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Vercel Postgres
- Shadcn UI Components

## Getting Started

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following:
```
POSTGRES_URL=your_postgres_connection_string
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

The application uses Vercel Postgres. The database schema is defined in `schema.sql`. Make sure to run these SQL commands in your Vercel Postgres database:

```sql
CREATE TABLE sales (
  id SERIAL PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  traffic_amount INTEGER NOT NULL,
  duration_months INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  server VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP NOT NULL
);
```

## Deployment

This project is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## License

MIT
