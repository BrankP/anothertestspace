# Leaflet Activities App

## Run locally

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

1. Update `homepage` in `package.json` to your real GitHub username and repo.
2. Build + deploy:

```bash
npm run build
npm run deploy
```

3. In GitHub: **Settings → Pages**
   - Source: **Deploy from a branch**
   - Branch: **gh-pages**
   - Folder: **/ (root)**

4. Wait a few minutes for the site URL to become active.

## If the site is blank on GitHub Pages

- Ensure `vite.config.ts` uses `base: './'`.
- Hard refresh the browser.
- Confirm `gh-pages` branch exists and contains `index.html`.
- Confirm Pages is configured to serve from `gh-pages` branch, not `main`.
