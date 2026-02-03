# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Euro Inmo is a real estate platform for the Eastern Antioquia region (Colombia) built with Nuxt 3 and Supabase. It features a public property browsing site and a protected admin dashboard for property management.

## Commands

```bash
npm run dev      # Development server at localhost:3000
npm run build    # Production build
npm start        # Run production server (.output/server/index.mjs)
```

**Node version:** 20.x required

## Architecture

### Tech Stack
- **Nuxt 3.14** with SSR enabled
- **Supabase** for auth, database, and storage
- **Pinia** for state management
- **TypeScript** configured

### Key Directories
- `pages/` - File-based routing (public + admin sections)
- `components/` - Reusable Vue components
- `stores/` - Pinia stores (`auth.js`, `properties.js`)
- `middleware/auth.js` - Route protection
- `plugins/` - Client-side auth and Supabase initialization
- `agents/` - Role-based documentation for AI agents

### Routes
**Public:** `/`, `/properties`, `/property-[code]`, `/about`, `/contact`, `/login`

**Protected (admin):** `/admin/dashboard`, `/admin/properties/*`, `/admin/agents/*`, `/admin/categories/*`, `/admin/amenities/*`, `/admin/locations/*`

## Code Conventions

- **Spanish comments** required above all functions
- **camelCase** for variables and functions (never snake_case)
- **Composition API** with `<script setup>` syntax
- All state through **Pinia stores** in `/stores` folder
- **Supabase RLS** is the single source of truth for security

## Authentication & Roles

Supabase JWT-based authentication with two roles:
- **Admin** (role_id: 1) - Full system access, user management
- **Asesor** (role_id: 2) - Property management, sharing, analytics

```javascript
// Key auth getters from stores/auth.js
authStore.isAuthenticated  // boolean
authStore.isAdmin          // role_id === 1
authStore.isAsesor         // role_id === 2
```

Middleware protects all `/admin/**` routes, redirecting unauthorized users to `/login`.

## Supabase Tables

| Table | Description |
|-------|-------------|
| profiles | User profiles with role relationship |
| properties | Real estate listings |
| roles | Admin, Asesor |
| category | Apartamento, Casa, Finca, Lote, Local |
| status | Arriendo/Venta |
| amenities | Property characteristics |
| state/city/zone | Geographic hierarchy |
| properties_view | Analytics - views per property |

## Environment Variables

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
NODE_ENV=development|production
NITRO_HOST=0.0.0.0      # For production
NITRO_PORT=3000         # For production
```

## Deployment

- Preset: `node-server` (Nitro)
- Configured for Coolify/Docker via `nixpacks.toml`
- SSR enabled for SEO
- Build output: `.output/server/index.mjs`

## Design System

CSS variables in `css/main.css`:
- Primary: `#0b6182`
- Secondary: `#82bad3`
- Material Icons via Google Fonts
