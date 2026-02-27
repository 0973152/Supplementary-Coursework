CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    category_id INTEGER,  -- Foreign key to category table (WORKING DEMO)
    -- TODO: Add priority_id INTEGER (foreign key to priority.id) - Students implement this
    -- TODO: Add description TEXT - Students implement this
    -- TODO: Add due_date DATETIME - Students implement this
    -- TODO: Add created_at DATETIME DEFAULT CURRENT_TIMESTAMP - Students implement this
    -- TODO: Add updated_at DATETIME - Students implement this
    FOREIGN KEY (category_id) REFERENCES category(id)
    -- TODO: Add FOREIGN KEY (priority_id) REFERENCES priority(id) - Students implement this
);

CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL  -- Hex color code
);

-- TODO: Create priority table for students to implement

-- TODO: Add indexes for better performance
-- CREATE INDEX idx_task_category_id ON task(category_id);
-- CREATE INDEX idx_task_status ON task(status);