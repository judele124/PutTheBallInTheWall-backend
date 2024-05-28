const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS middleware

const server = http.createServer();
const io = socketIo(server, {
    cors: {
        origin: true
    }
});

let countUsers = 0;


// Socket.IO events
io.on('connection', (socket) => {
    console.log(`user id ${socket.id}`);
    countUsers++;
    // Listen for messages from clients
    socket.emit("playerConnected", countUsers);

    if (countUsers == 2) io.emit("startGame")

    socket.on("playerMovement", (data) => {
        socket.broadcast.emit("playerUpdate", data);
    })

    socket.on("discTouch", (discVelocity) => {
        socket.broadcast.emit("discUpdate", discVelocity);
    })

    // Handle disconnection
    socket.on('disconnect', () => {
        countUsers--;
        console.log('A user disconnected');
        io.emit("playerConnected", countUsers);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
