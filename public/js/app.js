// ==================== Global Variables ====================
let loadedCategories = [];
let loadedPriorities = [];
let currentCategoryFilter = '';

// ==================== Initialization ====================
async function init() {
    await loadCategories();
    await loadPriorities();
    await loadTasks();
    setupCategoryFilter();

    document.getElementById('task-form').addEventListener('submit', handleTaskSubmit);
    document.getElementById('category-form').addEventListener('submit', handleCategorySubmit);
}

// ==================== Priority Related ====================
async function loadPriorities() {
    try {
        const response = await fetch('/api/priorities');
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        loadedPriorities = result.priorities;
        populatePriorityDropdown();
    } catch (error) {
        console.error('Error loading priorities:', error);
    }
}

function populatePriorityDropdown(selectElementId = 'priority') {
    const select = document.getElementById(selectElementId);
    if (!select) return;
    select.innerHTML = '<option value="">-- Select Priority (optional) --</option>';
    loadedPriorities.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.name;
        option.style.backgroundColor = p.color;
        option.style.color = '#fff';
        select.appendChild(option);
    });
}

// ==================== Task Related ====================
async function loadTasks() {
    try {
        let url = '/api/tasks';
        if (currentCategoryFilter) {
            url += `?category_id=${currentCategoryFilter}`;
        }
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        displayTasks(result.tasks);
    } catch (error) {
        console.error('Error loading tasks:', error);
        document.getElementById('tasks-container').innerHTML = '<p>Error loading tasks. Please try again later.</p>';
    }
}

function displayTasks(tasks) {
    const container = document.getElementById('tasks-container');
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p>No tasks found. Create your first task above!</p>';
        return;
    }
    const tasksHtml = tasks.map(task => createTaskHtml(task)).join('');
    container.innerHTML = tasksHtml;
}

function createTaskHtml(task) {
    const category = loadedCategories.find(cat => Number(cat.id) === Number(task.category_id));
    const categoryHtml = category
        ? `<span class="task-category" style="background-color: ${category.color}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.8em;">${category.name}</span>`
        : '<span class="task-category-placeholder">No category</span>';

    // Priority tag (requires backend to return priority_name and priority_color)
    const priorityTag = task.priority_name
        ? `<span class="priority-tag" style="background-color: ${task.priority_color};">${task.priority_name}</span>`
        : '';

    // Description (short preview)
    const descriptionHtml = task.description
        ? `<div class="task-description">${task.description.substring(0, 50)}${task.description.length > 50 ? '…' : ''}</div>`
        : '';

    // Due date
    const dueDateHtml = task.due_date
        ? `<span class="due-date">Due: ${new Date(task.due_date).toLocaleString()}</span>`
        : '';

    const statusButtons = ['pending', 'in_progress', 'completed']
        .filter(s => s !== task.status)
        .map(status => `<button class="btn btn-outline-secondary btn-xs status-btn" onclick="changeTaskStatus(${task.id}, '${status}')">${status.replace('_', ' ')}</button>`)
        .join('');

    return `
        <div class="task-item ${task.status}" data-id="${task.id}">
            <div class="task-title">${task.title}</div>
            ${descriptionHtml}
            <div class="task-meta">
                <span class="task-status status-${task.status}">${task.status.replace('_', ' ')}</span>
                ${statusButtons ? `<div class="quick-status-actions">${statusButtons}</div>` : ''}
                ${priorityTag}
                ${dueDateHtml}
                ${categoryHtml}
            </div>
            <div class="task-actions">
                <button class="btn btn-secondary btn-sm" onclick="editTask(${task.id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id}, '${task.title.replace(/'/g, "\\'")}')">Delete</button>
            </div>
        </div>
    `;
}

async function handleTaskSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const taskData = {
        title: formData.get('title').trim(),
        status: 'pending',
        category_id: currentCategoryFilter,
        description: document.getElementById('description')?.value.trim() || null,
        priority_id: document.getElementById('priority')?.value || null,
        due_date: document.getElementById('due-date')?.value || null
    };

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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        event.target.reset();
        loadTasks();
    } catch (error) {
        console.error('Error adding task:', error);
        alert(`Error adding task: ${error.message}`);
    }
}

