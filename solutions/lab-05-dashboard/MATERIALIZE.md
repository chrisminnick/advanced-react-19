# Publish to `solution/lab-05-dashboard`

```bash
git checkout main
git checkout -b solution/lab-05-dashboard

# StubCard is replaced by StatCard
git rm server-components-dashboard/app/dashboard/StubCard.jsx

# Server Components
cp solutions/lab-05-dashboard/app/dashboard/StatCard.jsx       server-components-dashboard/app/dashboard/StatCard.jsx
cp solutions/lab-05-dashboard/app/dashboard/ActivityFeed.jsx   server-components-dashboard/app/dashboard/ActivityFeed.jsx
cp solutions/lab-05-dashboard/app/dashboard/TeamList.jsx       server-components-dashboard/app/dashboard/TeamList.jsx

# Client Components
cp solutions/lab-05-dashboard/app/dashboard/AddTaskForm.jsx    server-components-dashboard/app/dashboard/AddTaskForm.jsx
cp solutions/lab-05-dashboard/app/dashboard/SubmitButton.jsx   server-components-dashboard/app/dashboard/SubmitButton.jsx
cp solutions/lab-05-dashboard/app/dashboard/FilterToggle.jsx   server-components-dashboard/app/dashboard/FilterToggle.jsx

# Server Action
cp solutions/lab-05-dashboard/app/actions/tasks.js             server-components-dashboard/app/actions/tasks.js

# Page
cp solutions/lab-05-dashboard/app/dashboard/page.jsx           server-components-dashboard/app/dashboard/page.jsx

# Boundary notes
cp solutions/lab-05-dashboard/BOUNDARY-NOTES.md                server-components-dashboard/BOUNDARY-NOTES.md

# Smoke-test: cd server-components-dashboard && npm install && npm run dev
# Visit http://localhost:3000/dashboard. Verify:
#  - Three stats cards render real numbers
#  - Activity feed and team list show
#  - Empty form submit shows the validation error
#  - Valid submit shows "Task added" and the Open count goes up
#  - Disable JS in DevTools — the form still works (progressive enhancement)
#  - Network tab on a hard refresh: no client JS for StatCard / ActivityFeed / TeamList

git add -A
git commit -m "Lab 5 solution: Server Components dashboard with Server Action

- StatCard / ActivityFeed / TeamList: Server Components, ship zero JS
- AddTaskForm: Client Component, useActionState wires the Server Action
- SubmitButton: separate Client Component for useFormStatus
- FilterToggle: Client Component owning a checkbox; renders Server Component children
- addTaskAction: server-side validation, revalidatePath on success
- BOUNDARY-NOTES.md documents every 'use client' decision"

# git push -u origin solution/lab-05-dashboard
git checkout main
```
