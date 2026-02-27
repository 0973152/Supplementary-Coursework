// Task Manager Frontend JavaScript
// Complete these functions for full CRUD functionality

// Initialize the application
async function init() {
    // Load categories first, then setup the rest
    await loadCategories();
    // Ensure categories are loaded before setting up filter and loading tasks
    await loadTasks();
    setupCategoryFilter();

    // Attach form submission handlers
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', handleTaskSubmit);

    const categoryForm = document.getElementById('category-form');
    categoryForm.addEventListener('submit', handleCategorySubmit);
}

// Call init when the script loads
init();


// Load tasks from API (with optional category filtering)
async function loadTasks() {
    try {
        // Build URL with category filter if selected
        let url = '/api/tasks';
        if (currentCategoryFilter) {
            url += `?category_id=${currentCategoryFilter}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        } else {
            // Tasks are already filtered by API, no need to filter again
            displayTasks(result.tasks);
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('tasks-container').innerHTML =
            '<p>Error loading tasks. Please try again later.</p>';
    }
}

// Display tasks in the UI
function displayTasks(tasks) {
    const container = document.getElementById('tasks-container');

    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p>No tasks found. Create your first task above!</p>';
        return;
    }

    // TODO: Create HTML for each task
    const tasksHtml = tasks.map(task => createTaskHtml(task)).join('');
    container.innerHTML = tasksHtml;
}

// Store categories globally for easy access
let loadedCategories = [];

// Load and display categories
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const result = await response.json();

        if (result.error) {
            console.error('Error loading categories:', result.error);
            return;
        }

        // Store categories globally
        loadedCategories = result.categories;

        // Populate category filter dropdown
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.innerHTML = '<option value="">All Categories</option>';

        // Display categories in management section
        const categoriesContainer = document.getElementById('categories-container');
        categoriesContainer.innerHTML = '';

        result.categories.forEach(category => {
            // Add to filter dropdown
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);

            // Add to management display
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-item';
            categoryDiv.innerHTML = `
                <span class="category-name" style="color: ${category.color}">${category.name}</span>
                <div class="category-actions">
                    <button class="btn btn-secondary btn-sm" onclick="editCategory(${category.id}, '${category.name.replace(/'/g, "\\'")}', '${category.color}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteCategory(${category.id}, '${category.name.replace(/'/g, "\\'")}')">Delete</button>
                </div>
            `;
            categoriesContainer.appendChild(categoryDiv);
        });

    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Create HTML for a single task
function createTaskHtml(task) {
    // Find category information from loaded categories
    // Handle both number and string ID comparisons
    const category = loadedCategories.find(cat => {
        return Number(cat.id) === Number(task.category_id);
    });

    const categoryHtml = category ?
        `<span class="task-category" style="background-color: ${category.color}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.8em;">${category.name}</span>` :
        '<span class="task-category-placeholder">No category</span>';

    // Create quick status change buttons
    const statusButtons = ['pending', 'in_progress', 'completed']
        .filter(s => s !== task.status)
        .map(status => `<button class="btn btn-outline-secondary btn-xs status-btn" onclick="changeTaskStatus(${task.id}, '${status}')">${status.replace('_', ' ')}</button>`)
        .join('');

    return `
        <div class="task-item ${task.status}" data-id="${task.id}">
            <div class="task-title">${task.title}</div>
            <div class="task-meta">
                <span class="task-status status-${task.status}">${task.status.replace('_', ' ')}</span>
                ${statusButtons ? `<div class="quick-status-actions">${statusButtons}</div>` : ''}
                ${categoryHtml}
            </div>
            <div class="task-actions">
                <button class="btn btn-secondary btn-sm" onclick="editTask(${task.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id}, '${task.title.replace(/'/g, "\\'")}')">Delete</button>
            </div>
        </div>
    `;
}

// Handle form submission to create new task
async function handleTaskSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    // WORKING DEMO: Use selected category from filter
    const taskData = {
        title: formData.get('title').trim(),
        status: 'pending', // New tasks are always pending
        category_id: currentCategoryFilter // Use selected category from filter
        // TODO: Add description, priority_id, due_date after extending backend
    };

    // Basic validation
    if (!taskData.title) {
        alert('Task title is required');
        return;
    }

    if (!taskData.category_id) {
        alert('Please select a category first');
        return;
    }

    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        } else {
            // Success - task created with category relationship (WORKING DEMO)
            console.log('Created task with category:', result.task);
            // Clear form and reload tasks
            event.target.reset();
            loadTasks();
        }

    } catch (error) {
        console.error('Error adding task:', error);
        alert(`Error adding task: ${error.message}`);
    }
}

// Handle category form submission (add new category)
async function handleCategorySubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const categoryData = {
        name: formData.get('name').trim(),
        color: formData.get('color')
    };

    // Basic validation
    if (!categoryData.name) {
        alert('Category name is required');
        return;
    }

    if (!categoryData.color) {
        alert('Category color is required');
        return;
    }

    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoryData)
        });

        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        } else {
            // Success - reload categories and update UI
            loadCategories().then(() => {
                loadTasks();
            });
            // Clear form
            event.target.reset();
            // Reset color picker to default
            document.getElementById('category-color').value = '#FF6B6B';
            alert('Category added successfully!');
        }

    } catch (error) {
        console.error('Error adding category:', error);
        alert(`Error adding category: ${error.message}`);
    }
}

// Global variable to store current category filter
let currentCategoryFilter = '';


// Setup category filter functionality
function setupCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    const addTaskBtn = document.getElementById('add-task-btn');

    categoryFilter.addEventListener('change', function() {
        currentCategoryFilter = this.value;
        loadTasks();

        // Update button state and text
        if (currentCategoryFilter) {
            addTaskBtn.disabled = false;
            addTaskBtn.textContent = 'Add Task to Selected Category';
        } else {
            addTaskBtn.disabled = true;
            addTaskBtn.textContent = 'Select a Category First';
        }

        // Update task list title
        updateTaskListTitle();
    });

    // Initially disable the button
    addTaskBtn.disabled = true;
    addTaskBtn.textContent = 'Select a Category First';
}

// Update task list title based on current filter
function updateTaskListTitle() {
    const titleElement = document.getElementById('task-list-title');

    if (currentCategoryFilter) {
        // Find the category name
        const categoryFilter = document.getElementById('category-filter');
        const selectedOption = categoryFilter.querySelector(`option[value="${currentCategoryFilter}"]`);
        const categoryName = selectedOption ? selectedOption.textContent : 'Unknown';
        titleElement.textContent = `Tasks in "${categoryName}"`;
    } else {
        titleElement.textContent = 'All Tasks';
    }
}


// Edit task functionality (improved with inline form like edit category)
async function editTask(taskId) {
    // Get current task data
    try {
        // Need to get all tasks since we're filtering on frontend
        const response = await fetch('/api/tasks');
        const result = await response.json();

        if (result.error) {
            throw new Error(result.error);
        }

        const task = result.tasks.find(t => t.id == taskId);
        if (!task) {
            alert('Task not found');
            return;
        }

        // Create category options for the edit form
        const categoryOptions = loadedCategories.map(cat =>
            `<option value="${cat.id}" ${task.category_id == cat.id ? 'selected' : ''}>${cat.name}</option>`
        ).join('');

        // Create edit form
        const editForm = document.createElement('form');
        editForm.className = 'edit-task-form';
        editForm.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" name="title" value="${task.title.replace(/"/g, '&quot;')}" required maxlength="100">
                </div>
                <div class="form-group">
                    <label>Status *</label>
                    <select name="status" required>
                        <option value="pending" ${task.status === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="in_progress" ${task.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${task.status === 'completed' ? 'selected' : ''}>Completed</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex: 1;">
                    <label>Category</label>
                    <select name="category_id">
                        <option value="">No Category</option>
                        ${categoryOptions}
                    </select>
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-sm">Save</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="cancelEdit(this)">Cancel</button>
            </div>
        `;

        // Find the task item and replace its content temporarily
        const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);
        const originalContent = taskItem.innerHTML;
        taskItem.innerHTML = '';
        taskItem.appendChild(editForm);

        // Handle form submission
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const formData = new FormData(e.target);
            const updateData = {
                title: formData.get('title').trim(),
                status: formData.get('status'),
                category_id: formData.get('category_id') || null
            };

            // Validation
            if (!updateData.title) {
                alert('Task title is required');
                return;
            }

            // Validate category exists if provided
            if (updateData.category_id && !loadedCategories.find(cat => cat.id == updateData.category_id)) {
                alert('Invalid category selected');
                return;
            }

            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updateData)
                });

                const result = await response.json();

                if (result.error) {
                    throw new Error(result.error);
                } else {
                    // Success - reload tasks
                    loadTasks();
                    alert('Task updated successfully!');
                }

            } catch (error) {
                console.error('Error updating task:', error);
                alert(`Error updating task: ${error.message}`);
                // Restore original content on error
                taskItem.innerHTML = originalContent;
            }
        });

    } catch (error) {
        console.error('Error editing task:', error);
        alert(`Error editing task: ${error.message}`);
    }
}

