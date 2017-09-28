const io = require('socket.io')

const chatServer = {
  listen (server) {
    chat = io(server)

    chat.on('connection', () => {
    })
    console.log("connected");
  }
}

module.exports = chatServer
