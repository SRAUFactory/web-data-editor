# web-data-editor

Web-based data editing tool built with SvelteKit. Allows easy creation and editing of CSV/TSV/JSON data files.

## Features

- Create new csv/tsv/json data
- Edit existing csv/tsv/json files
  - Add/Delete rows and columns
  - Edit cell values
  - Convert between formats
- Save and download edited data
- Built-in user manual

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

```sh
pnpm run dev

# or start the server and open the app in a new browser tab
pnpm run dev -- --open
```

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions.

### Development Setup

1. Install dependencies:

```bash
pnpm install
```

2. Start development server:

```bash
pnpm run dev
```

### Production Build

To create and preview a production build locally:

```bash
npm run build
npm run preview
```

### GitHub Pages Deployment

The project is automatically deployed to GitHub Pages when changes are pushed to the `master` branch. The deployment process:

1. Builds the project using `adapter-static`
2. Deploys to GitHub Pages via GitHub Actions
3. Available at: https://sraufactory.github.io/web-data-editor/

To manually trigger a deployment:

1. Go to Actions tab in GitHub
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
