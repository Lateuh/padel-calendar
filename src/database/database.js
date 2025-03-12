const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS notification (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL)`);

  // Ajouter un index sur la colonne date
  db.run(`CREATE INDEX IF NOT EXISTS idx_date ON notification(date)`);
});

module.exports = db;
