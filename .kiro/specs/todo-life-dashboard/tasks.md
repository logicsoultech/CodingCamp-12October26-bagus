# Implementation Plan: Todo Life Dashboard

## Overview

Implement a zero-dependency, single-page productivity dashboard delivered as three files (`index.html`, `css/style.css`, `js/script.js`). All state is persisted to `window.localStorage`. Modules are built incrementally — each task produces working, integrated code before the next begins.

## Tasks

- [x] 1. Scaffold project structure and create empty files
  - Create `css/` directory and empty `css/style.css`
  - Create `js/` directory and empty `js/script.js`
  - Create `index.html` at the repository root with a minimal HTML5 boilerplate (`<!DOCTYPE html>`, `<html lang="en">`, `<head>`, `<body>`)
  - Link `css/style.css` in `<head>` and `js/script.js` before `</body>`
  - _Requirements: 13.1, 13.2, 13.3, 13.4_

- [x] 2. Build the full HTML structure in `index.html`
  - [x] 2.1 Add theme pre-load inline script in `<head>`
    - Insert a synchronous inline `<script>` that reads `localStorage.getItem('dashboard_theme')` and sets `document.documentElement.dataset.theme` to `'dark'` or `'light'` before CSS is applied
    - This must be the only JavaScript outside `js/script.js`
    - _Requirements: 10.4, 10.5_

  - [x] 2.2 Add Clock, Greeting, and User Name section
    - Add `<header>` or `<section>` with id-targeted elements: `#clock-time`, `#clock-date`, `#greeting-text`
    - Add `<input id="name-input" maxlength="50">` and a Save button for the User Name
    - Use semantic elements and `<label>` with `for` attributes for all inputs
    - _Requirements: 1.1, 1.2, 2.1–2.8, 3.1, 3.3_

  - [x] 2.3 Add Focus Timer section
    - Add elements `#timer-display`, `#timer-start`, `#timer-pause`, `#timer-reset`, `#timer-complete`
    - `#timer-complete` must be hidden by default (use `hidden` attribute or a CSS class)
    - All timer buttons must have accessible `aria-label` attributes
    - _Requirements: 4.1, 4.6, 4.7, 4.9_

  - [x] 2.4 Add To-Do List section
    - Add `<input id="task-input">`, `<button id="task-add-btn">`, `<ul id="task-list">`, `<p id="task-error">`
    - `#task-error` must be hidden by default
    - _Requirements: 5.1, 6.2, 7.2_

  - [x] 2.5 Add Quick Links section
    - Add `<input id="link-label-input">`, `<input id="link-url-input">`, `<button id="link-add-btn">`, `<ul id="links-list">`, `<p id="link-error">`
    - `#link-error` must be hidden by default
    - _Requirements: 9.1–9.7_

  - [x] 2.6 Add Theme toggle button
    - Add a single `<button id="theme-toggle">` in the header area
    - The button must have a visible label (text or icon) and `aria-label`
    - _Requirements: 10.2_

- [x] 3. Implement CSS in `css/style.css`
  - [x] 3.1 Define CSS custom properties for both themes
    - Write `:root[data-theme="dark"]` block with all 8 colour tokens: `--color-bg`, `--color-card`, `--color-surface`, `--color-text`, `--color-text-sec`, `--color-border`, `--color-accent`, `--color-highlight` using the exact hex values from the design
    - Write `:root[data-theme="light"]` block with the matching light-mode tokens
    - All component styles must reference only these token names — never hardcoded hex values
    - _Requirements: 10.1, 10.6, 10.7_

  - [x] 3.2 Write base reset and typography
    - CSS box-sizing reset (`*, *::before, *::after { box-sizing: border-box; }`)
    - Set `body` font-size to `clamp(12px, 1rem, 16px)`
    - Apply `--color-bg` to `body` background and `--color-text` to default text
    - _Requirements: 11.1_

  - [x] 3.3 Implement responsive dashboard grid layout
    - `.dashboard-grid` defaults to `grid-template-columns: 1fr` (single column, mobile-first)
    - At `@media (min-width: 768px)` switch to `grid-template-columns: 1fr 1fr`
    - No horizontal overflow on viewports ≥ 320px
    - _Requirements: 11.1, 11.2, 11.3_

  - [x] 3.4 Style card, surface, and border components
    - Apply `--color-card` and `--color-border` to panel/card containers
    - Style `#task-list` and `#links-list` items with `--color-surface` backgrounds
    - _Requirements: 10.6, 10.7_

  - [x] 3.5 Style buttons with minimum 44×44 px touch targets
    - All `<button>` elements must have `min-width: 44px; min-height: 44px`
    - Apply `--color-accent` for primary action buttons; `--color-highlight` for hover/focus states
    - Style timer buttons (`#timer-start`, `#timer-pause`, `#timer-reset`) and toggle button
    - _Requirements: 11.1_

  - [x] 3.6 Style timer display, task list items, and quick links panel
    - `#timer-display`: large monospaced font using `--color-text`
    - Task list items: completed tasks get `text-decoration: line-through` via a `.completed` class
    - Quick links: anchor styles using `--color-accent`; no `list-style`
    - _Requirements: 8.2, 8.3, 4.9_