// Edit category functionality (improved with inline form)
async function editCategory(categoryId, currentName, currentColor) {
    // Create edit form
    const editForm = document.createElement('form');
    editForm.className = 'edit-category-form';
    editForm.innerHTML = `
        <div class="form-row">
            <div class="form-group">
                <label>Name *</label>
                <input type="text" name="name" value="${currentName.replace(/"/g, '&quot;')}" required maxlength="50">
            </div>
            <div class="form-group">
                <label>Color *</label>
                <input type="color" name="color" value="${currentColor}" required>
            </div>
        </div>
        <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-sm">Save</button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="cancelEdit(this)">Cancel</button>
        </div>
    `;

    // Find the category item and replace its content temporarily
    const categoryItem = document.querySelector(`button[onclick*="editCategory(${categoryId}"]`).closest('.category-item');
    const originalContent = categoryItem.innerHTML;
    categoryItem.innerHTML = '';
    categoryItem.appendChild(editForm);

    // Handle form submission
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const updateData = {
            name: formData.get('name').trim(),
            color: formData.get('color')
        };

        // Validation
        if (!updateData.name) {
            alert('Category name is required');
            return;
        }

        try {
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            const result = await response.json();

            if (result.error) {
                throw new Error(result.error);
            } else {
                // Success - reload everything
                loadCategories().then(() => {
                    loadTasks();
                });
                alert('Category updated successfully!');
            }

        } catch (error) {
            console.error('Error updating category:', error);
            alert(`Error updating category: ${error.message}`);
            // Restore original content on error
            categoryItem.innerHTML = originalContent;
        }
    });
}

