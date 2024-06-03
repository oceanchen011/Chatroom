const db = require('../util/db');
const roomGenerator = require('../util/roomIdGenerator.js');

async function fetchMessages(roomId) {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM messages WHERE roomId = ? ORDER BY timestamp ASC`, [roomId], (err, rows) => {
            if (err) {
                console.error('Error fetching messages:', err);
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function getRoom(request, response) {
    try {
        const roomId = request.query.roomId;
        db.get(`SELECT * FROM rooms WHERE roomId = ?`, [roomId], async (err, room) => {
            if (err) {
                console.error('Internal Server Error:', err);
                response.status(500).send('Internal Server Error');
            } else if (room) {
                try {
                    const messages = await fetchMessages(roomId);
                    response.render('room', { 
                        title: 'Chatroom', 
                        roomName: room.roomName, 
                        roomId: room.roomId,
                        messages: messages
                    });
                } catch (err) {
                    console.error('Error fetching messages:', err);
                    response.status(500).send('Internal Server Error');
                }
            } else {
                response.status(404).send('Room not found');
            }
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        response.status(500).send('Internal Server Error');
    }
}

async function createRoom(request, response) {
    const roomName = request.body.roomName;
    const roomId = roomGenerator.roomIdGenerator();

    db.run(`INSERT INTO rooms (roomId, roomName) VALUES (?, ?)`, [roomId, roomName], function(err) {
        if (err) {
            console.error('Error creating room:', err);
            response.status(500).send('Internal Server Error');
        } else {
            console.log(`Room created with ID: ${roomId}`);
            response.redirect(`/room?roomId=${roomId}`);
        }
    });
}

async function postMessage(request, response) {
    const { roomId, message, nickname } = request.body;

    const newMessage = {
        roomId,
        sender: nickname,
        message,
        timestamp: new Date().toISOString()
    };

    db.run(`INSERT INTO messages (roomId, sender, message, timestamp) VALUES (?, ?, ?, ?)`, 
    [roomId, nickname, message, newMessage.timestamp], function(err) {
        if (err) {
            console.error('Error posting message:', err);
            response.status(500).send('Internal Server Error');
        } else {
            response.status(200).send('Message posted');
        }
    });
}

async function getMessages(request, response) {
    const { roomId } = request.query;

    try {
        const messages = await fetchMessages(roomId);
        response.json({ messages });
    } catch (error) {
        console.error('Internal Server Error:', error);
        response.status(500).send('Internal Server Error');
    }
}

async function getHome(req, res) {
    try {
        db.all(`SELECT * FROM rooms`, [], (err, rows) => {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                res.render('home', { title: 'Home', data: rows });
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    getRoom,
    createRoom,
    postMessage,
    getMessages,
    getHome
};
