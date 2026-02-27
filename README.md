<<<<<<< HEAD
# Task Manager Template - Supplementary Assessment

## Overview

This template provides a **comprehensive working foundation** for your Multi-Table Task Manager project, built with **TypeScript**. It includes:

**Database Structure:**
- ✅ **Task Table** - Working category relationships (id, title, status, category_id)
- ✅ **Category Table** - Basic structure (id, name, color)
- 🔧 **Priority Table** - You design and create this table from scratch
- ✅ **Foreign Keys** - Category relationships working, you implement priority relationships

**Backend & API:**
- ✅ Functional server with middleware and routing

  **Tasks API (Complete):**
  - ✅ GET /api/tasks - Retrieve tasks (with optional category filtering)
  - ✅ POST /api/tasks - Create tasks with category relationships
  - ✅ PATCH /api/tasks/:id - Updates (title, status, category_id) - priority support pending
  - ✅ DELETE /api/tasks/:id - Delete task

  **Categories API (Complete):**
  - ✅ GET /api/categories - Working category endpoint
  - ✅ POST /api/categories - Create new categories
  - ✅ PATCH /api/categories/:id - Update category name and color
  - ✅ DELETE /api/categories/:id - Delete categories (with foreign key protection)

  **Priority API (Student Implementation):**
  - 🔧 GET /api/priorities - You design and implement
  - 🔧 POST /api/priorities - You design and implement
  - 🔧 PATCH /api/priorities/:id - You design and implement
  - 🔧 DELETE /api/priorities/:id - You design and implement

**Frontend:**
- ✅ Working HTML interface with category filtering
- ✅ Task display with category relationships
- ✅ Dynamic category management (add/edit/delete with foreign key protection)
- ✅ Quick status changes (one-click status updates) + full edit forms
- ✅ Task creation with category selection
- ✅ Inline editing forms for tasks and categories
- ✅ Basic CSS styling and JavaScript functions

  **Priority Features (Student Implementation):**
  - 🔧 Priority dropdown in task forms
  - 🔧 Priority display and filtering
  - 🔧 Extended form validation for priority fields

**Important:** This template provides a complete working foundation with full CRUD operations. Focus on extending the database schema (add priority table, description fields, etc.) and enhancing the UI/UX as needed.

## Quick Start

1. **Copy this template** to your own project folder
2. **Initialize Git repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial project setup with template files"
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Set up the database:**
   ```bash
   npm run setup
   ```
5. **Start the server:**
   ```bash
   npm start
   ```
6. **Open browser:** `http://localhost:3000`

## Project Structure

```
task-manager-[your-name]-[your-student-id]/
├── server/
│   ├── server.js          # Express server (needs completion)
│   ├── database.js        # Database connection (sample code)
│   └── routes/
│       └── tasks.js       # API routes (partial implementation)
├── public/
│   ├── index.html         # Main page (basic template)
│   ├── css/
│   │   └── styles.css     # CSS styling (basic styles provided)
│   └── js/
│       └── app.js         # Frontend JavaScript (sample functions)
├── database/
│   ├── schema.sql         # Database structure
│   └── sample-data.sql    # Sample tasks
├── testing/
│   └── test-plan.md      # Test plan template (update with your results)
├── package.json           # Dependencies (already configured)
├── tsconfig.json         # TypeScript configuration
├── .gitignore            # Git ignore rules
├── README.md             # Your project documentation (update this!)
└── AI_Usage_Declaration.md # Document your AI usage here
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js 22 or higher
- npm (comes with Node.js)

### Installation
```bash
# Install dependencies
npm install

# Setup database
npm run setup

# Start the server
npm start
```

### Troubleshooting

**Issue: "Could not locate the bindings file" for better-sqlite3**
- This happens when native bindings need to be rebuilt for your Node.js version
- Solution: `cd node_modules/better-sqlite3 && npm run install`
- Then try `npm run setup` again

### Development
```bash
# Start the server with hot reload and type checking
npm start
```

### API Endpoints
The server provides the following API endpoints:

## 🎯 **Task Manager Template - Complete Implementation Status**

**This template provides a fully functional task manager with complete CRUD operations. All core features are working - focus on extending the database schema and UI enhancements.**

### ✅ **Fully Implemented Features:**

**Backend:**
- ✅ Express server with CORS and JSON middleware
- ✅ SQLite database with better-sqlite3 and foreign key constraints
- ✅ Complete REST API: GET, POST, PATCH, DELETE for tasks and categories
- ✅ Prepared statements with proper error handling
- ✅ Input validation and foreign key relationship management

**Frontend:**
- ✅ Responsive HTML interface with category filtering
- ✅ Dynamic task and category management (full CRUD)
- ✅ One-click status changes + inline editing forms
- ✅ UI workflows (disabled states, pre-selection)
- ✅ Form validation and user feedback
- ✅ Comprehensive CSS styling and interactions

### 🎯 **Your Focus: Extensions & Enhancements**

**Priority System (Core Assessment):**
1. **Create Priority Routes** - Design and implement `/api/priorities` endpoints
2. **Priority Database Table** - Design schema with appropriate fields
3. **Task Priority Integration** - Extend PATCH /api/tasks for priority updates

**Database Extensions:**
1. **Extend Task Fields** - Add description, due_date, created_at, updated_at
2. **Extend Category Fields** - Add description field to categories

**UI/UX Enhancements:**
1. **Priority Management UI** - Dropdowns, color coding, sorting
2. **Advanced Filtering** - Filter by status, priority, date ranges
3. **Bulk Operations** - Select multiple tasks for batch actions
4. **Enhanced Validation** - Better error messages and input constraints

## 📋 **API Specifications**

### GET /api/tasks (Already Implemented)
```javascript
// Request: GET /api/tasks

