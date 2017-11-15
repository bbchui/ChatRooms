const io = require('socket.io');

let guestNum = 1;
const nickNames = {};

let usedNickNames = [];
const currentRoom = {};
let chat

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
      socket.broadcast.to(message.room).emit('message', {
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

    // chat.of('/').in(`${room}`).clients((err, sockets) => {
    //   if (err) return console.error(err)
    //   const usersInRoom = sockets.map(sId => nickNames[sId]).join(', ')
    //   const usersInRoomSummary = `Users currently in ${room}: ${usersInRoom}`
    //   socket.emit('message', {text: usersInRoomSummary})
    // })
  },

  handleRoomJoining (socket) {
    socket.on('join', (room) => {
      socket.leave(currentRoom[socket.id])
      this.joinRoom(socket, room.newRoom)
    })
  },
  listRooms (socket) { //list the name of rooms
   const rooms = Object.keys(socket.rooms)
   return rooms.filter(r => r !== socket.id)
  },
  listUsers(socket) {
    const users = nickNames[socket.id]
    return users
    // return users.filter(user => user !== undefined)
    // console.log(users);
  },

  nameOfUser (socket) {
    const user = nickNames[socket.id]
    // console.log(user);
    return user
  },

  listen (server) {
    chat = io(server)

    chat.on('connection', (socket) => {
      guestNum = this.assignGuestName(socket, guestNum, nickNames, usedNickNames)
      this.joinRoom(socket, 'Lobby')
      this.nicknameChangeRequest(socket, nickNames, usedNickNames)
      this.handleMessageBroadcast(socket, nickNames)
      this.handleRoomJoining(socket)

      socket.on('rooms', () => { // review

        let rooms = []
        let users = []
      	for (let s in chat.sockets.sockets) {
      	  rooms = rooms.concat(this.listRooms(chat.sockets.sockets[s]))
          users = users.concat(this.listUsers(chat.sockets.sockets[s]))
          user = this.nameOfUser(socket)
      	}
      	rooms = Array.from(new Set(rooms))
        users = Array.from(new Set(users))
        socket.emit('rooms', rooms)
        socket.emit('users', users)
        socket.emit('user', user)
      })

      this.onDisconnect(socket)
    })
  }
}

module.exports = chatServer;
