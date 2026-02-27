import { Router } from 'express'
import { db } from '../database'
import { isValidColor } from '../utils/format'

export let categoryRoute = Router()

type Category = {
  id: number
  name: string
  color: string
}

let selectAllCategories = db.prepare<void[], Category>(/* sql */ `
  select
    id,
    name,
    color
  from category
  order by name
`)

let hasCategoryById = db
  .prepare(/* sql */ `select count(*) from category where id = ?`)
  .pluck()

let findCategoryByName = db
  .prepare(/* sql */ `select id from category where name = ?`)
  .pluck()

// GET /api/categories - Get all categories
categoryRoute.get('/categories', (req, res) => {
  try {
    let categories = selectAllCategories.all()
    res.json({ categories })
  } catch (error) {
    console.error('Error select all categories:', error)
    res.status(500).json({ error: 'Failed to select all categories' })
  }
})

// POST /api/categories - Create new category
categoryRoute.post('/categories', (req, res) => {
  try {
    let name = req.body.name?.trim()
    let color = req.body.color?.trim()

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' })
    }
    if (!color) {
      return res.status(400).json({ error: 'Category color is required' })
    }

    // Validate color format (hex color)
    if (!isValidColor(color)) {
      return res
        .status(400)
        .json({ error: 'Invalid color format (use #RRGGBB)' })
    }

    // Check for duplicate names
    if (findCategoryByName.get(name)) {
      return res.status(400).json({ error: 'Category name already exists' })
    }

    // Create category
    let id = db.insert('category', { name, color })

    // Return the created category
    res.status(201).json({ id })
  } catch (error) {
    console.error('Error creating category:', error)
    res.status(500).json({ error: 'Failed to create category' })
  }
})

// PATCH /api/categories/:id - Update category
categoryRoute.patch('/categories/:id', (req, res) => {
  try {
    let id = Number(req.params.id)

    // Check if category exists (like task update pattern)
    if (!hasCategoryById.get(id)) {
      return res.status(404).json({ error: 'Category not found' })
    }

    let name = req.body.name?.trim()
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' })
    }

    let color = req.body.color?.trim()
    if (!color) {
      return res.status(400).json({ error: 'Category color is required' })
    }

    // Validate color format (hex color)
    if (!isValidColor(color)) {
      return res
        .status(400)
        .json({ error: 'Invalid color format (use #RRGGBB)' })
    }

    // Check for duplicate names (excluding current category)
    let existingCategoryId = findCategoryByName.get(name)
    if (existingCategoryId && existingCategoryId !== id) {
      return res.status(400).json({ error: 'Category name already exists' })
    }

    // Update category
    db.update('category', { name, color }, { id })

    // empty object is enough to indicate success
    res.status(200).json({})
  } catch (error) {
    console.error('Error updating category:', error)
    res.status(500).json({ error: 'Failed to update category' })
  }
})

let countTasksByCategoryId = db
  .prepare<{ category_id: number }, number>(
    /* sql */ `select count(*) from task where category_id = :category_id`,
  )
  .pluck()

// DELETE /api/categories/:id - Delete category
categoryRoute.delete('/categories/:id', (req, res) => {
  try {
    let category_id = Number(req.params.id)

    // Check if category exists
    if (!hasCategoryById.get(category_id)) {
      return res.status(404).json({ error: 'Category not found' })
    }

    // Check if category is being used by any tasks
    let tasksUsingCategory = countTasksByCategoryId.get({ category_id }) || 0
    if (tasksUsingCategory > 0) {
      return res.status(400).json({
        error:
          'Cannot delete category that is being used by tasks. Reassign tasks first.',
      })
    }

    // Delete category
    db.delete('category', { id: category_id })

    // empty object is enough to indicate success
    res.status(200).json({})
  } catch (error) {
    console.error('Error deleting category:', error)
    res.status(500).json({ error: 'Failed to delete category' })
  }
})
