# Code Review — Workout Tracker Web

**Date:** March 2026  
**Scope:** Full codebase review  
**Project type:** Solo-developer legacy project, unfinished MVP  

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Dependency Analysis](#3-dependency-analysis)
4. [Code Quality Issues](#4-code-quality-issues)
5. [Security Issues](#5-security-issues)
6. [Performance Issues](#6-performance-issues)
7. [Bugs & Logic Errors](#7-bugs--logic-errors)
8. [Incomplete / Placeholder Features](#8-incomplete--placeholder-features)
9. [Testing](#9-testing)
10. [Strengths](#10-strengths)
11. [Summary of Recommendations](#11-summary-of-recommendations)

---

## 1. Executive Summary

The Workout Tracker is a React SPA bootstrapped with Create React App. It allows users to browse a weekly workout schedule, view exercises, and run through exercise sets with a countdown timer and an integrated YouTube music player. The project is **unfinished** — most views are placeholder stubs, there is no user data persistence, and the dependency stack is severely outdated (React 16, CRA 3, Material UI 4).

The core exercise flow (timer + set progression + music) is the most developed area and represents a solid feature base. However, the codebase suffers from inconsistent patterns, several bugs, leftover debug code, and architectural choices that will block future development if not addressed.

**Overall priority:** Modernize the stack, fix bugs, remove dead code, and then build out the missing MVP features.

---

## 2. Architecture Overview

### Stack

| Layer | Technology | Version | Status |
|---|---|---|---|
| Framework | React | 16.13.1 | ⚠️ Severely outdated (current: 19.x) |
| Build tool | Create React App | 3.4.1 | ⚠️ Deprecated / unmaintained |
| State management | Redux + redux-thunk | 4.0.5 / 2.3.0 | ⚠️ Outdated (current: Redux Toolkit) |
| Routing | react-router-dom | 5.2.0 | ⚠️ Outdated (current: 6.x / 7.x) |
| UI library | @material-ui/core | 4.9.14 | ⚠️ Outdated (now @mui/material v6) |
| Styling | node-sass + SCSS | 4.14.1 | ❌ Deprecated (replaced by dart sass) |
| PWA | CRA service worker | — | ✅ Registered |

### Project Structure

```
src/
├── actions/        # Redux action creators + constants
├── components/     # Reusable UI components
├── css/            # SCSS stylesheets
├── data/           # Static JSON (drawer menu)
├── hooks/          # Custom React hooks
├── reducers/       # Redux reducers
├── utils/          # Utilities (events, formatting)
├── views/          # Route-level page components
├── core.js         # Data fetching layer
├── store.js        # Redux store configuration
└── theme.js        # Material UI theme
```

**Strengths of the architecture:**
- Clean separation: actions, reducers, components, views, hooks
- Custom hooks for domain logic (useTimer, useMusicPlayer, useWorkouts)
- Data fetching abstracted in `core.js`

**Weaknesses of the architecture:**
- **Inconsistent component paradigms:** Mix of class components (`DrawerMenu`, `TopAppBar`, `Workouts`) and functional components. No reason for class components here.
- **Inconsistent Redux patterns:** Mix of `connect()`/`mapStateToProps` (old pattern) and `useSelector`/`useDispatch` hooks (modern pattern).
- **EventEmitter for cross-component communication:** The music player uses a Node.js `EventEmitter` singleton to communicate between `useMusicPlayer` hook and `MusicPlayer` component. This bypasses React's data flow and Redux, creating an invisible side-channel.
- **Module-level mutable state:** `let player = null` in `musicPlayer.js` and `let bar = null` in `timer.js` — globals outside React's control. These break in Strict Mode and during re-renders.
- **No data layer / backend:** All data is static JSON in `public/data/`. Users cannot create, edit, or persist anything.
- **No error boundaries:** A crash in any component will take down the entire app.

---

## 3. Dependency Analysis

### Critical Issues

| Dependency | Problem |
|---|---|
| `react` 16.13.1 | 3 major versions behind. Missing hooks improvements, concurrent features, automatic batching. |
| `react-scripts` 3.4.1 | CRA is deprecated as of 2023. No security patches. Webpack 4. |
| `node-sass` 4.14.1 | **Deprecated**. Uses native C++ bindings that fail on modern Node.js (>16). This is likely why `yarn` fails. |
| `@material-ui/core` 4.x | End-of-life. Rebranded to `@mui/material`. No more patches. |
| `react-router-dom` 5.x | v5 is in maintenance mode. v6 has incompatible API changes. |
| `typescript` 3.9.6 | Listed as dependency but **never used** — no `.ts`/`.tsx` files exist. |
| `serve` 11.3.2 | Bundled as a production dependency instead of devDependency. |

### Dependency Cleanup Needed

- `typescript` — remove or actually adopt TypeScript
- `serve` — move to `devDependencies`
- `events` — Node.js polyfill, should be replaced with proper React patterns

---

## 4. Code Quality Issues

### 4.1 Console.log Statements Left in Code

| File | Line | Code |
|---|---|---|
| `components/exerciseSet.js` | 17 | `console.log("rendering!!");` |
| `components/workoutsList.js` | 44 | `{console.log("render")}` |
| `views/test.js` | 40–44 | `console.log(111111)` and `console.log(22222)` in JSX |

**Fix:** Remove all debug console.log statements.

### 4.2 Inconsistent Component Patterns

Three class components should be converted to functional components:

- **`components/drawerMenu.js`** — Class component with `connect()`. Has unused local state (`this.state = { isOpen: false }`), the actual state comes from Redux. Should be a functional component with `useSelector`/`useDispatch`.
- **`components/topAppBar.js`** — Class component with `connect()`. Pure render logic, no reason for class.
- **`views/workouts.js`** — Class component wrapping a simple render. No state or lifecycle.

### 4.3 `mapStateToProps` Returns Entire State

In `topAppBar.js`:
```js
const mapStateToProps = state => state;
```
This causes the component to re-render on **every** Redux state change (workouts loading, drawer toggling, music player updates). Should only select needed slices.

### 4.4 Reducer Anti-Pattern

All reducers use this pattern:
```js
const newState = { ...state };
newState.isLoading = true;
return newState;
```
While functional (shallow copy then mutate), the idiomatic pattern is:
```js
return { ...state, isLoading: true };
```
Or better — use Redux Toolkit's `createSlice` with Immer.

### 4.5 Naming Inconsistencies

- Action creators use `getWorkOutsAction` (camelCase with capital O) inconsistently.
- Files are all lowercase (`drawerMenu.js`) which is fine, but component exports vary.

### 4.6 Dead / Test Code in Production Routes

- `views/test.js` — A developer sandbox view exposed at `/test` route and listed in the drawer menu. Should be removed from production.
- `// window.Chat` comment at top of test.js — leftover.

### 4.7 Hardcoded YouTube Playlist ID

In `musicPlayer.js`:
```js
const playlistId = "PLOIpw4rxNuT6xSJyebE1mSI-3pkkt4fEj";
```
Should be configurable or come from workout data (which it partially does via `playlist` prop).

---

## 5. Security Issues

### 5.1 Hardcoded Authorization Token

In `core.js`:
```js
const authorization = 'dummy-token';
```
Every API request sends this hardcoded token in the `Authorization` header. Currently harmless since data is fetched from static JSON, but:
- Establishes a dangerous pattern for when a real backend is added.
- If this token were real, it would be exposed in the client bundle.

**Fix:** Remove the Authorization header for static file fetching. Implement proper auth when a backend is added.

### 5.2 Third-Party Script Injection

In `musicPlayer.js`, the YouTube IFrame API is loaded by dynamically creating a `<script>` tag:
```js
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
```
This is the standard YouTube embed approach and is acceptable, but should use Subresource Integrity (SRI) if possible, and the script URL should be a constant.

### 5.3 `event.persist()` Usage

In `views/test.js`:
```js
event.persist();
```
This is a React 16 pattern for synthetic events. Unnecessary in React 17+ and can lead to unexpected behavior.

---

## 6. Performance Issues

### 6.1 TopAppBar Re-renders on Every State Change

As noted, `mapStateToProps = state => state` subscribes to the entire Redux store.

### 6.2 Music Player Event Listener Leak

In `musicPlayer.js`, `useEffect` on mount adds event listeners via `events.on()` but **never removes them**:
```js
events.on(START_MUSIC_PLAYER_EVENT, () => { play(); });
events.on(STOP_MUSIC_PLAYER_EVENT, () => { stop(); });
events.on(PAUSE_MUSIC_PLAYER_EVENT, () => { pause(); });
```
If `MusicPlayer` remounts, listeners stack up. The cleanup function should call `events.off()`.

### 6.3 Timer Interval Granularity

The timer uses `intervalDuration = 100` (100ms), incrementing a counter each tick. But time calculations treat the counter as seconds for display. The timer actually increments 10× per second, so a counter of "10" = 1 second. The `getTimeString` utility divides by 60 expecting seconds. This creates a **10× speed bug** — the timer runs 10x too fast.

**Wait — let me re-check:** `totalTime = currentSet.time * 60`. If `time` is "2" (minutes), `totalTime = 120`. The timer increments every 100ms. After 1 second, `timer = 10`. `timeLeft = 120 - 10 = 110`. But `getTimeString(110)` shows "1:50" — which is wrong because only 1 actual second has passed.

**This is a confirmed bug.** The timer interval should be 1000ms (1 second), or the time calculation needs to account for the 100ms granularity.

### 6.4 Multiple setTimeout Calls for Set Transitions

In `views/exercise.js`, `prevSet` and `nextSet` use:
```js
setTimeout(() => { startSet(); }, 100);
```
This is fragile — relies on React state updates completing within 100ms. Could cause race conditions.

---

## 7. Bugs & Logic Errors

### 7.1 Timer Speed Bug (Critical) ⚠️

As described in 6.3 — the timer runs approximately **10× faster** than intended due to 100ms interval with second-based time calculations.

### 7.2 Song Title Display Bug

In `musicPlayer.js`:
```js
const songTitle = useMemo(() => {
    const cleanAuthor = author?.replace(" - Topic", " : ");
    return cleanAuthor + title || "Loading...";
}, [author, title]);
```
Due to operator precedence, `cleanAuthor + title || "Loading..."` evaluates as `(cleanAuthor + title) || "Loading..."`. If both are undefined, it produces `"undefinedundefined"` (truthy string), never showing "Loading...".

**Fix:** `return (cleanAuthor && title) ? cleanAuthor + title : "Loading...";`

### 7.3 Exercise Component Links to Non-Existent Route

In `components/exercise.js`:
```js
<Link to={`/workouts/${workoutName}/exercise/${exerciseNumber}/${exercise.name}`}>
```
But the route is defined as:
```js
<Route path="/workouts/:id/exercise/:exerciseNumber" component={Exercise} />
```
The extra `/${exercise.name}` segment doesn't match any route. In React Router v5 this may partially match, but the exercise name in the URL is never used.

### 7.4 Broken Unit Test

`App.test.js` searches for text "learn react" which doesn't exist in the app. This is the default CRA test template, never updated. The test will fail.

### 7.5 DrawerMenu Has Unused Local State

```js
constructor(props) {
    super(props);
    this.state = { isOpen: false };
}
```
The `isOpen` state is managed by Redux and passed as a prop. This local state is never used.

### 7.6 Data Mutation in core.js

```js
return workouts.map(workout => {
    workout.exercises = workout.exercises.map(...);
    return workout;
});
```
This mutates the original workout objects. Currently not an issue since data comes fresh from fetch each time, but it's a bad pattern.

---

## 8. Incomplete / Placeholder Features

| Feature | Status | Notes |
|---|---|---|
| **Home view** | 🔴 Placeholder | Just shows a spinning star icon and "Home view" text |
| **Profile view** | 🔴 Placeholder | Just shows a user icon and "Profile view" text |
| **About view** | 🔴 Placeholder | Just shows an info icon and "About view" text |
| **Workout progress tracking** | 🔴 Missing | No way to mark sets/exercises as completed |
| **Workout history** | 🔴 Missing | No record of past workouts |
| **User authentication** | 🔴 Missing | No login, registration, or user accounts |
| **Data persistence** | 🔴 Missing | All data is static JSON; nothing is saved |
| **Custom workouts** | 🔴 Missing | Users cannot create or edit workouts |
| **Responsive design** | 🟡 Partial | Some mobile CSS exists but not comprehensive |
| **REST state in exercise view** | 🟡 Basic | "Rest phase" text shown, but no visual distinction |
| **Exercise images** | 🟡 External URLs | Images hotlinked from external sites — could break anytime |
| **Error handling on data fetch** | 🟡 Basic | Error stored in Redux but never displayed to user |
| **Offline support (PWA)** | 🟡 Registered | Service worker registered but offline UX not tested |

---

## 9. Testing

- **Only one test exists:** `App.test.js` — and it's **broken** (looks for "learn react").
- **No component tests, hook tests, or integration tests.**
- **0% meaningful test coverage.**

---

## 10. Strengths

Despite being abandoned, the project has a solid foundation:

1. **Clean folder structure** — Logical separation of concerns (actions, reducers, hooks, components, views).
2. **Custom hooks** — `useTimer`, `useMusicPlayer`, `useWorkouts` encapsulate domain logic well.
3. **Exercise flow works** — Timer + set progression + automatic rest phase + auto-advance is functional (aside from the timer speed bug).
4. **YouTube music integration** — Clever use of YouTube IFrame API for workout music with playlist support per workout day.
5. **PWA setup** — Service worker registration with Redux-based status tracking.
6. **Workout-day highlighting** — `WorkoutListItem` highlights today's workout.
7. **Data model is sensible** — Workouts → Exercises → Sets with time/rest/reps is a good domain model.

---

## 11. Summary of Recommendations

### Critical (Must Fix)

1. Fix the **timer speed bug** — change interval to 1000ms or adjust time calculation
2. Fix the **songTitle display bug** (shows "undefinedundefined")
3. Remove **hardcoded auth token** from `core.js`
4. Replace **node-sass** with `sass` (dart-sass) to unblock installation
5. Remove **console.log** statements from production code
6. Fix or remove the **broken unit test**

### High Priority (Should Fix)

7. **Modernize dependencies** — Upgrade React, replace CRA with Vite, upgrade to MUI v5/v6, upgrade React Router
8. **Convert class components** to functional components with hooks
9. **Standardize Redux patterns** — Use Redux Toolkit or at minimum consistently use hooks (`useSelector`/`useDispatch`) everywhere
10. **Fix event listener memory leak** in MusicPlayer
11. **Fix TopAppBar** `mapStateToProps` to select only needed state
12. **Remove the test view** from production routes and drawer menu
13. **Fix exercise route URL mismatch**

### Medium Priority (Should Improve)

14. Add **error boundaries** (React error boundary component)
15. Replace **EventEmitter** with Redux actions or React context
16. Add **proper error display** when data fetching fails
17. Host **exercise images locally** or use a reliable CDN
18. Add **PropTypes** or adopt **TypeScript** (dependency already listed)
19. Clean up unused dependencies (`typescript`, `events`)
20. Move `serve` to `devDependencies`

### Lower Priority (Nice to Have for MVP)

21. Add meaningful **unit and integration tests**
22. Implement **workout progress tracking** (the core missing MVP feature)
23. Add **local storage persistence** for workout progress
24. Build out **Home view** with today's workout summary
25. Improve **responsive / mobile design**