async function editTask(taskId) {
    try {
        const response = await fetch('/api/tasks');
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        const task = result.tasks.find(t => t.id == taskId);
        if (!task) {
            alert('Task not found');
            return;
        }

        const categoryOptions = loadedCategories.map(cat =>
            `<option value="${cat.id}" ${task.category_id == cat.id ? 'selected' : ''}>${cat.name}</option>`
        ).join('');
        const priorityOptions = loadedPriorities.map(p =>
            `<option value="${p.id}" ${task.priority_id == p.id ? 'selected' : ''}>${p.name}</option>`
        ).join('');

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
                <div class="form-group" style="flex: 1;">
                    <label>Priority</label>
                    <select name="priority_id">
                        <option value="">-- Select Priority --</option>
                        ${priorityOptions}
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="2">${task.description ? task.description.replace(/"/g, '&quot;') : ''}</textarea>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Due Date</label>
                    <input type="datetime-local" name="due_date" value="${task.due_date ? task.due_date.slice(0,16) : ''}">
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-sm">Save</button>
                <button type="button" class="btn btn-secondary btn-sm" onclick="cancelEdit(this)">Cancel</button>
            </div>
        `;

        const taskItem = document.querySelector(`.task-item[data-id="${taskId}"]`);
        const originalContent = taskItem.innerHTML;
        taskItem.innerHTML = '';
        taskItem.appendChild(editForm);

        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updateData = {
                title: formData.get('title').trim(),
                status: formData.get('status'),
                category_id: formData.get('category_id') || null,
                priority_id: formData.get('priority_id') || null,
                description: formData.get('description')?.trim() || null,
                due_date: formData.get('due_date') || null
            };

            if (!updateData.title) {
                alert('Task title is required');
                return;
            }

            try {
                const response = await fetch(`/api/tasks/${taskId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updateData)
                });
                const result = await response.json();
                if (result.error) throw new Error(result.error);
                loadTasks();
            } catch (error) {
                console.error('Error updating task:', error);
                alert(`Error updating task: ${error.message}`);
                taskItem.innerHTML = originalContent;
            }
        });

    } catch (error) {
        console.error('Error editing task:', error);
        alert(`Error editing task: ${error.message}`);
    }
}

// ==================== Category Related ====================
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        loadedCategories = result.categories;

        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.innerHTML = '<option value="">All Categories</option>';

        const categoriesContainer = document.getElementById('categories-container');
        categoriesContainer.innerHTML = '';

        result.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);

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

async function handleCategorySubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const categoryData = {
        name: formData.get('name').trim(),
        color: formData.get('color')
    };

    if (!categoryData.name || !categoryData.color) {
        alert('Category name and color are required');
        return;
    }

    try {
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(categoryData)
        });
        const result = await response.json();
        if (result.error) throw new Error(result.error);
        await loadCategories();
        await loadTasks();
        event.target.reset();
        document.getElementById('category-color').value = '#FF6B6B';
        alert('Category added successfully!');
    } catch (error) {
        console.error('Error adding category:', error);
        alert(`Error adding category: ${error.message}`);
    }
}

async function editCategory(categoryId, currentName, currentColor) {
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

    const categoryItem = document.querySelector(`button[onclick*="editCategory(${categoryId}"]`).closest('.category-item');
    const originalContent = categoryItem.innerHTML;
    categoryItem.innerHTML = '';
    categoryItem.appendChild(editForm);

    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updateData = {
            name: formData.get('name').trim(),
            color: formData.get('color')
        };

        if (!updateData.name) {
            alert('Category name is required');
            return;
        }

        try {
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            const result = await response.json();
            if (result.error) throw new Error(result.error);
            await loadCategories();
            await loadTasks();
            alert('Category updated successfully!');
        } catch (error) {
            console.error('Error updating category:', error);
            alert(`Error updating category: ${error.message}`);
            categoryItem.innerHTML = originalContent;
        }
    });
}

async function deleteCategory(categoryId, categoryName) {
    if (!confirm(`Are you sure you want to delete the category "${categoryName}"? This will only work if no tasks are using this category.`)) return;
    try {
        const response = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        await loadCategories();
        await loadTasks();
    } catch (error) {
        console.error('Error deleting category:', error);
        alert(`Error deleting category: ${error.message}`);
    }
}

// ==================== Other Functions ====================
function setupCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    const addTaskBtn = document.getElementById('add-task-btn');
    categoryFilter.addEventListener('change', function() {
        currentCategoryFilter = this.value;
        loadTasks();
        addTaskBtn.disabled = !currentCategoryFilter;
        addTaskBtn.textContent = currentCategoryFilter ? 'Add Task to Selected Category' : 'Select a Category First';
        updateTaskListTitle();
    });
    addTaskBtn.disabled = true;
    addTaskBtn.textContent = 'Select a Category First';
}

function updateTaskListTitle() {
    const titleElement = document.getElementById('task-list-title');
    if (currentCategoryFilter) {
        const categoryFilter = document.getElementById('category-filter');
        const selectedOption = categoryFilter.querySelector(`option[value="${currentCategoryFilter}"]`);
        const categoryName = selectedOption ? selectedOption.textContent : 'Unknown';
        titleElement.textContent = `Tasks in "${categoryName}"`;
    } else {
        titleElement.textContent = 'All Tasks';
    }
}

async function changeTaskStatus(taskId, newStatus) {
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        await loadTasks();
    } catch (error) {
        console.error('Error changing task status:', error);
        alert(`Error changing task status: ${error.message}`);
    }
}

async function deleteTask(taskId, taskTitle) {
    if (!confirm(`Are you sure you want to delete the task "${taskTitle}"?`)) return;
    try {
        const response = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
        if (!response.ok) {
            const result = await response.json();
            throw new Error(result.error || `HTTP error! status: ${response.status}`);
        }
        await loadTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        alert(`Error deleting task: ${error.message}`);
    }
}

function cancelEdit(button) {
    const item = button.closest('.category-item') || button.closest('.task-item');
    if (item) {
        if (item.classList.contains('category-item')) {
            loadCategories();
        } else {
            loadTasks();
        }
    }
}

// ==================== Start Application ====================
init();