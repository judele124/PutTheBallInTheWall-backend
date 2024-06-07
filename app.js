const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS middleware

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

    socket.on("joinRoom", (roomName) => {
        console.log(`User ${socket.id} joining room: ${roomName}`);
        socket.join(roomName);

        // Initialize the room in the rooms object if it doesn't exist
        if (!rooms[roomName]) {
            rooms[roomName] = 0;
        }

        // Increment the player count in the room
        rooms[roomName]++;
        console.log(`Room ${roomName} now has ${rooms[roomName]} players`);

        // Emit the current number of connected players in the room
        socket.emit("playerConnected", rooms[roomName]);

        // Start the game if there are exactly 2 players in the room
        if (rooms[roomName] === 2) {
            io.in(roomName).emit("startGame");
        }

        // Handle player movement
        socket.on("playerMovement", (data) => {
            console.log(roomName);
            socket.to(roomName).emit("playerUpdate", data);
        });

        // Handle disc touch
        socket.on("discTouch", (discVelocity) => {
            socket.to(roomName).emit("discUpdate", discVelocity);
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            rooms[roomName]--;
            console.log(`User disconnected: ${socket.id} from room: ${roomName}`);
            console.log(`Room ${roomName} now has ${rooms[roomName]} players`);

            io.in(roomName).emit("playerConnected", rooms[roomName]);

            // Optionally stop the game if a player disconnects
            if (rooms[roomName] < 2) {
                io.in(roomName).emit("stopGame");
            }

            // Clean up the room if no players are left
            if (rooms[roomName] === 0) {
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