// Response includes category information from JOIN:
// tasks: array of task objects
{
  "tasks": [
    {
      id: 1,
      title: "Complete Assessment",
      status: "in_progress",
      category_id: 3,
      category_name: "Study",
      category_color: "#45B7D1"
      // TODO: Add description, priority fields when you extend table
    }
  ]
}
// Error: { "error": "Failed to fetch tasks" }
```

### GET /api/categories (Already Implemented)
```javascript
// Request: GET /api/categories

// Response (currently without descriptions - you add description field):
{
  "categories": [
    {
      id: 1,
      name: "Work",
      description: "Desc to be implemented", // Placeholder until you add field
      color: "#FF6B6B"
    },
    {
      id: 2,
      name: "Personal",
      description: "Desc to be implemented", // Placeholder until you add field
      color: "#4ECDC4"
    }
  ]
}
// Error: { "error": "Failed to fetch categories" }
// Note: You implement the description field in the category table
```

### POST /api/tasks (Already Implemented)
```javascript
// Request: POST /api/tasks
// Body: { "title": "New Task", "status": "pending", "category_id": 1 }

// Response includes category information from JOIN:
{
  "task": {
    id: 1,
    title: "New Task",
    status: "pending",
    category_id: 1,
    category_name: "Work",
    category_color: "#FF6B6B"
  }
}
// Error: { "error": "Task title is required" }
// Note: Category relationships are working - you extend for priority and other fields
```

### PATCH /api/tasks/:id (WORKING DEMO - Basic Updates)
```javascript
// PATCH /api/tasks/1
// Body: { "title": "New Title", "status": "completed", "category_id": 2 }

// Response: {}
// Error: { "error": "Task not found" } (404)
// Error: { "error": "Task title cannot be empty" } (400)
// Note: priority_id support not implemented yet - students extend this endpoint
```

### DELETE /api/tasks/:id (WORKING DEMO)
```javascript
// Request: DELETE /api/tasks/1

// Response: {} (empty object for success)
// Error: { "error": "Task not found" } (404)
```

### DELETE /api/categories/:id (WORKING DEMO)
```javascript
// Request: DELETE /api/categories/1

// Response: {} (empty object for success)
// Error: { "error": "Category not found" } (404)
// Error: { "error": "Cannot delete category that is being used by tasks. Reassign tasks first." } (400)
```

### Priority API Endpoints (Assessment Requirement)
**You must create these endpoints from scratch:**
- `GET /api/priorities` - List all priorities
- `POST /api/priorities` - Create new priority
- `PATCH /api/priorities/:id` - Update priority
- `DELETE /api/priorities/:id` - Delete priority

### Frontend Integration
```javascript
// Quick status buttons → one-click status change → call PATCH API → refresh UI
// Edit button click → open inline form → submit → call PATCH API → refresh UI
// Delete button click → show confirmation → call DELETE API → refresh UI
```

## 🛠️ **Implementation Status**

**✅ ALL CORE FUNCTIONALITY IS IMPLEMENTED!** The template provides:

1. **Complete CRUD Operations** - Create, Read, Update, Delete for tasks and categories
2. **Foreign Key Relationships** - Working category relationships with constraint enforcement
3. **Full UI/UX** - Professional interface with workflows and error handling
4. **One-Click Actions** - Quick status changes and intuitive interactions
5. **Comprehensive Testing Structure** - Organized test folders with status tracking

**Your next steps should focus on extensions:**
- Add priority system (backend + frontend)
- Extend database schema with additional fields
- Enhance UI with advanced filtering and bulk operations
- Improve styling and user experience

## 📝 **Git Commit Style Guide**

**Use functional prefixes and commit logically grouped changes.** Minimum 8 commits showing your development progress.

### Functional Prefixes:
- `init:` - Project setup
- `db:` - Database design
- `seed:` - Sample data
- `api:` - API endpoints
- `ui:` - User interface features
- `feat:` - Feature completion
- `docs:` - Documentation
- `test:` - Testing

### Example Commit Flow:

```bash
# Setup phase
git commit -m "init: setup TypeScript project with template"
git commit -m "db: create tasks table schema"

