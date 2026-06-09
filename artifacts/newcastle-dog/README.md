# Newcastle.dog

A production-ready dog-friendly venue directory for Newcastle upon Tyne — and beyond.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Auth**: Iron Session (secure HTTP-only cookies)

## Features

### Public Website
- Homepage with hero, stats, featured venues, area browse
- Venue listing page with search & filters (category, area, amenities)
- Venue detail pages with full dog-friendly amenity display
- City pages (e.g. `/cities/newcastle`)
- Area pages (e.g. `/areas/jesmond`)
- Category pages (`/pubs`, `/restaurants`, `/cafes`, `/hotels`)
- SEO-friendly URLs with dynamic metadata
- Mobile-first responsive design

### Admin Back Office
- Secure admin login at `/admin/login`
- Dashboard with stats and recent venues
- Full venue CRUD (create, edit, delete)
- Manage cities (multi-city from day one)
- Manage areas
- Manage categories
- Manage amenities
- Review moderation (approve/reject)
- Claim request management
- Featured listing management
- Affiliate link management

## Setup

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL database

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and SESSION_SECRET

# Run Prisma migrations
cd artifacts/newcastle-dog
pnpm db:migrate

# Seed the database (106 venues including 6 named + 100 generated)
pnpm db:seed

# Start the development server
pnpm dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Min 32 characters, used to encrypt session cookies |

### Default Admin Credentials

After running the seed:
- **Email**: `admin@newcastle.dog`
- **Password**: `admin123`

**Change these immediately after first login.**

## Database Schema

Key models:
- `City` — multi-city from day one
- `Area` — neighbourhoods within a city
- `Category` — pubs, restaurants, cafés, hotels
- `Venue` — full venue record with all amenity flags
- `Review` — user reviews with approval workflow
- `ClaimRequest` — venue ownership claims
- `AffiliateLink` — managed affiliate links
- `Admin` — admin user accounts

## Brand Palette

| Name | Hex |
|---|---|
| Charcoal | `#41463D` |
| Lavender | `#9D8DF1` |
| Ice Blue | `#B8CDF8` |
| Mint | `#95F2D9` |
| Neon Mint | `#1CFEBA` |

## Extending to New Cities

The structure is multi-city from day one:

1. Add a new city via `/admin/cities`
2. Add areas for that city via `/admin/areas`
3. Add venues and assign them to the new city
4. City pages at `/cities/[slug]` are generated automatically

Future cities planned: Leeds, York, Durham, Manchester.

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Homepage
│   ├── venues/               # Venue listing + detail
│   ├── cities/[city]/        # City pages
│   ├── areas/[area]/         # Area pages
│   ├── pubs/                 # Pubs category
│   ├── restaurants/          # Restaurants category
│   ├── cafes/                # Cafés category
│   ├── hotels/               # Hotels category
│   └── admin/                # Full admin back office
├── components/
│   ├── layout/               # Header, Footer, AdminSidebar
│   ├── venue/                # VenueCard, AmenityBadge
│   ├── search/               # SearchBar with filters
│   └── admin/                # VenueForm
└── lib/
    ├── prisma.ts             # Prisma client singleton
    ├── session.ts            # Iron session config
    ├── actions.ts            # Server actions
    └── utils.ts              # Utility functions
prisma/
├── schema.prisma             # Database schema
└── seed.ts                   # Seed script
```

## Deployment

The app is configured for Replit deployment. Set `DATABASE_URL` and `SESSION_SECRET` in the environment secrets before deploying.

## Security Notes

- Admin routes are protected by middleware — all `/admin/*` paths (except `/admin/login`) redirect to login if not authenticated
- Sessions are stored in secure, HTTP-only, encrypted cookies using Iron Session
- Passwords are hashed with bcrypt (12 rounds)
- Never commit `.env` files
