import { Router } from 'express'
import { db } from '../database'

export let priorityRoute = Router()

interface Priority {
  id: number
  name: string
  level: number
  color: string
  description: string | null
}

let selectAllPriorities = db.prepare<[], Priority>(/* sql */ `
  select * from priority order by level
`)

let selectPriorityById = db.prepare<[number], Priority>(/* sql */ `
  select * from priority where id = ?
`)

let hasPriority = db.prepare<[number], { count: number }>(/* sql */ `
  select count(*) as count from priority where id = ?
`)

let hasPriorityName = db.prepare<[string], { count: number }>(/* sql */ `
  select count(*) as count from priority where name = ?
`)

priorityRoute.get('/', (req, res) => {
  try {
    let priorities = selectAllPriorities.all()
    res.json({ priorities })
  } catch (error) {
    console.error('Error fetching priorities:', error)
    res.status(500).json({ error: 'Failed to fetch priorities' })
  }
})

priorityRoute.get('/:id', (req, res) => {
  try {
    let id = Number(req.params.id)
    let priority = selectPriorityById.get(id)
    if (!priority) {
      return res.status(404).json({ error: 'Priority not found' })
    }
    res.json({ priority })
  } catch (error) {
    console.error('Error fetching priority:', error)
    res.status(500).json({ error: 'Failed to fetch priority' })
  }
})

priorityRoute.post('/', (req, res) => {
  try {
    let { name, level, color, description } = req.body
    if (!name || level === undefined) {
      return res.status(400).json({ error: 'Name and level are required' })
    }
    let nameExists = hasPriorityName.get(name)
    if (nameExists && nameExists.count > 0) {
      return res.status(400).json({ error: 'Priority name already exists' })
    }

    let id = db.insert('priority', {
      name,
      level,
      color: color || '#808080',
      description: description || null
    })
    let newPriority = selectPriorityById.get(id)
    res.status(201).json({ priority: newPriority })
  } catch (error: any) {
    console.error('Error creating priority:', error)
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Priority name must be unique' })
    }
    res.status(500).json({ error: 'Failed to create priority' })
  }
})

priorityRoute.patch('/:id', (req, res) => {
  try {
    let id = Number(req.params.id)
    let existing = selectPriorityById.get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Priority not found' })
    }

    let { name, level, color, description } = req.body
    let updates: any = {}

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ error: 'Name cannot be empty' })
      }
      if (name !== existing.name) {
        let nameExists = hasPriorityName.get(name)
        if (nameExists && nameExists.count > 0) {
          return res.status(400).json({ error: 'Priority name already exists' })
        }
      }
      updates.name = name
    }

    if (level !== undefined) {
      if (typeof level !== 'number' || isNaN(level)) {
        return res.status(400).json({ error: 'Level must be a number' })
      }
      updates.level = level
    }

    if (color !== undefined) {
      updates.color = color || '#808080'
    }

    if (description !== undefined) {
      updates.description = description || null
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'No fields to update' })
    }

    db.update('priority', updates, { id })
    let updatedPriority = selectPriorityById.get(id)
    res.json({ priority: updatedPriority })
  } catch (error: any) {
    console.error('Error updating priority:', error)
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'Priority name must be unique' })
    }
    res.status(500).json({ error: 'Failed to update priority' })
  }
})

priorityRoute.delete('/:id', (req, res) => {
  try {
    let id = Number(req.params.id)
    let existing = selectPriorityById.get(id)
    if (!existing) {
      return res.status(404).json({ error: 'Priority not found' })
    }

    let tasksUsing = db.prepare<[number], { count: number }>(/* sql */ `
      select count(*) as count from task where priority_id = ?
    `).get(id)
    if (tasksUsing && tasksUsing.count > 0) {
      return res.status(400).json({ error: 'Cannot delete priority because it is used by tasks' })
    }

    db.delete('priority', { id })
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting priority:', error)
    res.status(500).json({ error: 'Failed to delete priority' })
  }
})