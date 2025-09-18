# SAGAR Data Ingestion (React + Vite)

## Setup
1. Copy `.env.example` to `.env` and fill values:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_LOGIN_USERNAME=...
VITE_LOGIN_PASSWORD=...
```
2. Install deps:
```
npm install
```
3. Run dev server:
```
npm run dev
```

## Build
```
npm run build
npm run preview
```

## Deploy (Netlify)
- Create a new site from this folder
- Set environment variables in Netlify UI (same as `.env`)
- Build command: `npm run build`
- Publish directory: `dist`
