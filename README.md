# Indie Website — Client

Frontend client for the Indie Vault project, built with React and Vite.

This README documents local setup, available scripts, environment variables, and the most important files to edit when working on the client.

**Tech stack**

- React 19
- Vite
- Tailwind CSS
- Flowbite React
- react-router-dom
- axios

**Prerequisites**

- Node.js (16+ recommended)
- npm or pnpm

## Quick start

Install dependencies:

```bash
npm install
```

Start dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run linter:

```bash
npm run lint
```

## Environment

The client calls the backend via the base URL configured in `services/service.config.js`. If you need to change the API host, update that file or add an environment variable pattern and load it into the service config.

## Important files & structure

- `src/main.jsx` — app entry
- `src/App.jsx` — router + app layout
- `src/index.css` — global styles + Tailwind imports
- `pages/` — top-level routes (Home, GameList, GameDetails, GameForm, etc.)
- `components/` — shared UI components (MyNavbar, OnlyPrivate, OnlyPublic, Editor)
- `services/service.config.js` — axios instance and API base URL used by the client
- `public/` — static assets

## Adding a new field to the game flow

If the backend schema adds a required field (for example `genre`), do the following:

1. Add a `useState` in `pages/GameForm.jsx` for the new field.
2. Add an input control to the form and wire it to the state.
3. Include the field in the POST/PATCH request body sent to `/game`.
4. Display the field in `pages/GameDetails.jsx`, `pages/GameList.jsx`, and any other place that lists games.

I already applied this pattern for `genre` in the codebase where applicable — update the form input type (text vs select) depending on whether you want free text or a controlled vocabulary.

## Styling notes

- Tailwind is configured via `src/index.css` — dynamic background images are applied inline using `style={{ backgroundImage: `url(${bannerImg})` }}`.
- Flowbite components are available and used throughout; if you change Tailwind's config, restart the dev server.

## Deployment

This project is already configured for Vercel via `vercel.json`. Build using `npm run build` and deploy your production bundle with your preferred provider (Vercel, Netlify, etc.).

## Contributing

- Fork the repo, create a feature branch, run the app locally, and open a PR with a description of changes.

## License & Author

- Author: Oluyemi Ogunbadejo
