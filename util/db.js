const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('chatroom.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS rooms (
        roomId TEXT PRIMARY KEY,
        roomName TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        roomId TEXT,
        sender TEXT,
        message TEXT,
        timestamp TEXT,
        FOREIGN KEY(roomId) REFERENCES rooms(roomId)
    )`);
});

module.exports = db;
