import { Router } from 'express'
import { db } from '../database'

export let taskRoute = Router()

// Type definitions
interface Task {
  id: number
  title: string
  status: string
  category_id: number
}

let selectTasksByCategoryId = db.prepare<
  { category_id: number | null },
  Task
>(/* sql */ `
  select
    task.id,
    task.title,
    task.status,
    task.category_id
  from task
  where task.category_id = :category_id or :category_id is null
  order by task.id desc
`)

// GET /api/tasks - Get all tasks or filter by category id
taskRoute.get('/tasks', (req, res) => {
  try {
    let category_id = Number(req.query.category_id) || null
    let tasks = selectTasksByCategoryId.all({ category_id })
    res.json({ tasks })
  } catch (error) {
    console.error('Error select all tasks:', error)
    res.status(500).json({ error: 'Failed to fetch tasks' })
  }
})

// WORKING DEMO: Handle category relationships
let hasCategory = db.prepare(/* sql */ `
  select count(*) from category where id = ?
`)

// POST /api/tasks - Create new task
taskRoute.post('/tasks', (req, res) => {
  try {
    let title = req.body.title?.trim()
    let status = 'pending'
    let category_id = req.body.category_id

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Task title is required' })
    }
    if (!category_id) {
      return res.status(400).json({ error: 'Missing category id' })
    }
    if (!hasCategory.get(category_id)) {
      return res.status(400).json({ error: 'Invalid category id' })
    }

    // WORKING DEMO: Handle category relationships
    let id = db.insert('task', { title, status, category_id })

    // return the id of newly inserted task to frontend
    res.status(201).json({ id })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

let hasTask = db.prepare(/* sql */ `
  select count(*) from task where id = ?
`)

// PATCH /api/tasks/:id - Update task
taskRoute.patch('/tasks/:id', (req, res) => {
  try {
    let id = Number(req.params.id)
    if (!hasTask.get(id)) {
      return res.status(404).json({ error: 'Task not found' })
    }

    let updates: Partial<Pick<Task, 'title' | 'status' | 'category_id'>> = {}

    // Collect valid updates
    if ('title' in req.body) {
      let title = req.body.title.trim()
      if (!title) {
        return res.status(400).json({ error: 'Task title cannot be empty' })
      }
      updates.title = title
    }

    if ('status' in req.body) {
      let status = req.body.status.trim()
      if (!status) {
        return res.status(400).json({ error: 'Task status is required' })
      }
      if (!['pending', 'in_progress', 'completed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' })
      }
      updates.status = status
    }

    if ('category_id' in req.body) {
      let category_id = req.body.category_id
      if (category_id && !hasCategory.get(category_id)) {
        return res.status(400).json({ error: 'Invalid category id' })
      }
      updates.category_id = category_id || null
    }

    // Apply updates
    db.update('task', updates, { id })

    // empty object is enough to indicate success
    res.status(200).json({})
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE /api/tasks/:id - Delete task
taskRoute.delete('/tasks/:id', (req, res) => {
  try {
    let id = Number(req.params.id)
    if (!hasTask.get(id)) {
      return res.status(404).json({ error: 'Task not found' })
    }

    // Delete task
    db.delete('task', { id })

    // empty object is enough to indicate success
    res.status(200).json({})
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})