- [x] 4. Implement `js/script.js` — module scaffolding
  - Create the `App` namespace object (`const App = {};`) at the top of `js/script.js`
  - Create six empty IIFE-based module stubs: `App.Theme`, `App.Clock`, `App.User`, `App.Timer`, `App.Todo`, `App.Links` — each exposing an `init()` method that currently does nothing
  - Add a `DOMContentLoaded` listener at the bottom that calls each module's `init()` in order: Theme → Clock → User → Timer → Todo → Links
  - _Requirements: 13.4_

- [x] 5. Implement `App.Theme` (ThemeModule)
  - [x] 5.1 Implement theme init, toggle, and persist
    - `init()`: reads `localStorage.getItem('dashboard_theme')`; if value is not `'light'` default to `'dark'`; sets `document.documentElement.dataset.theme`; updates `#theme-toggle` button label
    - `toggle()`: reads current `dataset.theme`, flips it, calls `localStorage.setItem('dashboard_theme', newTheme)`, updates `dataset.theme` and button label
    - Wire `#theme-toggle` click event to `App.Theme.toggle()`
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 5.2 Write unit tests for ThemeModule
    - Test: invalid stored value defaults to `'dark'`
    - Test: `toggle()` from dark produces `'light'`; from light produces `'dark'`
    - Test: persisted value is read correctly on `init()`
    - _Requirements: 10.1, 10.5_

- [x] 6. Implement `App.Clock` and `App.User`
  - [x] 6.1 Implement ClockModule (clock, date, greeting)
    - `init()`: reads saved username via `App.User.get()`, renders immediately by calling `render()`, then starts a `setInterval` of 1000ms
    - `render()`: updates `#clock-time` (HH:MM:SS), `#clock-date` (Full Weekday, Full Month Day, Year), and `#greeting-text`
    - Greeting logic: hour 5–11 → "Good Morning"; 12–17 → "Good Afternoon"; 18–20 → "Good Evening"; 21–4 → "Good Night"; append `, ${name}` when name is non-empty
    - Use `element.textContent` — never `innerHTML` — for all DOM writes
    - _Requirements: 1.1, 1.2, 1.3, 2.1–2.8_

  - [ ]* 6.2 Write property test for greeting correctness (Property 5)
    - **Property 5: Greeting function covers all hours correctly**
    - Generator: `fc.integer({min:0,max:23})` + `fc.option(fc.string({minLength:1,maxLength:50}))`
    - Assert: correct bucket string for every hour; name appended with `, ` when present; output is exactly one of the four strings
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
    - `// Feature: todo-life-dashboard, Property 5: Greeting function covers all hours correctly`

  - [x] 6.3 Implement UserModule (name save/load)
    - `init()`: reads `localStorage.getItem('dashboard_username')`; if trimmed length ≤ 50 pre-populates `#name-input`; otherwise treats as empty
    - `save(raw)`: trims input; if empty removes `'dashboard_username'` key; if ≤ 50 chars writes to LocalStorage; then calls `App.Clock.updateGreeting()`
    - `get()`: returns trimmed stored name or `''`
    - Wire Save button click to `App.User.save(input.value)`
    - _Requirements: 3.1–3.5_

  - [ ]* 6.4 Write unit tests for UserModule
    - Test: save/get round-trip with valid name
    - Test: clearing name removes LocalStorage key and greeting shows without name
    - Test: trimmed value > 50 chars is rejected; stored value > 50 chars treated as empty on load
    - _Requirements: 3.1, 3.4, 3.5_

