CREATE TABLE IF NOT EXISTS task (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    category_id INTEGER,
    priority_id INTEGER,
    description TEXT,
    due_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (priority_id) REFERENCES priority(id)
);

CREATE TABLE IF NOT EXISTS category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    color VARCHAR(7) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS priority (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    level INTEGER NOT NULL DEFAULT 0,
    color TEXT DEFAULT '#808080',
    description TEXT  
);

CREATE INDEX idx_task_category_id ON task(category_id);
CREATE INDEX idx_task_status ON task(status);
CREATE INDEX idx_task_priority_id ON task(priority_id);
CREATE INDEX idx_task_due_date ON task(due_date);