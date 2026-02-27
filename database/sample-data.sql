-- Sample Data for Task Manager
-- Template provides: Minimal working data for demo
-- STUDENT TASK: Extend with more comprehensive sample data

-- Sample categories (minimal - you add description field and more categories)
INSERT INTO category (id, name, color) VALUES
(1, 'Work', '#FF6B6B'),
(2, 'Study', '#4ECDC4');

-- Sample tasks (working demo with category relationships)
INSERT INTO task (id, title, status, category_id) VALUES
(1, 'Complete Supplementary Assessment', 'in_progress', 1), -- Work category
(2, 'Learn Node.js Basics', 'completed', 2), -- Study category
(3, 'Test CRUD Operations', 'pending', 1); -- Work category

-- TODO: Add priority sample data after creating priority table
-- TODO: Update tasks to include category_id and priority_id relationships
-- TODO: Add more sample tasks with descriptions and due dates