# API development
git commit -m "api: extend PATCH /api/tasks/:id for full updates"
git commit -m "api: implement DELETE /api/tasks/:id and /api/categories/:id"

# UI features
git commit -m "ui: add edit task functionality"
git commit -m "ui: add delete task functionality"

# Completion
git commit -m "feat: complete CRUD task management"
git commit -m "docs: add setup instructions"
git commit -m "test: complete basic functionality testing"
```

**Focus on logical commits, not every tiny change. Your history should tell the story of your development process! 📚**

### Functional Prefixes:
- `init:` - Project initialization and setup
- `db:` - Database schema and structure
- `seed:` - Sample data and seeding
- `api:` - API endpoints and server logic
- `ui:` - User interface and frontend
- `feat:` - Feature implementation
- `test:` - Testing and validation
- `docs:` - Documentation updates

**Commit after each functional change - your history shows your development methodology! 🔄**

### 📋 **Assessment Requirements:**

**Database & Backend Development (35%):**

**Database Design (15%):**
- **Category relationships:** Already working as demo - study the foreign key implementation
- **Extend task table:** Add `description`, `priority_id`, `created_at`, `due_date`, `updated_at` fields
- **Extend category table:** Add `description` field
- **Create priority table:** Design complete priority system with id, name, level, color, description fields
- **Priority relationships:** Implement foreign key constraints for priority relationships
- **Indexes:** Add appropriate indexes for query performance

**Backend API (20%):**
- **Study category relationships:** GET/POST endpoints already handle category relationships as demo
- Extend PATCH endpoint to support priority updates and new fields
- ✅ DELETE endpoints implemented with proper error handling
- Update all endpoints to handle priority relationships and return joined data
- Add GET /api/priorities endpoint for priority options

**Frontend Development (15%):**
- ✅ Edit/delete buttons added to each task and category
- Implement edit modal/form with proper HTML/CSS structure
- Connect UI to new API endpoints with JavaScript functionality

**Application Functionality (35%):**
- Ensure all user workflows (create, view, edit, delete) work completely without breaking
- Implement proper error recovery with user-friendly messages for failure scenarios
- Verify application maintains consistent internal state across all operations
- Test that UI immediately reflects data changes without requiring manual refresh
- Provide clear success/failure messages for all user actions

**Documentation & Code Quality (15%):**
- Add comments to new code explaining functionality
- Update README with your implementation details and setup instructions
- Create a `testing/` folder with organized test documentation
- Maintain logical project structure and file organization

**Testing Folder Structure:**
A `testing/` folder is created with example folders. Add your screenshots to the appropriate folders:

```
testing/
├── test-plan.md           # Fill in your test results
├── test-1-create-task/     # Your task creation screenshots
├── test-2-view-tasks/      # Your task viewing screenshots
└── ...                     # Additional test folders for your functionality
```

**Test Plan Format:**
Update the provided test-plan.md with:
- Test results for all your implemented functionality
- Which folder contains your screenshots for each test
- Any issues found and how they were resolved

### 💡 **Optional Enhancements (if time allows):**
- Add task filtering by status
- Improve visual design
- Add due date validation
- Enhance user experience

## Sample Code Snippets

### Creating a Task (API)
```javascript
app.post('/api/tasks', (req, res) => {
  const { title, description, status, due_date } = req.body;
  // Your code here: Insert into database and return the new task
});
```

### Fetching Tasks (Frontend)
```javascript
async function loadTasks() {
  try {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    // Your code here: Display tasks in the UI
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
}
```

## Testing Your Application

1. **Create a task** using the form
2. **View all tasks** in the list
3. **Update a task's status** (Pending → In Progress → Completed)
4. **Delete a completed task**
5. **Verify data persists** after page refresh

## Important Requirements

- [ ] All CRUD operations must work
- [ ] Data must persist in the database
- [ ] User interface must be functional and clean
- [ ] Code must be properly commented
- [ ] Document any AI tools used in AI_Usage_Declaration.md

## Common Issues & Solutions

### "Cannot connect to database"
- Check if `npm run setup` was executed
- Verify database file exists in `db.sqlite3`

### "API endpoints not working"
- Ensure server is running on port 3000
- Run `npm run build` after making TypeScript changes
- Check browser console for JavaScript errors
- Verify API routes are properly mounted in server.ts

### "Form not submitting"
- Check JavaScript event listeners are attached
- Verify form data is being sent correctly
- Use browser developer tools to debug

## Need Help?

- Check the course materials for Node.js and SQLite examples
- Use online tutorials for basic CRUD operations
- Ask questions via email or WhatsApp during office hours
- Document your challenges and solutions in your README

---

**Remember:** This template gives you a head start, but you must demonstrate your understanding by completing and modifying the code. Good luck! 🚀
=======
# Supplementary-Coursework
>>>>>>> fd5ef3aa388499f1224e3d0f273ed7ceb0f0f278
