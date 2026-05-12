# Sireyo-Resort



Sireyo-Resort is an operations dashboard for resort staff. It centralizes reservations, guest records, accommodations, and reporting so the team can run daily operations from one place.

## System Purpose

- Provide a single source of truth for bookings and availability
- Reduce manual coordination by standardizing reservation workflows
- Give managers live visibility into occupancy, guests, and revenue metrics
- Keep staff actions auditable through consistent data entry

## How the System Works

1. Staff uses the React dashboard to search guests, view calendars, and create bookings.
2. The frontend calls the Laravel API to read and update bookings, guests, and accommodations.
3. Laravel persists data to the database and enforces validation and business rules.
4. Dashboards aggregate data for KPI cards and reports.

## Core Modules

- Calendar and reservation management
- Guest profiles and history
- Accommodation inventory and availability
- Dashboard KPIs and reports
- Settings and access control

## Tech Stack

- Frontend: React 19, Vite, Tailwind CSS
- Backend: Laravel 12 (PHP 8.2)
- Charts/UI: Recharts, Lucide icons

## Project Structure

- Frontend app: `src/`
- Backend API: `backend/`

## Prerequisites

- Node.js 18+
- PHP 8.2+
- Composer

## Frontend Setup (root)

1. Install dependencies:
   `npm install`
2. (Optional) Set AI key for related features:
   Create `.env.local` and set `GEMINI_API_KEY=your_key`
3. Start the dev server:
   `npm run dev`

## Backend Setup (backend/)

1. Install PHP dependencies:
   `composer install`
2. Create environment file and app key:
   `cp .env.example .env`
   `php artisan key:generate`
3. Configure database credentials in `.env`, then run migrations:
   `php artisan migrate`
4. Install backend JS deps and run Vite if needed:
   `npm install`
   `npm run dev`

You can also run the predefined setup script:
`composer run setup`

## Common Scripts

- `npm run dev` - start frontend dev server
- `npm run build` - build frontend
- `npm run lint` - TypeScript typecheck

## Notes

- Laravel logs and storage live under `backend/storage/`
- If you deploy, be sure to configure production `.env` variables for both apps
