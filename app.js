// const http = require('http');
// const socketIo = require('socket.io');
// const cors = require('cors'); // Import CORS middleware

// const server = http.createServer();
// const io = socketIo(server, {
//   cors: {
//     origin: true
//   }
// });

// let players = []; // Array to store player positions

// let playerNum = 0;

// // Socket.IO events
// io.on('connection', (socket) => {
//   console.log(`user id ${socket.id}`);
  
//   // Assign player number on connection
//   players.push({ x: 0, y: 0 }); // Initial position for new player
//   playerNum++;
//   io.emit("connected" , playerNum);

//   socket.on("playerMovement" , (data) => {
//     // Validate movement (e.g., within boundaries)
//     const validMovement = validateMovement(data); // Implement validation logic

//     if (validMovement) {
//       players[playerNum] = data; // Update player position on server
//       io.emit("playerUpdate", players); // Broadcast updated player positions
//     }
//   })

//   // Handle disconnection
//   socket.on('disconnect', () => {
//     players.splice(playerNum, 1); // Remove disconnected player
//     playerNum--;
//     io.emit("playerUpdate", players); // Broadcast updated player positions
//   });
// });

// // Start the server
// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // Implement a function to validate player movement (example)
// function validateMovement(data) {
//   // Implement logic to check if movement is within valid boundaries
//   // ...
//   return true; // Return true if movement is valid, false otherwise
// }






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
    io.emit("connected" ,  countUsers);

    socket.on("playerMovement" , (data) => {
        // console.log("kkk",data);
          socket.broadcast.emit("playerUp", data);
    })

    // Handle disconnection
    socket.on('disconnect', () => {
        countUsers--;
        console.log('A user disconnected');
        io.emit("connected" ,  countUsers);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