- [x] 7. Implement `App.Timer` (TimerModule)
  - [x] 7.1 Implement timer core (init, start, pause, reset, tick, complete, render)
    - Internal state: `{ remaining: 1500, running: false, complete: false, _intervalId: null }`
    - `init()`: calls `_render()` to show `25:00` on load
    - `start()`: calls `clearInterval(this._intervalId)` first (single-interval guard), then sets new 1000ms interval calling `_tick()`; sets `running = true`; guards against starting when `complete = true`
    - `pause()`: clears interval; sets `running = false`
    - `reset()`: clears interval; resets all state to initial values; hides `#timer-complete`; shows Start/Pause buttons; calls `_render()`
    - `_tick()`: decrements `remaining`; if `remaining <= 0` calls `_complete()`; else calls `_render()`
    - `_complete()`: sets `complete = true`; `running = false`; clears interval; shows `#timer-complete`; hides Start/Pause buttons
    - `_render()`: formats `remaining` as `MM:SS` with zero-padding; writes to `#timer-display` via `textContent`
    - Wire `#timer-start`, `#timer-pause`, `#timer-reset` click events
    - _Requirements: 4.1–4.9_

  - [ ]* 7.2 Write property test for timer MM:SS format (Property 8)
    - **Property 8: Timer display format is always MM:SS**
    - Generator: `fc.integer({min:0,max:1500})`
    - Assert: output matches `/^\d{2}:\d{2}$/`; MM equals `Math.floor(s/60)` zero-padded; SS equals `s % 60` zero-padded
    - **Validates: Requirements 4.9**
    - `// Feature: todo-life-dashboard, Property 8: Timer display format is always MM:SS`

  - [ ]* 7.3 Write unit tests for TimerModule
    - Test: `start()` called twice does not create duplicate intervals (spy on `setInterval`)
    - Test: `reset()` from any state restores `remaining` to 1500
    - Test: `_tick()` at `remaining === 1` calls `_complete()`
    - _Requirements: 4.5, 4.6, 4.8_

