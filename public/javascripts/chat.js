class Chat {
  constructor(socket) {
    this.socket = socket
  }

  sendMessage(room, msg) {
    this.socket.emit('message', {text: msg, room})
  }
}

module.exports = Chat
