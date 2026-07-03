# Deploy to Vercel (new project)

Quick steps to deploy this project as a new Vercel project.

1) Install & login (local)

```bash
# install the Vercel CLI (one-time)
npm i -g vercel

# login interactively
vercel login
```

2) First deploy (create a new project)

```bash
# from the repo root
vercel --prod

# or non-interactive if you have a token:
VERCEL_TOKEN=your_token_here vercel --prod --token $VERCEL_TOKEN
```

3) What Vercel will run

- Build command: `npm run build`
- Output directory: `dist`

These are configured in `vercel.json` using `@vercel/static-build`.

4) Continuous deploy (GitHub)

Option A — connect the GitHub repo via the Vercel dashboard (recommended):

- Import the repo in Vercel UI and choose the root project. Vercel will detect the static build and use `npm run build`.

Option B — GitHub Actions (deploy on push to `main`)

Create a repository secret `VERCEL_TOKEN` (personal token from Vercel) and a `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` (from the Vercel dashboard), then add the workflow below as `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
          alias-domains: ''
```

5) Notes & troubleshooting

- If your account uses a team, select it during the interactive `vercel` import or set `VERCEL_ORG_ID`/`VERCEL_PROJECT_ID` for CI.
- If you prefer the Vercel dashboard, use the "Import Project" flow and set build/output settings to `npm run build` and `dist`.
- The project already includes `vercel.json` so Vercel will use the correct builder.
