# GitHub Repo Finder

GitHub Repo Finder is a web app for discovering GitHub repositories. Search by keyword, narrow results by programming language, and sort by stars, forks, or recent activity.

![Github Repo Finder](lightmode.png)

## Features

- Search public GitHub repositories by keyword
- Filter searches by language and sort by stars, forks, or last updated
- Browse results with pagination (12 repositories per page)
- See featured repositories when you first open the app
- Reuse or clear recent searches, saved in your browser
- Switch between light, dark, and system themes

## Requirements

- Node.js 18 or newer
- npm

## Getting started

```sh
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The development command starts the Express server and Vite together.

Repository searches use GitHub's public Search API directly from the browser, so no credentials are needed for the main app. Unauthenticated requests are subject to GitHub's API rate limits.

## Optional GitHub OAuth configuration

The Express server includes GitHub OAuth URL and callback endpoints. These are not required for repository search. To enable them, create a GitHub OAuth App and set its callback URL to:

```text
http://localhost:3000/api/auth/github/callback
```

Create a `.env` file in the project root:

```dotenv
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
```

The OAuth endpoints are:

- `GET /api/auth/github/url` — returns the GitHub authorization URL
- `GET /api/auth/github/callback` — handles the OAuth callback

Do not commit `.env` or expose the client secret.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Express server with Vite middleware at `http://localhost:3000` |
| `npm run build` | Build the frontend into `dist/` |
| `npm run preview` | Preview the Vite production build |
| `npm run lint` | Run the TypeScript compiler without emitting files |

## Tech stack

- React 19 and TypeScript
- Vite 6
- Express
- Tailwind CSS 4
- GitHub REST API
