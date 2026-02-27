# Testing Checklist - Task Manager

## Basic Functionality Verification

Test each feature manually and mark with ✅ when working:

### Core Features
- [ ] **Create Task:** Can add new tasks through the web form
- [ ] **View Tasks:** Tasks appear in the list after creation
- [ ] **Edit Task:** Can modify existing tasks (click edit, change data, save)
- [ ] **Delete Task:** Can remove tasks (click delete, confirm removal)
- [ ] **Data Persistence:** Tasks remain after refreshing the page

### Quick Test Steps:
1. Start the server (`npm start`)
2. Open `http://localhost:3000` in browser
3. Create a few test tasks
4. Edit one task
5. Delete another task
6. Refresh page - verify data is saved

## Screenshots

Include 2-3 screenshots showing:
- Main task list with some tasks
- Edit form/modal open
- Task successfully created/updated

## Any Issues Found?

List any problems you encountered and how you fixed them:

1. **Issue:** [brief description]
   **Fix:** [what you did to resolve it]

## Test Environment
- **Browser:** [Chrome/Firefox/etc]
- **Date Tested:** [current date]

## Summary
- [ ] All core features working
- [ ] Screenshots included
- [ ] Issues documented and resolved

---

*This basic testing ensures your task manager application works correctly.*