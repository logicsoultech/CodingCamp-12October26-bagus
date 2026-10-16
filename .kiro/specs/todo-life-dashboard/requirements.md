# Requirements Document

## Introduction

The Todo Life Dashboard is a standalone, client-side web application built with HTML, CSS, and Vanilla JavaScript. It serves as a personal productivity hub accessible from any modern browser without a backend server. The application combines a live time/greeting section, a Pomodoro-style focus timer, a task management list, and a quick-links panel - all persisted in the browser's LocalStorage. It ships with a premium black-and-red visual theme and supports both dark and light modes, custom user naming, and duplicate-task prevention.

## Glossary

- **Dashboard**: The single-page application delivered by `index.html`.
- **Task**: A user-created to-do item with a title, completion state, and unique identifier.
- **Link**: A user-created quick-link entry containing a label and a URL.
- **Focus_Timer**: The countdown timer component implementing a 25-minute Pomodoro-style session.
- **LocalStorage**: The browser Web Storage API (`window.localStorage`) used for all client-side persistence.
- **Theme**: The active color scheme of the Dashboard - either `dark` (default) or `light`.
- **Greeting**: The time-sensitive salutation displayed at the top of the Dashboard.
- **User_Name**: The optional display name entered by the user and shown in the Greeting.
- **Duplicate_Task**: A task whose trimmed, case-insensitive title matches an existing active task.

---

## Requirements

### Requirement 1: Live Time and Date Display

**User Story:** As a user, I want to see the current time and date update in real time, so that I can glance at the Dashboard without checking another clock.

#### Acceptance Criteria

1. THE Dashboard SHALL display the current local time in HH:MM:SS format.
2. THE Dashboard SHALL display the current local date in the format Full Weekday Name, Full Month Name Day, Full Year (e.g., Friday, October 16, 2026).
3. WHEN the Dashboard is open, THE Dashboard SHALL update both the displayed time and the displayed date every 1000 milliseconds so that the seconds counter advances continuously and the date transitions correctly at midnight without requiring a page reload.

---

### Requirement 2: Time-Based Greeting

**User Story:** As a user, I want to receive a greeting that reflects the time of day, so that the Dashboard feels personal and contextually aware.

#### Acceptance Criteria

1. WHEN the local hour is between 05:00 and 11:59 (inclusive), THE Dashboard SHALL display the greeting Good Morning.
2. WHEN the local hour is between 12:00 and 17:59 (inclusive), THE Dashboard SHALL display the greeting Good Afternoon.
3. WHEN the local hour is between 18:00 and 20:59 (inclusive), THE Dashboard SHALL display the greeting Good Evening.
4. WHEN the local hour is between 21:00 and 04:59 (inclusive), THE Dashboard SHALL display the greeting Good Night.
5. WHEN a User_Name has been saved, THE Dashboard SHALL append the User_Name to the greeting separated by a comma and space (e.g., Good Morning, Alex).
6. WHEN no User_Name has been saved, THE Dashboard SHALL display the greeting without a name.
7. THE Dashboard SHALL determine the current hour using the device's local timezone.
8. WHEN the Dashboard is loaded or refreshed, THE Dashboard SHALL evaluate the current local hour and display the corresponding greeting.

---

### Requirement 3: Custom User Name

**User Story:** As a user, I want to set my name so that the Dashboard greets me personally.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a text input field, with a maximum length of 50 characters, where the user can enter a User_Name.
2. WHEN the user submits a non-empty User_Name, THE Dashboard SHALL save the trimmed value to LocalStorage under a dedicated key and immediately update the greeting to include the saved User_Name.
3. WHEN the Dashboard loads, THE Dashboard SHALL read the User_Name from LocalStorage and pre-populate the name input field with the saved value.
4. IF the User_Name entry in LocalStorage is missing or its trimmed length exceeds 50 characters, THEN THE Dashboard SHALL default to an empty User_Name and display the greeting without a name.
5. WHEN the user clears the name input and saves, THE Dashboard SHALL remove the User_Name from LocalStorage and display the greeting without a name.

---

### Requirement 4: Focus Timer

**User Story:** As a user, I want a 25-minute countdown timer I can start, pause, and reset, so that I can time focused work sessions.

#### Acceptance Criteria