- [x] 8. Checkpoint — verify clock, timer, and theme work together
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement `App.Todo` (TodoModule)
  - [x] 9.1 Implement todo load, save, and render
    - `_load()`: `JSON.parse(localStorage.getItem('dashboard_tasks'))` wrapped in try/catch; returns `[]` on any failure
    - `_save()`: `localStorage.setItem('dashboard_tasks', JSON.stringify(this._tasks))` wrapped in try/catch; on `QuotaExceededError` silently swallows the error (in-memory state remains consistent)
    - `_render()`: clears `#task-list`; for each task builds `<li>` with title written via `document.createTextNode(task.title)` — no innerHTML for user data; adds toggle, edit, and delete controls
    - `init()`: calls `_load()` then `_render()`
    - _Requirements: 5.3, 5.4, 5.5, 12.1, 12.2_

  - [ ]* 9.2 Write property test for task persistence round-trip (Property 1)
    - **Property 1: Task persistence round-trip**
    - Generator: `fc.array(arbTask, { minLength: 1 })` where `arbTask` generates `{ id: string, title: nonEmptyTrimmedString, completed: boolean }`
    - Assert: `JSON.parse(JSON.stringify(arr))` deep-equals original; all ids, titles, and completed flags are preserved
    - **Validates: Requirements 5.2, 5.3, 5.4**
    - `// Feature: todo-life-dashboard, Property 1: Task persistence round-trip`

  - [x] 9.3 Implement todo add with validation and duplicate prevention
    - `_isDuplicate(title, excludeId = null)`: compares `title.trim().toLowerCase()` against all tasks (excluding `excludeId`)
    - `add(title)`: trims title; rejects if empty (show error in `#task-error`); rejects if `_isDuplicate` (show error); creates `{ id: String(Date.now()), title: trimmed, completed: false }`; pushes to `_tasks`; calls `_save()` then `_render()`; clears `#task-error` on success
    - Wire `#task-add-btn` click and `#task-input` Enter keypress to `add(input.value)`
    - _Requirements: 5.1, 5.2, 6.1, 6.2, 6.3_

  - [ ]* 9.4 Write property test for whitespace-only task rejection (Property 2)
    - **Property 2: Whitespace-only task titles are rejected**
    - Generator: `fc.string().filter(s => s.length > 0 && s.trim() === '')`
    - Assert: task list size unchanged; `localStorage.getItem('dashboard_tasks')` not modified
    - **Validates: Requirements 5.2**
    - `// Feature: todo-life-dashboard, Property 2: Whitespace-only task titles are rejected`

  - [ ]* 9.5 Write property test for duplicate task prevention (Property 3)
    - **Property 3: Duplicate task prevention**
    - Generator: existing task list (≥ 1 task) + case/whitespace variant of an existing task title
    - Assert: task list size unchanged after duplicate submission attempt
    - **Validates: Requirements 6.1, 6.3**
    - `// Feature: todo-life-dashboard, Property 3: Duplicate task prevention`

  - [x] 9.6 Implement todo edit
    - `edit(id, newTitle)`: trims newTitle; rejects if empty; rejects if `_isDuplicate(newTitle, id)` (show error); finds task by id; updates `title`; calls `_save()` then `_render()`
    - In `_render()`, Edit control activates an inline editable field pre-populated with the current title; Save/Cancel controls confirm or discard the edit
    - All edited text written via `textContent` / `createTextNode`
    - _Requirements: 7.1–7.5, 12.1_

  - [x] 9.7 Implement todo toggle and delete
    - `toggle(id)`: finds task; flips `completed`; calls `_save()` then `_render()`
    - In `_render()`, completed tasks receive a CSS class that applies `text-decoration: line-through`
    - `delete(id)`: filters out task by id; calls `_save()` then `_render()`
    - _Requirements: 8.1–8.5_

  - [ ]* 9.8 Write property test for toggle involution (Property 4)
    - **Property 4: Task completion toggle is an involution**
    - Generator: arbitrary Task with any `completed` state
    - Assert: after two toggles, `completed` equals its original value; LocalStorage reflects that original state
    - **Validates: Requirements 8.2, 8.3**
    - `// Feature: todo-life-dashboard, Property 4: Task completion toggle is an involution`

  - [ ]* 9.9 Write unit tests for TodoModule
    - Test: `add` then `delete` leaves empty list
    - Test: malformed LocalStorage JSON initialises `_tasks` to `[]`
    - Test: edit with empty title is rejected; original title is unchanged
    - _Requirements: 5.5, 7.4, 7.5_

- [x] 10. Checkpoint — verify todo CRUD, persistence, and duplicate prevention
  - Ensure all tests pass, ask the user if questions arise.

