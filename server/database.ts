import { toSafeMode, newDB, DBInstance } from 'better-sqlite3-schema'
import fs from 'fs'
import path from 'path'

export const dbFile = './database/db.sqlite3'

export const db: DBInstance = newDB({
  path: dbFile,
  migrate: false,
})

toSafeMode(db)

const tableCheck = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='task'").get();
if (!tableCheck) {
    console.log('Database tables not found. Creating schema...');
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    console.log('Reading schema from:', schemaPath);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
    console.log('Schema created successfully.');

    const sampleDataPath = path.join(process.cwd(), 'database', 'sample-data.sql');
    if (fs.existsSync(sampleDataPath)) {
        console.log('Inserting sample data...');
        const sampleSql = fs.readFileSync(sampleDataPath, 'utf8');
        db.exec(sampleSql);
        console.log('Sample data inserted.');
    } else {
        console.log('sample-data.sql not found, skipping sample data.');
    }
}