1. WHEN the Dashboard is loaded, THE Focus_Timer SHALL initialize with a remaining time of 25 minutes and 00 seconds (25:00).
2. WHEN the user activates the Start control and the Focus_Timer is not currently running, THE Focus_Timer SHALL begin decrementing the remaining time by 1 second every 1000 milliseconds.
3. WHEN the user activates the Pause control while the Focus_Timer is running, THE Focus_Timer SHALL pause the countdown and retain the remaining time.
4. WHEN the user activates the Start control while the Focus_Timer is paused, THE Focus_Timer SHALL resume the countdown from the retained remaining time.
5. WHEN the user activates the Reset control, THE Focus_Timer SHALL stop any active countdown and restore the remaining time to 25:00.
6. WHEN the remaining time reaches 00:00, THE Focus_Timer SHALL stop the countdown and replace the Start/Pause controls with a Session Complete label.
7. WHEN the user activates the Reset control after the Focus_Timer has reached 00:00, THE Focus_Timer SHALL clear the completion state, restore the remaining time to 25:00, and re-display the Start and Pause controls.
8. THE Focus_Timer SHALL ensure that no more than one countdown interval runs simultaneously at any point in time.
9. THE Focus_Timer SHALL display remaining time in MM:SS format at all times.

---

### Requirement 5: To-Do List - Add and Persist Tasks

**User Story:** As a user, I want to add tasks and have them saved automatically, so that my list is preserved across browser sessions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a text input and submit control for adding a new Task.
2. WHEN the user submits a non-empty task title, THE Dashboard SHALL create a Task with a unique identifier, the trimmed title, and a completion state of false.
3. WHEN a Task is created, THE Dashboard SHALL save the full task list to LocalStorage.
4. WHEN the Dashboard loads, THE Dashboard SHALL read the task list from LocalStorage and render all saved Tasks.
5. IF the task list entry in LocalStorage is malformed or cannot be parsed as valid JSON, THEN THE Dashboard SHALL discard the malformed data and initialize with an empty task list.

---

### Requirement 6: To-Do List - Duplicate Task Prevention

**User Story:** As a user, I want to be prevented from adding the same task twice, so that my list stays clean and uncluttered.

#### Acceptance Criteria

1. WHEN the user submits a task title whose trimmed, case-insensitive value matches an existing Task title (trimmed, case-insensitive), THE Dashboard SHALL reject the submission.
2. WHEN a duplicate submission is rejected, THE Dashboard SHALL display a visible error message informing the user that the task already exists.
3. WHEN a duplicate submission is rejected, THE Dashboard SHALL NOT create or persist a new Task.

---

### Requirement 7: To-Do List - Edit Tasks

**User Story:** As a user, I want to edit a task's title after it has been created, so that I can correct mistakes or update descriptions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide an Edit control for each Task in the list.
2. WHEN the user activates the Edit control for a Task, THE Dashboard SHALL display an editable field pre-populated with the current task title.
3. WHEN the user saves an edited title that is non-empty and does not match any other existing Task title (trimmed, case-insensitive), THE Dashboard SHALL update the Task title and persist the change to LocalStorage.
4. IF the user saves an edited title that matches another existing Task title (trimmed, case-insensitive), THEN THE Dashboard SHALL reject the change and display a visible error message.
5. IF the user saves an empty edited title, THEN THE Dashboard SHALL reject the change and retain the original title.

---

### Requirement 8: To-Do List - Complete and Delete Tasks

**User Story:** As a user, I want to mark tasks as done and delete tasks I no longer need, so that I can track and manage my progress.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a completion toggle control for each Task.
2. WHEN the user activates the completion toggle for an incomplete Task, THE Dashboard SHALL set the Task's completion state to true, apply a strikethrough visual style to the task title, and persist the change to LocalStorage.
3. WHEN the user activates the completion toggle for a completed Task, THE Dashboard SHALL set the Task's completion state to false, remove the strikethrough visual style, and persist the change to LocalStorage.
4. THE Dashboard SHALL provide a Delete control for each Task.
5. WHEN the user activates the Delete control for a Task, THE Dashboard SHALL remove the Task from the list and persist the updated list to LocalStorage.

---

### Requirement 9: Quick Links - Add, Open, and Delete

**User Story:** As a user, I want to manage a collection of favorite website links on my Dashboard, so that I can navigate to them quickly.

#### Acceptance Criteria

