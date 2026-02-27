import { Router } from 'express'
import { db } from '../database'

export let taskRoute = Router()

interface Task {
  id: number
  title: string
  status: string
  category_id: number | null
  priority_id: number | null
  description: string | null
  due_date: string | null
  created_at: string
  updated_at: string | null
}

let selectTasksByCategoryId = db.prepare<
  { category_id: number | null },
  Task & {
    category_name: string
    category_color: string
    priority_name: string
    priority_color: string
  }
>(/* sql */ `
  select
    task.id,
    task.title,
    task.status,
    task.category_id,
    task.priority_id,
    task.description,
    task.due_date,
    task.created_at,
    task.updated_at,
    category.name as category_name,
    category.color as category_color,
    priority.name as priority_name,
    priority.color as priority_color
  from task
  left join category on task.category_id = category.id
  left join priority on task.priority_id = priority.id
  where (task.category_id = :category_id or :category_id is null)
  order by task.id desc
`)

let hasCategory = db.prepare<[number], { count: number }>(/* sql */ `
  select count(*) as count from category where id = ?
`)

let hasPriority = db.prepare<[number], { count: number }>(/* sql */ `
  select count(*) as count from priority where id = ?
`)

let hasTask = db.prepare<[number], { count: number }>(/* sql */ `
  select count(*) as count from task where id = ?
`)

let selectTaskById = db.prepare<
  [number],
  Task & {
    category_name: string
    category_color: string
    priority_name: string
    priority_color: string
  }
>(/* sql */ `
  select
    task.id,
    task.title,
    task.status,
    task.category_id,
    task.priority_id,
    task.description,
    task.due_date,
    task.created_at,
    task.updated_at,
    category.name as category_name,
    category.color as category_color,
    priority.name as priority_name,
    priority.color as priority_color
  from task
  left join category on task.category_id = category.id
  left join priority on task.priority_id = priority.id
  where task.id = ?
`)

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

taskRoute.post('/tasks', (req, res) => {
  try {
    let title = req.body.title?.trim()
    let status = req.body.status || 'pending'
    let category_id = req.body.category_id
    let priority_id = req.body.priority_id
    let description = req.body.description?.trim() || null
    let due_date = req.body.due_date || null

    if (!title) {
      return res.status(400).json({ error: 'Task title is required' })
    }
    if (!category_id) {
      return res.status(400).json({ error: 'Missing category id' })
    }
    let categoryExists = hasCategory.get(category_id)
    if (!categoryExists || categoryExists.count === 0) {
      return res.status(400).json({ error: 'Invalid category id' })
    }
    if (priority_id) {
      let priorityExists = hasPriority.get(priority_id)
      if (!priorityExists || priorityExists.count === 0) {
        return res.status(400).json({ error: 'Invalid priority id' })
      }
    }

    let id = db.insert('task', {
      title,
      status,
      category_id,
      priority_id,
      description,
      due_date
    })

    let newTask = selectTaskById.get(id)
    res.status(201).json({ task: newTask })
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Failed to create task' })
  }
})

// PATCH /api/tasks/:id
taskRoute.patch('/tasks/:id', (req, res) => {
  try {
    let id = Number(req.params.id)
    let taskExists = hasTask.get(id)
    if (!taskExists || taskExists.count === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    let updates: any = {}

    if ('title' in req.body) {
      let title = req.body.title?.trim()
      if (!title) {
        return res.status(400).json({ error: 'Task title cannot be empty' })
      }
      updates.title = title
    }

    if ('status' in req.body) {
      let status = req.body.status?.trim()
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
      if (category_id) {
        let categoryExists = hasCategory.get(category_id)
        if (!categoryExists || categoryExists.count === 0) {
          return res.status(400).json({ error: 'Invalid category id' })
        }
        updates.category_id = category_id
      } else {
        updates.category_id = null
      }
    }

    if ('priority_id' in req.body) {
      let priority_id = req.body.priority_id
      if (priority_id) {
        let priorityExists = hasPriority.get(priority_id)
        if (!priorityExists || priorityExists.count === 0) {
          return res.status(400).json({ error: 'Invalid priority id' })
        }
        updates.priority_id = priority_id
      } else {
        updates.priority_id = null
      }
    }

    if ('description' in req.body) {
      updates.description = req.body.description?.trim() || null
    }

    if ('due_date' in req.body) {
      updates.due_date = req.body.due_date || null
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    updates.updated_at = new Date().toISOString()

    db.update('task', updates, { id })

    let updatedTask = selectTaskById.get(id)
    res.status(200).json({ task: updatedTask })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Failed to update task' })
  }
})

// DELETE /api/tasks/:id
taskRoute.delete('/tasks/:id', (req, res) => {
  try {
    let id = Number(req.params.id)
    let taskExists = hasTask.get(id)
    if (!taskExists || taskExists.count === 0) {
      return res.status(404).json({ error: 'Task not found' })
    }

    db.delete('task', { id })
    res.status(200).json({})
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Failed to delete task' })
  }
})