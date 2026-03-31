# Workout Tracker Web

A modernized workout tracking app built with React 18, Vite, Redux Toolkit, and MUI.

It lets you browse scheduled workouts, run timed exercise sets, track completion progress, keep workout history, and control background music playlists during sessions.

## Tech Stack

- React 18
- Vite 5
- React Router 6
- Redux Toolkit + redux-persist
- MUI 5 (Material UI)
- Sass (SCSS)
- Vitest + Testing Library

## Features

- Daily workout dashboard on the home screen
- Workout and exercise navigation with timer-based sets
- Workout progress tracking (active session + completion history)
- Local persistence for progress/history
- Music player controls integrated with workout flow
- Error and retry states for data-loading views
- Local image fallbacks for exercise media

## Project Structure

```text
src/
	components/     UI building blocks
	hooks/          Reusable logic (timer, workouts, music player)
	slices/         Redux Toolkit slices
	views/          Route-level pages
	utils/          Utility helpers
public/
	data/           Workouts and exercises JSON data
	img/            Local exercise images and fallback assets
```

## Prerequisites

- Node.js 18+ (recommended)
- npm 9+

## Getting Started

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:3000
```

## Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - create production build
- `npm run preview` - preview production build locally
- `npm run test` - run tests once (CI mode)
- `npm run test:watch` - run tests in watch mode

## Data Sources

- Workouts: `public/data/workouts.json`
- Exercises: `public/data/exercises.json`

Exercise media now uses local image paths in `public/img/exercises` with runtime fallback to `public/img/dummy-img.jpg`.

## Verification Checklist

Before committing, run:

```bash
npm run test
npm run build
```

Optional consistency check for duplicate JSX/JS source files:

```bash
for f in src/**/*.jsx src/*.jsx; do b="${f%.jsx}"; if [ -f "$b.js" ]; then echo "$b"; fi; done | sort -u
```

Expected output for the duplicate-file check is empty.

## Version

Current app version: `0.2.0`