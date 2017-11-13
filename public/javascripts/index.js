document.addEventListener('DOMContentLoaded', () => {
  const socket = require('socket.io-client')();
  const ChatUI = require('./chatUI');
  const myChat = new ChatUI(socket)

  // console.log(socket)
  window.chat = new ChatUI(socket)

  socket.on('message', (message) => {
    myChat.addMsg(message.text)

  })

  socket.on('joinResult', (result) => {
    myChat.setRoom(result.room)
    myChat.addMsg(`Entered ${result.room}`)
  })

  socket.on('nameResult', (result) => {
    let msg
    if (result.success) {
      msg = `Your nickname has been changed to ${result.name}`
    } else {
      msg = result.message
    }
    myChat.addMsg(msg)
  })

  socket.on('rooms', (rooms) => { // review
    myChat.roomList.innerHTML = ''
    rooms.forEach(room => myChat.addRoom(room))
    myChat.roomList.querySelectorAll('li').forEach(li => {
      li.addEventListener('click', (e) => {
        myChat.chat.processCommand(`/join ${li.textContent}`)
        myChat.input.focus()
      })
    })
  })

  socket.on('users', (users) => {
    myChat.users.innerHTML = ''
    users.forEach(user => myChat.addUser(user))
  })

  setInterval(() => { // review
    socket.emit('rooms')
  }, 1000)

  myChat.input.focus()

})
