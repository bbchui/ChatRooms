class Chat {
  constructor(socket) {
    this.socket = socket
  }

  sendMessage(room, msg, nickname) {
    this.socket.emit('message', {text: msg, room, nickname})
  }

  changeRoom(room) {
    this.socket.emit('join', {newRoom: room})
  }

  processCommand(command) {
    const words = command.split(' ')
    const cmd = words[0].split('/')[1]
    let msg = false

    switch (cmd) {
      case 'join':
        words.shift()
        const room = words.join(' ')
        this.changeRoom(room)
        break
      case 'nick':
        words.shift()
        const name = words.join(' ')
        this.socket.emit('nameChange', name)
        break
      default:
      msg = 'Invalid Command'
      break
    }

    return msg
  }

}

module.exports = Chat
