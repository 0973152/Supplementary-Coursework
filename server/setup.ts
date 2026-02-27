import { db } from './database'
import fs from 'fs'
import path from 'path'

console.log('Current working directory:', process.cwd())
console.log('__dirname:', __dirname)

// Read and execute schema.sql
let schemaPath = path.join(process.cwd(), 'database/schema.sql')
console.log('Schema path:', schemaPath)
let schemaSQL = fs.readFileSync(schemaPath, 'utf8')
db.exec(schemaSQL)

// Read and execute sample-data.sql
let sampleDataPath = path.join(process.cwd(), 'database/sample-data.sql')
console.log('Sample data path:', sampleDataPath)
let sampleDataSQL = fs.readFileSync(sampleDataPath, 'utf8')
db.exec(sampleDataSQL)

console.log('Database initialized successfully!')
