# Next Steps Plan — Workout Tracker Web

**Date:** March 2026  
**Goal:** Finish the project and ship a usable MVP  

---

## Vision

A simple, fast, mobile-first workout tracker where a user can:
- See today's workout at a glance
- Follow guided exercises with a timer and set progression
- Track their progress over time
- Listen to music while working out

---

## Phase 0: Unblock Development (Day 1)

> **Goal:** Get the project to build and run on a modern Node.js environment.

| # | Task | Details |
|---|---|---|
| 0.1 | Replace `node-sass` with `sass` | `yarn remove node-sass && yarn add sass`. No code changes needed — dart-sass is a drop-in replacement for SCSS compilation. |
| 0.2 | Remove unused `typescript` dependency | `yarn remove typescript` — it's listed but no TS files exist. |
| 0.3 | Move `serve` to devDependencies | `yarn remove serve && yarn add --dev serve` |
| 0.4 | Verify `yarn && yarn start` works | Fix any remaining build errors. |
| 0.5 | Remove all `console.log` statements | Clean `exerciseSet.js`, `workoutsList.js`, `test.js`. |

---

## Phase 1: Critical Bug Fixes (Days 2–3)

> **Goal:** Fix bugs that make core features unusable.

| # | Task | Details |
|---|---|---|
| 1.1 | **Fix timer speed bug** | In `hooks/useTimer.js`, change `intervalDuration` from `100` to `1000`, or adjust the time math to account for 100ms ticks. The timer currently runs ~10× too fast. |
| 1.2 | **Fix song title display** | In `components/musicPlayer.js`, fix the operator precedence: `return (cleanAuthor && title) ? \`${cleanAuthor}${title}\` : "Loading...";` |
| 1.3 | **Fix exercise route mismatch** | In `components/exercise.js`, remove `/${exercise.name}` from the Link — it doesn't match any defined route. |
| 1.4 | **Fix event listener leak** | In `components/musicPlayer.js`, return a cleanup function from `useEffect` that calls `events.off()` for each listener. |
| 1.5 | **Remove hardcoded auth token** | In `core.js`, remove the `Authorization` header from `getByUri`. |
| 1.6 | **Fix broken unit test** | Delete or rewrite `App.test.js` — it tests for "learn react" which doesn't exist. |

---

## Phase 2: Code Modernization (Days 4–7)

> **Goal:** Establish a clean, modern codebase to build features on.

### 2.1 Convert Class Components to Functional

| Component | Effort |
|---|---|
| `components/drawerMenu.js` | Small — convert to function, use `useSelector`/`useDispatch`, remove unused local state. |
| `components/topAppBar.js` | Small — convert to function, fix `mapStateToProps` to select only needed state. |
| `views/workouts.js` | Trivial — already just a render wrapper. |

### 2.2 Standardize Redux Patterns

- Replace all `connect()`/`mapStateToProps` usage with `useSelector`/`useDispatch` hooks.
- Remove `withStyles` HOC usage — use Material UI's `makeStyles` or `sx` prop (depending on MUI version after upgrade).

### 2.3 Replace EventEmitter with Redux

- Remove `utils/events.js` and the `events` npm package.
- Music player control (play/pause/stop) should be dispatched as Redux actions and consumed by the MusicPlayer component via `useSelector`.
- This removes the hidden side-channel and makes the data flow traceable.

### 2.4 Remove Dead Code

- Remove `views/test.js` and its route in `App.js`.
- Remove the "Test" entry from `data/drawerMenu.json`.
- Remove `// window.Chat` and other leftover comments.

### 2.5 Add Error Boundary

- Create a top-level `ErrorBoundary` component wrapping the app routes.
- Display a friendly error message instead of white screen on crash.

---

## Phase 3: Dependency Upgrade (Days 8–14)

> **Goal:** Modernize the full stack. This is a larger effort but essential for long-term viability.

### Option A: Incremental Upgrade (Lower Risk)

| Step | From | To |
|---|---|---|
| 3.1 | React 16 | React 18 |
| 3.2 | react-router-dom 5 | react-router-dom 6 |
| 3.3 | @material-ui/core 4 | @mui/material 5 |
| 3.4 | Redux + redux-thunk | @reduxjs/toolkit |
| 3.5 | CRA 3 | Vite (with `@vitejs/plugin-react`) |

**Note:** Steps 3.2 and 3.3 require API changes. React Router v6 replaces `<Switch>` with `<Routes>`, `component` prop with `element`, and removes `match.params` in favor of `useParams()`. MUI v5 changes the styling system entirely.

### Option B: Fresh Scaffold (Higher Risk, Cleaner Result)

Scaffold a new Vite + React 18 + MUI 5 project and migrate components one by one. Recommended if you're comfortable with the effort — the codebase is small enough (~25 files) to migrate in a few days.

