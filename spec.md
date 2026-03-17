# StudyTrack - Student Study & Assignment Tracker

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Subject management: add, edit, delete subjects with color coding
- Study timer: start/stop/pause Pomodoro-style timer per subject, log sessions automatically
- Assignment tracker: add assignments with subject, due date, title, description, and completion status
- Homework reminders: browser-based notifications for upcoming due dates (today/tomorrow)
- Weekly dashboard: daily study time bar chart, weekly total hours, per-subject breakdown, streak counter
- Mobile-first layout with bottom navigation (Dashboard, Subjects, Timer, Assignments)

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend (Motoko)
- `Subject` record: id, name, colorHex, createdAt
- `Assignment` record: id, subjectId, title, description, dueDate (Unix timestamp), completed, createdAt
- `StudySession` record: id, subjectId, durationSeconds, date (Unix timestamp), createdAt
- CRUD for subjects: addSubject, getSubjects, updateSubject, deleteSubject
- CRUD for assignments: addAssignment, getAssignments, updateAssignment, deleteAssignment, toggleAssignment
- Study sessions: logStudySession, getStudySessions, getSessionsByDateRange
- Aggregation: getWeeklyStats (total seconds per day for last 7 days), getSubjectStats (total per subject)

### Frontend (React + TypeScript)
- Mobile-first layout, max-width 430px centered, with bottom tab navigation
- 4 tabs: Dashboard, Subjects, Timer, Assignments
- Dashboard: weekly bar chart (7 days), total weekly hours card, per-subject pie/bar, upcoming assignments list, streak counter
- Subjects tab: list of subjects with color swatches, add/edit/delete modals
- Timer tab: subject selector, large countdown display, start/pause/stop controls, session history list
- Assignments tab: grouped by due date (overdue, today, upcoming), add assignment modal, toggle complete
- Reminders: browser Notification API on app load for assignments due today/tomorrow
- Persistent state via backend canister calls
