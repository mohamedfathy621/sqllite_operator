import fs from 'fs';
import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('../assets/fulldata.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});
const sql = `select * from students`;
fs.access('../assets/fulldata.db', fs.constants.F_OK, (err) => {
    if (err) {
        db.serialize(() => {
            db.run("CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,job_title TEXT, salary INTEGER, phone_number TEXT, paid INTEGER)");
            db.run("CREATE TABLE IF NOT EXISTS parents (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phone_number TEXT )");
            db.run("CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT,parent_name TEXT"+
                   ", parent_code INTEGER, tution INTEGER, phone_number TEXT, paid INTEGER, bus INTEGER, FOREIGN KEY(parent_code) REFERENCES parents(id))");
            // Insert example data
            console.log("table_created");
        });
    } else {
        db.run(sql);
        console.log('Database already created');
    }
});
