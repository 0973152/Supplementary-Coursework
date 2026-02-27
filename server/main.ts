import express from 'express'
import path from 'path'
import cors from 'cors'

// Import routes
import { taskRoute } from './routes/task'
import { categoryRoute } from './routes/category'

let app = express()
let PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')))

// API routes
app.use('/api', taskRoute)
app.use('/api', categoryRoute)

// Default route - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📖 API documentation available in README.md`)
})
