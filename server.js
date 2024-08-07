const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mysql = require('mysql');

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // replace with your MySQL username
  password: 'root', // replace with your MySQL password
  database: 'chat_app'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

// Retrieve and send all messages to the client
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('deleteData', (id, callback) => {
    const query = 'DELETE FROM messages WHERE id = ?';
    db.query(query, [id], (err) => {
      if (err) {
        console.error('Verilənlər bazasında silinmə xətası: ', err);
        return callback({ success: false, message: 'Silinmə xətası' });
      }
      callback({ success: true, message: 'Data uğurla silindi' });
    });
  });

  // Send all previous messages to the new user
  db.query('SELECT * FROM messages ORDER BY timestamp ASC', (err, results) => {
    if (err) {
      throw err;
    }
    results.forEach((message) => {
      socket.emit('chat message', message.message,message.id);
    });
  });

  socket.on('chat message', (msg) => {
    // Save message to database
    const query = 'INSERT INTO messages (message) VALUES (?)';
    db.query(query, [msg], (err, result) => {
      if (err) {
        throw err;
      }
      io.emit('chat message', msg);
    });
  });



  

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
