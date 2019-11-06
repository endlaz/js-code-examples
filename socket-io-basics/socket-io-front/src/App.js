
import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

// By importing and calling the socketIOClient function
// We will make a connection to our server and store the connection inside a const
// We use the const to listen and send data between this component and the server
const socket = socketIOClient("http://localhost:4000");

class App extends Component {
  state = {
    chatMsgs: [],
    message: ''
  }
  componentDidMount() {
    // In the back-end we send a message to the client when the client is connected
    // with .on() we can listen to an event and get the message
    socket.on('welcome', (message) => {
      console.log(message)
    })
    // Thats basicly everything you need to know about how to setup, connect and communicate with socket.
    // To give you a more useful example, we will create a simple chat app of this front-end
    // The server will send every message from other clients to you
    // We only have to listen for it and save it in our local state
    socket.on('updateChat', (message) => {
      this.setState({
        chatMsgs: [message, ...this.state.chatMsgs]
      })
    })
  }

  // This function should look familiar from previous forms you made
  onChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  // In the onSubmit function we will send the new message to the server using socketIO
  // The server will send it to all other connected clients
  onSubmit = (event) => {
    event.preventDefault();
    // We will send the message to the server by using the .emit() method of socketIO
    // We call our socket event 'newChatMessage'. You are allowed to call it 'new chat message' but it think its better to not use spaces
    socket.emit('newChatMessage', this.state.message);

    // After we send the message, we add your message to your chat window and clear the input field
    this.setState({
      chatMsgs: [this.state.message, ...this.state.chatMsgs],
      message: ''
    })
  }

  render() { 
    return (
      <React.Fragment>
        <h1>Socket.IO example</h1>
        <form onSubmit={this.onSubmit}>
          <input type="text" name="message" value={this.state.message} onChange={this.onChange} />
          <button type="submit">Send</button>
          <ul>
            {this.state.chatMsgs.map(msg => {
              return <li key={msg}>{msg}</li>;
            })}
          </ul>
        </form>
      </React.Fragment>
    );
  }
}
 
export default App;