1. WHEN the Dashboard loads and no Links exist in LocalStorage, THE Dashboard SHALL display a pre-populated set of at least 3 default Links.
2. THE Dashboard SHALL provide controls to add a new Link by entering a label (maximum 100 characters) and a URL beginning with http:// or https://.
3. WHEN the user submits a new Link with a non-empty label and a valid URL, THE Dashboard SHALL create the Link, add it to the list, and persist the list to LocalStorage.
4. WHEN the user submits a new Link with an empty label, an empty URL, or a URL that does not begin with http:// or https://, THE Dashboard SHALL reject the submission and display a visible error message.
5. WHEN the user activates a Link, THE Dashboard SHALL open the Link's URL in a new browser tab.
6. THE Dashboard SHALL provide a Delete control for each Link.
7. WHEN the user activates the Delete control for a Link, THE Dashboard SHALL remove the Link from the list and persist the updated list to LocalStorage.
8. IF the Links entry in LocalStorage is malformed or cannot be parsed as valid JSON, THEN THE Dashboard SHALL discard the malformed data and restore the default Links.

---

### Requirement 10: Light / Dark Mode Toggle

**User Story:** As a user, I want to switch between a dark and a light color scheme, so that I can choose the appearance that suits my environment.

#### Acceptance Criteria

1. THE Dashboard SHALL default to the dark Theme on first load.
2. THE Dashboard SHALL provide a single toggle control to switch between the dark Theme and the light Theme.
3. WHEN the user activates the Theme toggle, THE Dashboard SHALL switch the active Theme and persist the Theme identifier (dark or light) to LocalStorage.
4. WHEN the Dashboard loads, THE Dashboard SHALL read the persisted Theme identifier from LocalStorage and apply it before the first render to prevent a flash of the wrong theme.
5. IF the persisted Theme identifier is not one of the valid values dark or light, THEN THE Dashboard SHALL apply the dark Theme.
6. WHILE the dark Theme is active, THE Dashboard SHALL apply the following color palette: background #0A0A0C, card #141418, surface #1D1D23, main text #F5F5F7, secondary text #A1A1AA, border #2B2B32, primary accent #DC143C, highlight accent #FF334F.
7. WHILE the light Theme is active, THE Dashboard SHALL apply a light color palette (background #FFFFFF, card #F5F5F7, surface #EBEBEB, main text #0A0A0C, secondary text #4A4A55, border #D1D1D8, primary accent #DC143C, highlight accent #FF334F) that meets WCAG AA contrast ratio requirements.

---

### Requirement 11: Responsive Layout

**User Story:** As a user, I want the Dashboard to be usable on desktop, tablet, and mobile screens, so that I can access it from any device.

#### Acceptance Criteria

1. THE Dashboard SHALL render a functional layout on viewport widths of 320 px and above, with a minimum font size of 12 px and minimum touch-target dimensions of 44x44 px for all interactive elements.
2. WHEN the viewport width is 768 px or above, THE Dashboard SHALL arrange content panels in a grid layout with at least 2 columns.
3. WHEN the viewport width is below 768 px, THE Dashboard SHALL stack content panels into a single-column layout with no horizontal overflow.

---

### Requirement 12: Security and Data Safety

**User Story:** As a developer, I want user-entered content to be rendered safely, so that the application is not vulnerable to cross-site scripting.

#### Acceptance Criteria

1. THE Dashboard SHALL render all user-entered text (task titles, link labels, User_Name) using DOM text node methods (e.g., textContent, createTextNode) and SHALL NOT insert raw user input via innerHTML.
2. IF LocalStorage contains data that cannot be parsed as valid JSON, THEN THE Dashboard SHALL catch the parse error, discard the corrupted data, and continue normal operation.
3. THE Dashboard SHALL open all Quick Links with rel=noopener noreferrer to prevent reverse tab-napping.
4. THE Dashboard SHALL reject any Quick Link URL whose scheme is not http: or https:, preventing javascript: and data: URI injection.

---

### Requirement 13: Deployment and File Structure

**User Story:** As a developer, I want the application to be deployable directly from the repository root via GitHub Pages, so that it is publicly accessible without a build step.

#### Acceptance Criteria

1. THE Dashboard SHALL be delivered as a single index.html file located at the repository root.
2. THE Dashboard SHALL reference exactly one external stylesheet at the path css/style.css relative to the root.
3. THE Dashboard SHALL reference exactly one external JavaScript file at the path js/script.js relative to the root.
4. THE Dashboard SHALL NOT require a build tool, package manager, or server-side runtime to function.
