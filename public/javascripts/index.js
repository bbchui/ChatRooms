document.addEventListener('DOMContentLoaded', () => {
  const socket = require('socket.io-client')();
  const ChatUI = require('./chatUI');
  const myChat = new ChatUI(socket)

  // console.log(socket)
  // window.chat = new ChatUI(socket)

  socket.on('message', (message) => {
    myChat.addMsg(message.text)
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

  // socket.on('rooms', (rooms) => {
  //   myChat.roomList.innerHTML = ''
  //   rooms.forEach(room => myChat.addRoom(room))
  //   myChat.roomList.querySelectorAll('li').forEach(li => {
  //     li.addEventListener('click', (e) => {
  //       myChat.chat.processCommand(`/join ${li.textContent}`)
  //       myChat.input.focus()
  //     })
  //   })
  // })
  //
  // setInterval(() => {
  //   socket.emit('rooms')
  // }, 1000)
  //
  // myChat.input.focus()

})
