INSERT OR IGNORE INTO priority (id, name, level, color, description) VALUES
(1, 'Low', 1, '#28a745', 'Low priority tasks'),
(2, 'Medium', 2, '#ffc107', 'Medium priority tasks'),
(3, 'High', 3, '#dc3545', 'High priority tasks');

INSERT INTO category (id, name, color) VALUES
(1, 'Work', '#FF6B6B'),
(2, 'Study', '#4ECDC4');

INSERT INTO task (id, title, status, category_id, priority_id, description, due_date, updated_at) VALUES
(1, 'Complete Supplementary Assessment', 'in_progress', 1, 3, 'Finish the coursework by deadline', '2026-03-02 23:59:00', NULL),
(2, 'Learn Node.js Basics', 'completed', 2, 2, 'Complete online tutorial', '2026-02-28 18:00:00', NULL),
(3, 'Test CRUD Operations', 'pending', 1, 1, 'Verify all endpoints work', '2026-03-01 12:00:00', NULL);
