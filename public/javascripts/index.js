document.addEventListener('DOMContentLoaded', () => {
  const io = require('socket.io-client');
  const ChatUI = require('./chatUI');
  const myChat = new ChatUI(io)

  console.log(io)
  window.chat = new ChatUI(io)

})
