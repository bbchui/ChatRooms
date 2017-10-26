const io = require('socket.io');

let guestNum = 1;
const nickNames = {};
let usedNickNames = [];
const currentRoom = {};

const chatServer = {

  assignGuestName(socket, guestNum, nickNames, usedNickNames) {
    const name = `Guest_${guestNum}`
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
      success: true,
      name
    })
    usedNickNames.push(name)
    return guestNum += 1
  },

  nicknameChangeRequest(socket, nickNames, namesUsed) {
    socket.on('nameChange', (name) => {
      if (usedNickNames.includes(name)) {
        socket.emit('nameResult', {
          success: false,
          message: 'That name has been taken'
        });
      } else {
        const prevName = nickNames[socket.id]
        const prevNameIdx = usedNickNames.indexOf(prevName)
        socket.emit('nameResult', {
          success: true,
          name
        });

        socket.broadcast.emit('message', {
          text: `${nickNames[socket.id]} changed their nickname to ${name}`,
        })
        nickNames[socket.id] = name

        usedNickNames = usedNickNames.slice(0, prevNameIdx).concat(usedNickNames.slice(prevNameIdx + 1))

        usedNickNames.push(name)
      }
    })
  },

  handleMessageBroadcast (socket) {
    socket.on('message', (message) => {
      socket.broadcast.emit('message', {
        text: `${nickNames[socket.id]}: ${message.text}`
      })
    })
  },

  onDisconnect(socket) {
    socket.on('disconnect', () => {
      const nameIdx = usedNickNames.indexOf(nickNames[socket.id])
      delete nickNames[socket.id]
      usedNickNames = usedNickNames.slice(0, nameIdx).concat(usedNickNames.slice(nameIdx + 1))
    })
  },

  joinRoom(socket, room) {
    socket.join(room)
    currentRoom[socket.id] = room
    socket.emit('joinResult', {room})
    socket.broadcast.to(room).emit('message', {
      text: `${nickNames[socket.id]} has joined ${room}`
    })
  },


  listen (server) {
    chat = io(server)

    chat.on('connection', (socket) => {
      console.log(socket.id);
      guestNum = this.assignGuestName(socket, guestNum, nickNames, usedNickNames)
      this.nicknameChangeRequest(socket, nickNames, usedNickNames)
      this.handleMessageBroadcast(socket)
      this.onDisconnect(socket)
      // socket.on('message', data => {
      //   debugger
      //   chat.sockets.emit('message', data)
      // })
    })
  }
}

module.exports = chatServer