// Change task status with one click
async function changeTaskStatus(taskId, newStatus) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        // Success - reload tasks to show updated status
        await loadTasks();
    } catch (error) {
        console.error('Error changing task status:', error);
        alert(`Error changing task status: ${error.message}`);
    }
}

// Delete task with confirmation
async function deleteTask(taskId, taskTitle) {
    if (!confirm(`Are you sure you want to delete the task "${taskTitle}"?`)) {
        return;
    }

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        // Success - reload tasks
        await loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert(`Error deleting task: ${error.message}`);
    }
}

// Delete category with confirmation
async function deleteCategory(categoryId, categoryName) {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This will only work if no tasks are using this category.`)) {
        return;
    }

    try {
        const response = await fetch(`/api/categories/${categoryId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }

        // Success - reload categories and tasks
        await loadCategories();
        await loadTasks();
    } catch (error) {
        console.error('Error deleting category:', error);
        alert(`Error deleting category: ${error.message}`);
    }
}

// Cancel edit and restore original content
function cancelEdit(button) {
    const item = button.closest('.category-item') || button.closest('.task-item');
    if (item) {
        if (item.classList.contains('category-item')) {
            // For category editing, reload categories
            loadCategories();
        } else if (item.classList.contains('task-item')) {
            // For task editing, reload tasks
            loadTasks();
        }
    }
}