---

## Phase 4: MVP Features (Days 15–30)

> **Goal:** Build the missing features that make the app actually useful.

### 4.1 Home View — Today's Workout Dashboard

**Priority: High**

Replace the placeholder home view with:
- Today's workout name and exercises list
- Quick "Start Workout" button
- Summary of last workout completed (when persistence is added)

### 4.2 Workout Progress Tracking (Core MVP Feature)

**Priority: Critical**

This is the single most important missing feature.

**Implementation:**
- Track per-set completion status: `not-started → in-progress → completed`
- Visual progress indicator on the exercise view (e.g., "Set 3 of 7")
- Mark exercises as completed when all sets are done
- Mark workout as completed when all exercises are done
- Show a completion summary at the end

**State model:**
```js
{
  workoutProgress: {
    date: "2026-03-31",
    workoutName: "tuesday",
    exercises: [
      {
        name: "warm-up",
        sets: [
          { completed: true, actualReps: 40 },
          { completed: true, actualReps: 20 },
          { completed: false, actualReps: 0 },
        ]
      }
    ]
  }
}
```

### 4.3 Local Storage Persistence

**Priority: High**

Before building a backend, persist data in localStorage:
- Workout progress / history
- User preferences (music on/off, default playlist)
- Last active workout

Use a Redux middleware or `redux-persist` library.

### 4.4 Workout History View

**Priority: Medium**

- Calendar or list view of past workout sessions
- Show completion percentage per workout
- Streak counter (consecutive days worked out)

### 4.5 About Page

**Priority: Low**

- App description and version
- Credits
- Link to source repo (if open source)

### 4.6 Profile Page

**Priority: Low (for MVP)**

- Display name / avatar (stored locally for now)
- Preferences: default rest time, music toggle
- Export/import workout data (JSON)

---

## Phase 5: Polish & Quality (Days 30–40)

### 5.1 Responsive / Mobile-First Design

The app is primarily a mobile use case (used at the gym). Priorities:
- Timer and controls should be thumb-friendly (large touch targets)
- Exercise images should scale properly
- Music player controls should be compact but accessible
- Test on actual mobile devices

### 5.2 Host Exercise Images Locally

Current images are hotlinked from external URLs that may break. Options:
- Download and host in `public/img/exercises/`
- Use a free image hosting service  
- Generate placeholder illustrations

### 5.3 Improve Loading & Error States

- Replace "Loading..." text with a skeleton loader or spinner
- Show error messages when data fetch fails
- Add retry button on error

### 5.4 Add Tests

Target: Key flows with meaningful assertions.

| Test | Type |
|---|---|
| useTimer hook | Unit test — verify start, pause, stop, time calculation |
| useWorkouts hook | Unit test — verify data selection |
| Exercise view | Integration test — verify set progression, rest phase, auto-advance |
| Workouts list | Component test — verify rendering and navigation |

### 5.5 Accessibility

- Ensure all interactive elements have proper ARIA labels (some already do)
- Test with screen reader
- Ensure sufficient color contrast (dark theme may have issues)
- Keyboard navigation support

---

## Phase 6: Optional Enhancements (Post-MVP)

These are not needed for MVP but would make the app significantly better:

| Feature | Description |
|---|---|
| **Custom workout builder** | Let users create/edit their own workout plans |
| **Backend API** | Persist data server-side, enable multi-device sync |
| **User authentication** | Login with email/Google, personal workout data |
| **Push notifications** | Remind users of today's workout |
| **Audio cues** | Play a beep/bell when timer ends (not just auto-advance) |
| **Exercise animations** | Replace static images with animated GIFs or short videos |
| **Dark/light theme toggle** | Currently hardcoded dark theme |
| **Internationalization (i18n)** | Support multiple languages |
| **App store deployment** | Wrap PWA with Capacitor for iOS/Android store listing |

---

## Recommended Priority Order

```
Phase 0  →  Phase 1  →  Phase 2  →  Phase 4.1 + 4.2 + 4.3  →  Phase 3  →  Phase 5  →  Phase 4.4–4.6  →  Phase 6
```

**Rationale:** Get the app running (Phase 0), fix critical bugs (Phase 1), clean the code (Phase 2), build the core missing features (Phases 4.1–4.3) — at this point you have a usable MVP. Then modernize the stack (Phase 3), polish (Phase 5), and add secondary features.

---

## Definition of MVP Done

The app is MVP-complete when a user can:

- [ ] Open the app and see today's workout
- [ ] Start a workout and follow guided exercises with timer
- [ ] See their progress through each exercise (set X of Y)
- [ ] Complete a workout and see a summary
- [ ] View their workout history
- [ ] Optionally listen to music during workout
- [ ] Use the app on a mobile phone at the gym
