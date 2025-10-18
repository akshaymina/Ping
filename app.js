// Socket.IO setup
const io = require("socket.io-client");
const socket = io("http://localhost:3000");

// Export the socket for use in other modules
module.exports = socket;



