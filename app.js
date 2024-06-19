const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS middleware
const Player = require("./classes/Player.js");
const Room = require("./classes/Room.js");
const server = http.createServer();
const io = socketIo(server, {
    cors: {
        origin: "*", // Allow all origins. Adjust this for production to be more specific.
        methods: ["GET", "POST"],
    }
});

const rooms = {}; // To keep track of players in each room
// Socket.IO events
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    const player = new Player(socket.id);
    socket.on("joinRoom", (roomName) => {
        socket.join(roomName);
        // Create a new room if it doesn't exist
        if (!rooms[roomName]) {
            const room = new Room(roomName);
            rooms[roomName] = room;
        }

        // Emit the current number of connected players in the room
        socket.emit("playerConnected", rooms[roomName].addPlayer(player));

        const currentPlayerCount = rooms[roomName].currentPlayerCount();

        // Fix Logs
        console.log(`User ${player.socketId} joined room: ${roomName}, total players: ${currentPlayerCount}`);

        // Start the game if there are exactly 2 players in the room
        if (currentPlayerCount === 2) {
            io.in(roomName).emit("startGame");
            rooms[roomName].startTimer();
            console.log("Room: ", roomName);
            console.log(rooms[roomName].players);
        }

        // Handle player movement
        socket.on("playerMovement", (data) => {
            socket.to(roomName).emit("playerUpdate", data);
        });

        // Handle disc touch
        socket.on("discTouch", (discVelocity) => {
            io.in(roomName).emit("discUpdate", discVelocity);
        });

        socket.on("playerGoal", (scoringPlayerIndex) => {
            const score = rooms[roomName].incrementPlayerScore(scoringPlayerIndex);
            io.in(roomName).emit("updateScore", { scoringPlayerIndex, score })
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            // pause the game if the player disconnects

            // wait for the other player to disconnect and give chence to the other player to reconnect
            rooms[roomName].removePlayer(player);

            console.log(`User ${player.socketId} left room: ${roomName}, total players: ${rooms[roomName].currentPlayerCount()}`);

            io.in(roomName).emit("playerDisconnected");
            const winner = rooms[roomName].getWinner()

            console.log("winner: ", winner);

            if (rooms[roomName] && rooms[roomName].isEmpty()) {
                rooms[roomName].endGame();
                socket.leave(roomName);
                console.log("room deleted");
                delete rooms[roomName];
            }
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
