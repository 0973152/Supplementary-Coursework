import express from 'express'
import path from 'path'
import cors from 'cors'

import { taskRoute } from './routes/task'
import { categoryRoute } from './routes/category'
import { priorityRoute } from './routes/priority'

let app = express()
let PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, '../public')))

app.use('/api', taskRoute)
app.use('/api', categoryRoute)
app.use('/api/priorities', priorityRoute)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📖 API documentation available in README.md`)
})