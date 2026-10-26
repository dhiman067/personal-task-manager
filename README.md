# Personal Task Manager

A focused productivity app for organizing daily work, managing priorities, and staying on track with deep work sessions.

## Overview

Personal Task Manager is a lightweight React + TypeScript task dashboard designed to help you plan your day, categorize work, and maintain momentum without distraction. It keeps your tasks in local browser storage so your workflow is available anytime on the same device.

## Features

- Daily task dashboard for the current day
- Add, edit, delete, and complete tasks
- Pin important tasks to the top
- Priority management with a 4-quadrant matrix
- Categories and project-style organization
- Subtasks for breaking bigger goals into smaller steps
- Due dates and estimated pomodoro counts
- Search across tasks by title, notes, or category
- Focus timer for deep work and pomodoro-style sessions
- Productivity insights and daily completion stats
- Export and import task backups as JSON
- Local persistence using browser storage

## App Views

- Today: quick daily planning and actionable tasks
- Priority Matrix: organize tasks by urgency and importance
- All Tasks: full task list view
- Categories: grouped project-like task organization
- Completed: track finished work and clear completed tasks

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Lucide React icons
- Local browser storage for persistence

## Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/dhiman067/personal-task-manager.git
   cd personal-task-manager
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open the app in your browser at the local Vite URL, typically:
   ```bash
   http://localhost:3000
   ```

## Available Scripts

```bash
npm run dev     # start Vite dev server
npm run build   # build the app for production
npm run preview # preview the production build
npm run lint    # run TypeScript type check
```

## Productivity Workflow

This app is built for intentional productivity:

- Capture tasks quickly without friction
- Sort work by importance and urgency
- Focus on the most valuable tasks first
- Break tasks into trackable subtasks
- Use the timer to stay on task during focused work blocks
- Review your daily progress and completion metrics

## Notes

The app stores data locally in the browser, which makes it fast and simple to use for personal planning without needing a backend service.

## License

This project is available for personal and educational use.