- [~] 11. Implement `App.Links` (LinksModule)
  - [ ] 11.1 Implement links load, save, defaults, and render
    - Default links array: `[{ id: 'default-1', label: 'GitHub', url: 'https://github.com' }, { id: 'default-2', label: 'MDN Web Docs', url: 'https://developer.mozilla.org' }, { id: 'default-3', label: 'Google', url: 'https://www.google.com' }]`
    - `_load()`: try/catch `JSON.parse`; returns default links on any failure or when storage is empty
    - `_save()`: try/catch `localStorage.setItem('dashboard_links', JSON.stringify(this._links))`
    - `_render()`: clears `#links-list`; for each link creates `<a>` with `href`, label written via `createTextNode`, `target="_blank"`, `rel="noopener noreferrer"`; adds Delete control
    - `init()`: calls `_load()` then `_render()`
    - _Requirements: 9.1, 9.5, 9.8, 12.2, 12.3_

  - [ ] 11.2 Implement link URL validation and add
    - `_validateUrl(url)`: returns `true` only if `url.startsWith('http://') || url.startsWith('https://')`; additionally wraps `new URL(url)` in try/catch for deeper validation; any failure returns `false`
    - `add(label, url)`: trims both inputs; rejects if label is empty or `label.length > 100`; rejects if `_validateUrl` returns false; creates `{ id: String(Date.now()), label: trimmedLabel, url: trimmedUrl }`; pushes to `_links`; calls `_save()` then `_render()`; shows error in `#link-error` on rejection; clears error on success
    - Wire `#link-add-btn` click to `add(labelInput.value, urlInput.value)`
    - `delete(id)`: filters out by id; calls `_save()` then `_render()`
    - _Requirements: 9.2, 9.3, 9.4, 9.6, 9.7, 12.4_

  - [ ]* 11.3 Write property test for URL scheme validation (Property 6)
    - **Property 6: Link URL validation rejects non-HTTP schemes**
    - Generator: `fc.string().filter(s => !s.startsWith('http://') && !s.startsWith('https://'))`
    - Assert: submission rejected; `_links` array size unchanged; `#link-error` is visible
    - **Validates: Requirements 9.4, 12.4**
    - `// Feature: todo-life-dashboard, Property 6: Link URL validation rejects non-HTTP schemes`

  - [ ]* 11.4 Write property test for valid link round-trip (Property 7)
    - **Property 7: Valid link addition round-trip**
    - Generator: `fc.record({ label: fc.string({minLength:1,maxLength:100}), url: fc.constantFrom('http://example.com','https://example.com') })`
    - Assert: loaded links list contains a link with the exact trimmed label and URL; rendered anchor carries `rel="noopener noreferrer"` and `target="_blank"`
    - **Validates: Requirements 9.3, 9.5, 12.3**
    - `// Feature: todo-life-dashboard, Property 7: Valid link addition round-trip`

  - [ ]* 11.5 Write unit tests for LinksModule
    - Test: default links shown when storage is empty
    - Test: malformed storage restores defaults
    - Test: `javascript:alert(1)` URL is rejected
    - Test: `data:text/html,<h1>x</h1>` URL is rejected
    - Test: `https://` URL is accepted
    - _Requirements: 9.1, 9.4, 9.8, 12.4_

- [ ] 12. Final checkpoint — integration, security, and MVP review
  - Verify all `localStorage.getItem` / `JSON.parse` calls are wrapped in try/catch with safe defaults
  - Verify no user input is written via `innerHTML` (grep for `innerHTML` and confirm zero occurrences in user-data paths)
  - Verify the theme pre-load inline script applies `data-theme` before `style.css` is parsed
  - Verify all links render with `rel="noopener noreferrer"` and `target="_blank"`
  - Verify `#timer-display` always shows `MM:SS` format
  - Confirm the three output files exist at their required paths (`index.html`, `css/style.css`, `js/script.js`) and no build step is needed
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Property-based tests require [fast-check](https://github.com/dubzzz/fast-check) (CDN import or local install); each test is tagged with `// Feature: todo-life-dashboard, Property N: ...`
- All DOM writes for user content must use `textContent` or `document.createTextNode()` — never `innerHTML`
- LocalStorage failures (parse errors, quota exceeded) must be silent and fall back to safe defaults
- The inline theme pre-load script is the only JavaScript permitted outside `js/script.js`
- No framework, bundler, or package manager is required; the app deploys directly to GitHub Pages from the repository root

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6"] },
    { "id": 1, "tasks": ["3.1"] },
    { "id": 2, "tasks": ["3.2", "3.3", "3.4", "3.5", "3.6"] },
    { "id": 3, "tasks": ["5.1", "6.1", "6.3", "7.1", "9.1", "11.1"] },
    { "id": 4, "tasks": ["5.2", "6.2", "6.4", "7.2", "7.3", "9.2", "9.3", "11.2"] },
    { "id": 5, "tasks": ["9.4", "9.5", "9.6", "9.7", "11.3", "11.4"] },
    { "id": 6, "tasks": ["9.8", "9.9", "11.5"] }
  ]
}
```
