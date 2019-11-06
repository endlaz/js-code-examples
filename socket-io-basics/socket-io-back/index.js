// Regular express server
const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`Server up and running on port ${port}`));
// Socket.IO server
const socketIo = require('socket.io');
const io = socketIo(server);

// The 2 main socket.IO methods are .on() and .emit()
// With .on() you are listening
// With .emit() you are sending
// The first argument of both methods should be a string with any value. It's the event.
// You are allowed to use spaces in the string
// The 'connection' event is a default of socket.IO
// In case a client makes a connection to our socket.IO server we will invoke a callback function
// The socket parameter will contain data from the connected client
// We need that data to send (emit) to the specific client for example
io.on('connection', (socket) => {
  // A new client is connected with our server
  // We will log it
  console.log('A client is connected');

  // To demonstrate how .on() and .emit() works, we will send a message to the client
  // In the client, i console logged the message that i'm sending with the following emit
  socket.emit('welcome', 'Welcome, you are successfully connected with the server');

  // An other default event is disconnect
  socket.on('disconnect', () => {
    console.log('A client disconnected')
  });
  
  // Thats basicly everything you need to know about how to setup, connect and communicate with socketIO.
  // To give you a more useful example, we will create a simple chat app and use the server to receive a message and send it to all connected clients
  socket.on('newChatMessage', (msg) => {
    // we will receive the message in the msg parameter
    // Now we send the message to all the clients EXCEPT the client that sended the message
    socket.broadcast.emit('updateChat', msg);
    // There are some other functions to send to specific clients and rooms. You can find a cheatsheet on https://socket.io/docs/emit-cheatsheet/
  })
})