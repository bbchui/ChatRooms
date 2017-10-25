const io = require('socket.io');

let guestNum = 1;
const nickNames = {};
let usedNickNames = [];

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
        socket.emit('nameResult', {
          success: true,
          message: `${nickNames[socket.id]} changed their nickname to ${name}`
        });
        nickNames[socket.id] = name
        usedNickNames.push(name)
      }
    })
  },


  listen (server) {
    chat = io(server)

    chat.on('connection', () => {
    })
    console.log("connected");
  }
}

module.exports = chatServer
